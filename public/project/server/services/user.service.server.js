"use strict";
var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose         = require("mongoose");
var bcrypt           = require('bcrypt-nodejs');

module.exports = function(app, userModel) {

    var auth = authorized;
    var authAdmin = isAdmin;

    app.post("/foodie/user/login",     passport.authenticate('local'), login);
    app.post("/foodie/user/register",  register  );
    app.post("/foodie/user/logout",    logout    );
    app.get ("/foodie/user/loggedin",  loggedin  );

    app.get   ("/foodie/admin/user",         authAdmin,   getAllUsers  );
    app.post  ("/foodie/admin/user",         authAdmin,   adminAdd     );
    app.get   ("/foodie/admin/user/:userId", authAdmin,   findUserById );
    app.delete("/foodie/admin/user/:userId", authAdmin,   adminDelete  );
    app.put   ("/foodie/admin/user/:userId", authAdmin,   adminUpdate  );

    app.put   ("/foodie/user/:userId", auth,  updateUser    );
    app.delete("/foodie/user/:userId", auth,  deleteUser    );

    //app.get("/api/assignment/user?username=username", findUserByUsername);
    //app.get("/api/assignment/user?username=alice&password=wonderland", findUserByCredentials);

    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

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

    function localStrategy(username, password, done) {
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

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

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

        if(newUser.roles && newUser.roles.length > 1) {
            newUser.roles = newUser.roles.replace(/\s+/g, '').split(",");
        } else {
            newUser.roles = ["user"];
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
        var username = req.query.username;
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

    function getAllUsers(req, res) {
        if (req.query.hasOwnProperty("username")) {
            if (req.query.hasOwnProperty("password")) {
                findUserByCredentials(req, res);
            } else {
                findUserByUsername(req, res);
            }
        } else {
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
    }
};
