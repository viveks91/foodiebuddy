"use strict";
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, db, mongoose) {
    var userModel = require("./models/user.model.server.js")(db, mongoose);
    // Initial mock data load
    function init() {
        var users = require("./models/user.mock.json");
        var UserSchema = require("./models/user.schema.server.js")(mongoose);
        var UserModel = mongoose.model('LoadFoodieUser', UserSchema);

        for (var u in users) {
            users[u].password = bcrypt.hashSync(users[u].password);
        }

        UserModel.findOneAndUpdate(
            {username: users[0].username},
            users[0],
            {upsert: true},
            function(user) {}
        );
    }

    init();

    var userService = require("./services/user.service.server.js") (app, userModel);
};
