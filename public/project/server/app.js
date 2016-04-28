"use strict";
var bcrypt = require('bcrypt-nodejs');
var mongoose      = require('mongoose');

module.exports = function(app, db, foodieUserModel) {
    var restaurantModel = require("./models/restaurant.model.server.js")(db, mongoose);
    var reservationModel = require("./models/reservation.model.server.js")(db, mongoose);
    var postModel = require("./models/post.model.server.js")(db, mongoose);

    var foodieUserService = require("./services/user.service.server.js") (app, foodieUserModel, reservationModel, postModel);
    var restaurantService = require("./services/restaurant.service.server.js") (app, restaurantModel, reservationModel, postModel);

    function init() {
        var initUsers = require("./models/user.mock.json");
        var FoodieUserSchema = require("./models/user.schema.server.js")(mongoose);
        var FoodieUserModel = mongoose.model('LoadFoodieUser', FoodieUserSchema);

        for (var u in initUsers) {
            initUsers[u].password = bcrypt.hashSync(initUsers[u].password);
            FoodieUserModel
                .findOneAndUpdate(
                    {username: initUsers[u].username},
                    initUsers[u],
                    {upsert: true},
                    function(user) {}
                );
        }

        //FoodieUserModel
        //    .findOneAndUpdate(
        //        {username: initUsers[0].username},
        //        initUsers[0],
        //        {upsert: true},
        //        function(user) {}
        //);
        //
        //FoodieUserModel
        //    .findOneAndUpdate(
        //        {username: initUsers[1].username},
        //        initUsers[1],
        //        {upsert: true},
        //        function(user) {}
        //    )
    }

    init();
};
