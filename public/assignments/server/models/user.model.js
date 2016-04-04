"use strict";

// load q promise library
var q = require("q");
var mock = require("./user.mock.json");

module.exports = function(db, mongoose) {

    // load user schema
    var UserSchema = require("./user.schema.server.js")(mongoose);

    // create user model from schema
    var UserModel = mongoose.model('User', UserSchema);

    // Mock data load
    function init() {
        for (var i=0; i< mock.length; i++){
            var query = UserModel.findOneAndUpdate(
                {username: mock[i].username},
                mock[i],
                {upsert: true}
            );
            query.exec();
        }
    }
    init();

    var api = {
        findUserByCredentials: findUserByCredentials,
        createUser: createUser,
        findUserById: findUserById,
        findUsersByIds: findUsersByIds,
        findAllUsers: findAllUsers,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByUsername: findUserByUsername
    };
    return api;

    function findAllUsers() {
        var deferred = q.defer();

        UserModel.find(function (err, users) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(users);
            }
        });

        return deferred.promise;
    }

    function updateUser(userId, updatedUser) {
        delete updatedUser['_id'];
        return UserModel.findOneAndUpdate(userId, updatedUser, {new: true});
    }

    function deleteUser(userId) {
        return UserModel.findByIdAndRemove(userId);
    }

    function findUsersByIds(userIds) {
        return UserModel.find({'_id': {$in: userIds}});
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserByCredentials(credentials) {
        return UserModel.findOne(credentials);
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }
};