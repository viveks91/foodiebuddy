"use strict";
module.exports = function(mongoose) {

    // use mongoose to declare a user schema
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        image: String,
        email: [String],
        roles: [String],
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