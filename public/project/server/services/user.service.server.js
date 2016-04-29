"use strict";
var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose         = require("mongoose");
var bcrypt           = require('bcrypt-nodejs');

module.exports = function(app, userModel, reservationModel, postModel) {

    var authorize = authorized;
    var authorizeAdmin = isAdmin;

    app.post("/foodie/user/login",     passport.authenticate('foodie'), login);
    app.post("/foodie/user/register",  register  );
    app.post("/foodie/user/logout",    logout    );
    app.get ("/foodie/user/loggedin",  loggedin  );
    app.put ("/foodie/follow/",        authorize,  handleFollowing       );
    app.post("/foodie/user/",          authorize,  findUsersByUsernames  );
    app.post("/foodie/mail/",          authorize,  handleMail            );
    app.post("/foodie/posts/",         authorize,  getPosts              );
    app.post("/foodie/like/",          authorize,  handleLike              );
    app.post("/foodie/user/fav",       authorize,  handleFav             );
    app.post("/foodie/reserve/",       authorize,  makeReserve           );

    app.get   ("/foodie/admin/user",         authorizeAdmin,   getAllUsers  );
    app.post  ("/foodie/admin/user",         authorizeAdmin,   adminAdd     );
    app.get   ("/foodie/admin/user/:userId", authorizeAdmin,   findUserById );
    app.delete("/foodie/admin/user/:userId", authorizeAdmin,   adminDelete  );
    app.put   ("/foodie/admin/user/:userId", authorizeAdmin,   adminUpdate  );

    app.delete  ("/foodie/reserve/:id",             authorize,        deleteReserve         );
    app.get  ("/foodie/reserve/:username",          authorize,        findReserve           );
    app.post  ("/foodie/mail/:username",            authorize,        deleteMail            );
    app.post  ("/foodie/user/:username/:rID",       authorize,        addAffil               );
    app.delete("/foodie/user/affil/:username",      authorize,        removeAffil            );
    app.get   ("/foodie/reserve/user/:username",    authorize,        getReserve            );
    app.put   ("/foodie/mail/:username",            authorize,        readMail              );
    app.get   ("/foodie/user/search/:fname/:lname", authorize,        searchUser            );
    app.get   ("/foodie/user/:username",            authorize,        findUserByUsername    );
    app.put   ("/foodie/user/:userId",              authorize,        updateUser            );
    app.delete("/foodie/user/:userId",              authorize,        deleteUser            );


    //passport.serializeUser(serializeUser);
    //passport.deserializeUser(deserializeUser);

    app.get   ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/project/client/#/profile',
            failureRedirect: '/project/client/#/login'
        }));

    app.get   ('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get   ('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/project/client/#/profile',
            failureRedirect: '/project/client/#/login'
        }));

    var googleConfig = {
        clientID        : process.env.GOOGLE_CLIENT_ID,
        clientSecret    : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL     : process.env.GOOGLE_CALLBACK_URL
    };

    var facebookConfig = {
        clientID        : process.env.FACEBOOK_CLIENT_ID,
        clientSecret    : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL     : process.env.FACEBOOK_CALLBACK_URL
    };

    passport.use('foodie', new LocalStrategy(foodieLoginStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var newFacebookUser = {
                            lastName:  profile.displayName.substr(profile.displayName.indexOf(' ')+1),
                            firstName: profile.displayName.substr(0,profile.displayName.indexOf(' ')),
                            username: randomString(),
                            password: randomString(),
                            email: profile.emails ? profile.emails[0].value:"",
                            type: 'foodie',
                            facebook: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newFacebookUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var newGoogleUser = {
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            email: profile.emails[0].value,
                            username: randomString(),
                            password: randomString(),
                            type: 'foodie',
                            google: {
                                id:          profile.id,
                                token:       token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function randomString()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function handleLike(req, res) {
        var likeObj = req.body;
        if (likeObj.stat) {
            postModel
                .likePost(likeObj.post, likeObj.user)
                .then(function(post) {
                        res.json(post);
                    },
                    function (err) {
                        res.status(400).send(err);
                    })
        } else {
            postModel
                .dislikePost(likeObj.post, likeObj.user)
                .then(function(post) {
                        res.json(post);
                    },
                    function (err) {
                        res.status(400).send(err);
                    })
        }
    }

    function addAffil(req, res) {
        var username = req.params.username;
        var rID = req.params.rID;
        userModel
            .addAffil(username, rID)
            .then(function(user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function getPosts(req, res) {
        var usernames = req.body;
        postModel
            .findPostsforUsernames(usernames)
            .then(function(posts) {
                    res.json(posts);
                },
                function(err) {
                    res.status(400).send(err);
                })
    }

    function removeAffil(req, res) {
        var username = req.params.username;
        userModel
            .removeAffil(username)
            .then(function(user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function findReserve(req, res) {
        var username = req.params.username;
        reservationModel
            .findReservationByUsername(username)
            .then(function(reservs) {
                    res.json(reservs);
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function deleteReserve(req, res) {
        var reserveID = req.params.id;
        reservationModel
            .deleteReservation(reserveID)
            .then(function(reservs) {
                    res.send(204);
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function getReserve(req, res) {
        var username = req.params.username;
        reservationModel
            .findReservationByUsername(username)
            .then(function(reservs) {
                    res.json(reservs);
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function makeReserve(req, res) {
        var reservation = req.body;
        reservationModel
            .createReservation(reservation)
            .then(function (reserv) {
                    res.json(reserv);
                },
                function(error) {
                    res.status(400).send(err);
                })
    }

    function handleFav(req, res) {
        if (req.body.stat) {
            userModel
                .addFav(req.body.username, req.body.rID)
                .then(function (user) {
                        res.json(user);
                    },
                    function(err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                )
        } else {
            userModel
                .removeFav(req.body.username, req.body.rID)
                .then(function (user) {
                        res.json(user);
                    },
                    function(err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                )
        }

    }

    function searchUser(req, res) {
        var fname = req.params.fname;
        var lname = req.params.lname;

        fname = fname=="_"? "": fname;
        lname = lname=="_"? "": lname;

        userModel
            .findUserLikeName(fname, lname)
            .then(
                function(results) {
                    res.json(results);
                },
                function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }
            )
    }

    function handleMail(req, res) {
        var compose = req.body;
        var mail = {
            from: compose.from,
            subject: compose.sub,
            body: compose.message
        };

        userModel
            .findUserByUsername(compose.to)
            .then(
                function(user) {
                    if (user) {
                        return userModel.sendMail(mail, compose.to);
                    } else {
                        res.json({status: "error", message: "Invalid recipient!"})
                    }
                },
                function(err) {
                    res.json({status: "error", message: "Internal Error"})
                }
            )
            .then(
                function(user) {
                    res.json({status: "success", message: "Message sent."})
                },
                function(err) {
                    console.log(err);
                    res.json({status: "error", message: "Internal Error"})
                }
            );
    }

    function deleteMail(req, res) {
        var compose = req.body;
        var username = req.params.username;
        var mailId = compose.id;

        userModel
            .deleteMail(username, mailId)
            .then(
                function(user) {
                    if (user) {
                        res.json(user);
                    } else {
                        res.json(null);
                    }
                },
                function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }
            );
    }

    function readMail(req, res) {
        var compose = req.body;
        var username = req.params.username;
        var mailId = compose.id;

        userModel
            .readMail(username, mailId)
            .then(
                function(user) {
                    if (user) {
                        res.json(user);
                    } else {
                        res.json(null);
                    }
                },
                function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }
            );
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function isAdmin(req, res, next) {
        if (req.isAuthenticated() || req.user.roles.indexOf('admin')>-1) {
            next();
        } else {
            res.send(403);
        }
    }

    function foodieLoginStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if (user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else  {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }
    //
    //function serializeUser(user, done) {
    //    done(null, user);
    //}
    //
    //function deserializeUser(user, done) {
    //    userModel
    //        .findUserById(user._id)
    //        .then(
    //            function(user){
    //                done(null, user);
    //            },
    //            function(err){
    //                done(err, null);
    //            }
    //        );
    //}

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function register(req, res) {
        var newUser = req.body;
        newUser.roles = ['user'];

        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    if(user) {
                        res.json(null);
                    } else {
                        newUser.password = bcrypt.hashSync(newUser.password);
                        return userModel.createUser(newUser);
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function adminAdd(req, res) {
        var newUser = req.body;

        if(!newUser.roles) {
            newUser.roles = ["user"];
        } else {
            newUser.roles = newUser.roles.replace(/\s+/g, '').split(",");
        }

        // first check if a user already exists with the username
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    // if the user does not already exist
                    if(user == null) {
                        // create a new user
                        newUser.password = bcrypt.hashSync(newUser.password);
                        return userModel.createUser(newUser)
                            .then(
                                // fetch all the users
                                function(){
                                    return userModel.findAllUsers();
                                },
                                function (err) {
                                    res.status(400).send(err);
                                }
                            );
                        // if the user already exists, then just fetch all the users
                    } else {
                        return userModel.findAllUsers();
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function adminUpdate(req, res) {
        var userId = req.params.userId;
        var user = req.body;

        if(typeof user.roles == "string") {
            user.roles = user.roles.replace(/\s+/g, '').split(",");
        }

        if (user.password.length > 0) {
            user.password = bcrypt.hashSync(user.password);
        } else {
            delete user.password;
        }

        userModel
            .updateUser(userId, user)
            .then(
                function(updatedUser){
                    return userModel.findAllUsers();
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    res.status(400).send(err);
                });
    }

    function adminDelete(req, res) {
        userModel
            .removeUser(req.params.userId)
            .then(
                function(user){
                    return userModel.findAllUsers();
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    res.status(400).send(err);
                });
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel
            .removeUser(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;

        if (user.password.length > 0) {
            user.password = bcrypt.hashSync(user.password);
        } else {
            delete user.password;
        }

        userModel
            .updateUser(userId, user)
            .then(
                function (updatedUser) {
                    if(updatedUser){
                        req.login(updatedUser, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(updatedUser);
                            }
                        });
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findUserByCredentials(req, res) {
        var credentials = {};
        credentials.username = req.query.username;
        credentials.password = req.query.password;
        userModel
            .findUserByCredentials(credentials)
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                });
    }

    function findUserByUsername(req, res) {
        var username = req.params.username;
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                });
    }

    function findUsersByUsernames(req, res) {
        var usernames = req.body;
        userModel
            .findUsersByUsernames(usernames)
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    console.log(err);
                    res.status(400).send(err);
                });
    }

    function getAllUsers(req, res) {
        userModel
            .findAllUsers()
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    res.status(400).send(err);
                });
    }

    function handleFollowing(req, res) {
        var username = req.body.username;
        var followname = req.body.followname;
        var mode = req.body.stat;

        if (mode == 0) {
            userModel
                .unfollow(username, followname)
                .then(
                    function (pair) {
                        res.json(pair);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        } else  {
            userModel
                .follow(username, followname)
                .then(
                    function (pair) {
                        res.json(pair);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
    }
};
