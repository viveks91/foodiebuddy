"use strict";
var passport = require('passport');
var mongoose = require('mongoose');

module.exports = function(app, db) {
    var hwUserModel = require("./assignments/server/models/user.model.server.js")(db, mongoose);
    var foodieUserModel = require("./project/server/models/user.model.server.js")(db, mongoose);

    var assignment = require("./assignments/server/app.js")(app, db, hwUserModel);
    var foodie = require("./project/server/app.js")(app, db, foodieUserModel);

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        var userModel = null;
        if (user.type == 'foodie') {
            userModel = foodieUserModel;
        } else {
            userModel = hwUserModel;
        }
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
    });
};
