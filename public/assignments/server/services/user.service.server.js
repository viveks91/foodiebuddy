"use strict";
module.exports = function(app, userModel) {
    app.post("/api/assignment/user", register);
    app.post("/api/assignment/admin/add", adminAdd);
    app.post("/api/assignment/logout", logout);
    app.post("/api/assignment/login", login);
    app.get("/api/assignment/loggedin", loggedin);
    app.get("/api/assignment/user", getAllUsers);
    app.get("/api/assignment/user/:id", findUserById);
    //app.get("/api/assignment/user?username=username", findUserByUsername);
    //app.get("/api/assignment/user?username=alice&password=wonderland", findUserByCredentials);
    app.put("/api/assignment/user/:id", updateUser);
    app.put("/api/assignment/admin/update/:id", adminUpdate);
    app.delete("/api/assignment/user/:id", deleteUser);

    var uuid = require('uuid');

    function login(req, res) {
        var credentials = req.body;
        var user = userModel.findUserByCredentials(credentials);
        req.session.currentUser = user;
        res.json(user);
    }

    function adminAdd(req, res) {
        var user = req.body;
        user._id = uuid.v1();
        user = userModel.createUser(user);
        res.json(userModel.findAllUsers());
    }

    function adminUpdate(req, res) {
        var userId = req.params.id;
        var user = req.body;
        res.json(userModel.updateUser(userId, user));
    }

    function deleteUser(req, res) {
        var userId = req.params.id;
        userModel.deleteUser(userId);
    }

    function updateUser(req, res) {
        var userId = req.params.id;
        var user = req.body;
        req.session.currentUser = user;
        res.json(userModel.updateUser(userId, user));
    }

    function findUserByCredentials(req, res) {
        var credentials = {};
        credentials.username = req.query.username;
        credentials.password = req.query.password;
        res.json(userModel.findUserByCredentials(credentials));
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        res.json(userModel.findUserByUsername(username));
    }

    function findUserById(req, res) {
        var userId = req.params.id;
        res.json(userModel.findUserById(userId));
    }

    function getAllUsers(req, res) {
        if (req.query.hasOwnProperty("username")) {
            if (req.query.hasOwnProperty("password")) {
                findUserByCredentials(req, res);
            } else {
                findUserByUsername(req, res);
            }
        } else {
            res.json(userModel.findAllUsers());
        }
    }

    function register(req, res) {
        var user = req.body;
        user._id = uuid.v1();
        user = userModel.createUser(user);
        req.session.currentUser = user;
        res.json(user);
    }

    function login(req, res) {
        var credentials = req.body;
        var user = userModel.findUserByCredentials(credentials);
        req.session.currentUser = user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.json(req.session.currentUser);
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }
};
