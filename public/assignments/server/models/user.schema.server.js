"use strict";
module.exports = function(mongoose) {

    // use mongoose to declare a user schema
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: [String],
        roles: [String],
        phones: [String]
    }, {collection: 'assignment.users'});

    UserSchema.index({ username: 1, password: 1 });
    UserSchema.set('autoIndex', false);

    return UserSchema;
};