"use strict";
module.exports = function(app, userModel) {
    app.post("/api/assignment/user", register);
    app.post("/api/assignment/admin/add", adminAdd);
    app.post("/api/assignment/user/logout", logout);
    app.post("/api/assignment/user/login", login);
    app.get("/api/assignment/user/loggedin", loggedin);
    app.get("/api/assignment/user", getAllUsers);
    app.get("/api/assignment/user/isAdmin", isAdmin);
    app.get("/api/assignment/user/:id", findUserById);
    //app.get("/api/assignment/user?username=username", findUserByUsername);
    //app.get("/api/assignment/user?username=alice&password=wonderland", findUserByCredentials);
    app.put("/api/assignment/user/:id", updateUser);
    app.put("/api/assignment/admin/update/:id", adminUpdate);
    app.delete("/api/assignment/user/:id", deleteUser);

    function isAdmin(req, res) {
        if (req.session.currentUser != null) {
            res.json(req.session.currentUser.roles.indexOf('admin')>-1);
        } else {
            res.json(false);
        }
    }

    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(
                function (user) {
                    req.session.currentUser = user;
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function adminAdd(req, res) {
        var user = req.body;
        userModel
            .createUser(user)
            .then(
                function (newUser) {
                    userModel
                        .findAllUsers()
                        .then(
                            function (users) {
                                res.json(users);
                            },
                            function (err) {
                                res.status(400).send(err);
                            }
                        );
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function adminUpdate(req, res) {
        var userId = req.params.id;
        var user = req.body;
        userModel
            .updateUser(userId, user)
            .then(
                function (updatedUser) {
                    userModel
                        .findAllUsers()
                        .then(
                            function (users) {
                                res.json(users);
                            },
                            function (err) {
                                res.status(400).send(err);
                            }
                        );
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params.id;
        userModel
            .deleteUser(userId)
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.id;
        var user = req.body;

        userModel
            .updateUser(userId, user)
            .then(
                function (updatedUser) {
                    req.session.currentUser = updatedUser;
                    res.json(updatedUser);
                },
                function (err) {
                    console.log(err);
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
                }
            );
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
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.id;
        userModel
            .findUserById(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
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
                    }
                );
        }
    }

    function register(req, res) {
        var newUser = req.body;
        userModel
            .createUser(newUser)
            .then(
                function (user) {
                    req.session.currentUser = user;
                    res.json(user);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(
            function (user) {
                req.session.currentUser = user;
                res.json(user);
            },
            function (err) {
                res.status(400).send(err);
            }
        );
    }

    function loggedin(req, res) {
        res.json(req.session.currentUser);
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }
};
