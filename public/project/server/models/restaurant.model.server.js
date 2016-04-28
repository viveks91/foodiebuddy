"use strict";

module.exports = function(db, mongoose) {
    // load user schema
    var RestaurantSchema = require("./restaurant.schema.server.js")(mongoose);
    var RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);

    var api = {
        createRestaurant: createRestaurant,
        findRestaurantByRID: findRestaurantByRID,
        addFav: addFav,
        removeFav: removeFav,
        findRestaurantsByRIDs: findRestaurantsByRIDs,
        addReview: addReview
    };
    return api;

    function addReview(rID, review) {
        delete review._id;
        return RestaurantModel
            .findOne({rID: rID})
            .then(
                function(restaurant){
                    if (restaurant) {
                        for (var i =0; i <restaurant.reviews.length; i++) {
                            if (restaurant.reviews[i].username == review.username) {
                                restaurant.reviews[i].rating = review.rating;
                                restaurant.reviews[i].body = review.body;
                                restaurant.markModified("reviews");
                                return restaurant.save();
                            }
                        }
                        restaurant.reviews.unshift(review);
                        restaurant.markModified("reviews");
                        return restaurant.save();
                    }
                }
            )
    }

    function findRestaurantsByRIDs(rIDs) {
        return RestaurantModel.find({'rID': {$in: rIDs}});
    }

    function createRestaurant (restaurant) {
        delete restaurant['_id'];
        return RestaurantModel.create(restaurant);
    }

    function findRestaurantByRID (rID) {
        return RestaurantModel.findOne({rID: rID});
    }

    function addFav(username, rID) {
        return RestaurantModel
            .findOne({rID: rID})
            .then(
                function(restaurant){
                    if (restaurant) {
                        if (restaurant.favs.indexOf(username) == -1) {
                            restaurant.favs.push(username);
                        }
                        restaurant.markModified("favs");
                        return restaurant.save();
                    }
                }
            )
    }

    function removeFav(username, rID) {
        return RestaurantModel
            .findOne({rID: rID})
            .then(
                function(restaurant){
                    if (restaurant) {
                        if (restaurant.favs.indexOf(username) != -1) {
                            restaurant.favs.splice(restaurant.favs.indexOf(username), 1);
                        }
                        restaurant.markModified("favs");
                        return restaurant.save();
                    }
                }
            )
    }
};