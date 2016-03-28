"use strict";
var mock = require("./user.mock.json");
module.exports = function(app) {
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
        return mock;
    }

    function updateUser(userId, updatedUser) {
        for(var u in mock) {
            if( mock[u]._id == userId ) {
                mock[u].firstName = updatedUser.firstName;
                mock[u].lastName = updatedUser.lastName;
                mock[u].username = updatedUser.username;
                mock[u].password = updatedUser.password;
                mock[u].email = updatedUser.email;
                mock[u].roles = updatedUser.roles;
                break;
            }
        }
        return mock;
    }

    function deleteUser(userId) {
        for(var u in mock) {
            if( mock[u]._id == userId ) {
                mock.splice(u,1);
                break;
            }
        }
        return mock;
    }

    function findUsersByIds(userIds) {
        var users = [];
        for (var u in userIds) {
            var user = findUserById (userIds[u]);
            if (user) {
                users.push (user);
            }
        }
        return users;
    }

    function findUserById(userId) {
        for(var u in mock) {
            if( mock[u]._id == userId ) {
                return mock[u];
            }
        }
        return null;
    }

    function createUser(user) {
        mock.push(user);
        return user;
    }

    function findUserByCredentials(credentials) {
        for(var u in mock) {
            if( mock[u].username === credentials.username &&
                mock[u].password === credentials.password) {
                return mock[u];
            }
        }
        return null;
    }

    function findUserByUsername(username) {
        for(var u in mock) {
            if( mock[u].username === username) {
                return mock[u];
            }
        }
        return null;
    }
};