"use strict";

module.exports = function(mongoose) {

    var RestaurantSchema = mongoose.Schema({
        name: String,
        address: String,
        phone: String,
        image: String,
        rID: String,
        url: String,
        ratingImage: String,
        snippet: String,
        rating: Number,
        categories: String,
        favs: [String],
        reviews: [{
            username: String,
            body: String,
            rating: String
        }]

    }, {collection: 'foodie.restaurant'});

    RestaurantSchema.index({ rID: 1});
    RestaurantSchema.set('autoIndex', false);

    return RestaurantSchema;
};