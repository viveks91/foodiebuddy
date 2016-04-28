"use strict";
var bcrypt = require('bcrypt-nodejs');
var mongoose      = require('mongoose');

module.exports = function(app, db, userModel) {
    var formModel = require("./models/form.model.server.js")(db, mongoose);
    var fieldModel = require("./models/field.model.server.js")(db, mongoose);

    // Initial mock data load
    function init() {
        var forms = require("./models/form.mock.json");
        var users = require("./models/user.mock.json");
        var UserSchema = require("./models/user.schema.server.js")(mongoose);
        var FormSchema = require("./models/form.schema.server.js")(mongoose);
        var UserModel = mongoose.model('LoadUser', UserSchema);
        var FormModel = mongoose.model('LoadForm', FormSchema);

        for (var u in users) {
            users[u].password = bcrypt.hashSync(users[u].password);
        }

        UserModel.findOneAndUpdate(
            {username: users[0].username},
            users[0],
            {upsert: true},
            function(user) {}
        );

        UserModel.findOneAndUpdate(
            {username: users[1].username},
            users[1],
            {upsert: true, new: true},
            function(err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                forms[0].userId = user['_id'];
                FormModel.findOneAndUpdate(
                    {title: forms[0].title, userId: forms[0].userId},
                    forms[0],
                    {upsert: true},
                    function(){}
                );
            }
        );

        UserModel.findOneAndUpdate(
            {username: users[2].username},
            users[2],
            {upsert: true, new: true},
            function(err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                forms[1].userId = user['_id'];
                FormModel.findOneAndUpdate(
                    {title: forms[1].title, userId: forms[1].userId},
                    forms[1],
                    {upsert: true},
                    function(){}
                );
            }
        );
    }
    init();

    var userService = require("./services/user.service.server.js") (app, userModel);
    var formService = require("./services/form.service.server.js") (app, formModel);
    var fieldService = require("./services/field.service.server.js") (app, fieldModel);
};
