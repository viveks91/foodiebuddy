"use strict";

module.exports = function(db, mongoose) {

    // load user schema
    var FoodieUserSchema = require("./user.schema.server.js")(mongoose);

    // create user model from schema
    var FoodieUserModel = mongoose.model('FoodieUser', FoodieUserSchema);

    var api = {
        findUserByCredentials: findUserByCredentials,
        createUser: createUser,
        findUserById: findUserById,
        findUsersByUsernames: findUsersByUsernames,
        findAllUsers: findAllUsers,
        updateUser: updateUser,
        removeUser: removeUser,
        findUserByUsername: findUserByUsername,
        findUserByFacebookId: findUserByFacebookId,
        findUserByGoogleId: findUserByGoogleId,
        unfollow: unfollow,
        follow: follow,
        findUserLikeName:findUserLikeName,
        sendMail: sendMail,
        deleteMail: deleteMail,
        readMail: readMail,
        addFav: addFav,
        removeFav: removeFav,
        addAffil: addAffil,
        removeAffil: removeAffil
    };
    return api;

    function addAffil(username, rID) {
        return FoodieUserModel.findOneAndUpdate(
            {username: username},
            {
                "$set": {
                    "affil": rID
                }
            },
            {new: true}
        );
    }

    function removeAffil(username) {
        return FoodieUserModel.findOneAndUpdate(
            {username: username},
            {
                "$set": {
                    "affil": "none"
                }
            },
            {new: true}
        );
    }

    function findUserByFacebookId(facebookId) {
        return FoodieUserModel.findOne({'facebook.id': facebookId});
    }

    function findUserLikeName(fname, lname) {
        if (fname.length == 0) {
            return FoodieUserModel
                .find({
                    lastName: new RegExp(lname, "i")
                })
                .limit(12);
        } else {
            return FoodieUserModel
                .find({
                    firstName: new RegExp(fname, "i")
                })
                .where('lastName').equals(new RegExp(lname, "i"))
                .limit(12);
        }
    }

    function findUserByGoogleId(googleId) {
        return FoodieUserModel.findOne({'google.id': googleId});
    }

    function findAllUsers() {
        return FoodieUserModel.find();
    }

    function updateUser(userId, updatedUser) {
        delete updatedUser['_id'];
        return FoodieUserModel.findByIdAndUpdate(userId, updatedUser, {new: true});
    }

    function removeUser(userId) {
        return FoodieUserModel.findByIdAndRemove(userId);
    }

    function findUsersByUsernames(usernames) {
        return FoodieUserModel.find({'username': {$in: usernames}});
    }

    function findUserById(userId) {
        return FoodieUserModel.findById(userId);
    }

    function createUser(user) {
        delete user['_id'];
        return FoodieUserModel.create(user);
    }

    function findUserByCredentials(credentials) {
        return FoodieUserModel.findOne({
                username: credentials.username,
                password: credentials.password
            }
        );
    }

    function findUserByUsername(username) {
        return FoodieUserModel.findOne({username: username});
    }

    function unfollow(username, followname) {
        var response = [];
        return FoodieUserModel
            .findOne({username: username})
            .then(
                function(user){
                    if (user) {
                        if (user.following.indexOf(followname) != -1) {
                            user.following.splice(user.following.indexOf(followname),1);
                        }
                        user.markModified("following");
                        response.push(user);
                        user.save();
                    }
                    return FoodieUserModel
                        .findOne({username: followname})
                }
            )
            .then(
                function(follow) {
                    if (follow) {
                        if (follow.followers.indexOf(username) != -1) {
                            follow.followers.splice(follow.followers.indexOf(username),1);
                        }
                        follow.markModified("followers");
                        response.push(follow);
                        follow.save();
                    }
                    return response;
                }
            )
    }

    function follow(username, followname) {

        var response = [];
        return FoodieUserModel
            .findOne({username: username})
            .then(
                function(user){
                    if (user) {
                        if (user.following.indexOf(followname) == -1) {
                            user.following.push(followname);
                        }
                        user.markModified("following");
                        response.push(user);
                        user.save();
                    }
                    return FoodieUserModel
                        .findOne({username: followname})
                }
            )
            .then(
                function(follow) {
                    if (follow) {
                        if (follow.followers.indexOf(username) == -1) {
                            follow.followers.push(username);
                        }
                        follow.markModified("followers");
                        response.push(follow);
                        follow.save();
                    }
                    return response;
                }
            )
    }

    function sendMail(mail, to) {
        return FoodieUserModel
            .findOne({username: to})
            .then(
                function(user){
                    if (user) {
                        user.mails.unshift(mail);
                        user.markModified("mails");
                        return user.save();
                    }
                }
            )
    }

    function deleteMail(username, mailId) {
        return FoodieUserModel
            .findOne({username: username})
            .then(
                function(user){
                    if (user) {
                        user.mails.id(mailId).remove();
                        user.markModified("mails");
                        return user.save();
                    }
                }
            )
    }

    function readMail(username, mailId) {
        return FoodieUserModel
            .findOne({username: username})
            .then(
                function(user){
                    if (user) {
                        user.mails.id(mailId).read = true;
                        user.markModified("mails");
                        return user.save();
                    }
                }
            )
    }

    function addFav(username, rID) {
        return FoodieUserModel
            .findOne({username: username})
            .then(
                function(user){
                    if (user) {
                        if (user.favs.indexOf(rID) == -1) {
                            user.favs.push(rID);
                        }
                        user.markModified("favs");
                        return user.save();
                    }
                }
            )
    }

    function removeFav(username, rID) {
        return FoodieUserModel
            .findOne({username: username})
            .then(
                function(user){
                    if (user) {
                        if (user.favs.indexOf(rID) != -1) {
                            user.favs.splice(user.favs.indexOf(rID), 1);
                        }
                        user.markModified("favs");
                        return user.save();
                    }
                }
            )
    }
};