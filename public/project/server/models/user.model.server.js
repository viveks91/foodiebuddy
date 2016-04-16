"use strict";

module.exports = function(db, mongoose) {

    // load user schema
    var UserSchema = require("./user.schema.server.js")(mongoose);

    // create user model from schema
    var UserModel = mongoose.model('FoodieUser', UserSchema);

    var api = {
        findUserByCredentials: findUserByCredentials,
        createUser: createUser,
        findUserById: findUserById,
        findUsersByIds: findUsersByIds,
        findAllUsers: findAllUsers,
        updateUser: updateUser,
        removeUser: removeUser,
        findUserByUsername: findUserByUsername,
        findUserByFacebookId: findUserByFacebookId,
        findUserByGoogleId: findUserByGoogleId
    };
    return api;

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'google.id': googleId});
    }

    function findAllUsers() {
        return UserModel.find();
    }

    function updateUser(userId, updatedUser) {
        delete updatedUser['_id'];
        return UserModel.findByIdAndUpdate(userId, updatedUser, {new: true});
    }

    function removeUser(userId) {
        return UserModel.findByIdAndRemove(userId);
    }

    function findUsersByIds(userIds) {
        return UserModel.find({'_id': {$in: userIds}});
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function createUser(user) {
        delete user['_id'];
        return UserModel.create(user);
    }

    function findUserByCredentials(credentials) {
        return UserModel.findOne({
                username: credentials.username,
                password: credentials.password
            }
        );
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }
};