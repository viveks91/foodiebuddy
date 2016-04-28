"use strict";
//var mongoose      = require('mongoose');

module.exports = function(mongoose) {

    // use mongoose to declare a user schema
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        phone: String,
        fbprofile: String,
        email: String,
        roles: [String],
        address: String,
        gender: {type: Number, default: -1},
        type: {type: String, default: "foodie"},
        following: [String],
        followers: [String],
        favs: [String],
        affil: {type: String, default: "none"},
        image: {type: String, default: "images/dp4.png"},
        mails: [{
            read: {type: Boolean, default: false},
            from: String,
            time: {type: Date, default: Date.now},
            subject: String,
            body: String
        }],
        google: {
            id:    String,
            token: String
        },
        facebook: {
            id:    String,
            token: String
        }
    }, {collection: 'foodie.users'});

    UserSchema.index({ username: 1, password: 1 });
    UserSchema.set('autoIndex', false);

    return UserSchema;
};