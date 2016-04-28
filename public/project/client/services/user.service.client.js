"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .factory("UserService", userService);

    function userService($http, $rootScope) {

        var api = {
            findUserByUsername:findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            findAllUsers: findAllUsers,
            register: register,
            deleteUserById: deleteUserById,
            updateUser: updateUser,
            getCurrentUser: getCurrentUser,
            setCurrentUser: setCurrentUser,
            logout: logout,
            adminAdd: adminAdd,
            adminUpdate: adminUpdate,
            login: login,
            adminDelete:adminDelete,
            handleFollow: handleFollow,
            findUsersByUsernames: findUsersByUsernames,
            search:search,
            sendMessage:sendMessage,
            deleteMessage: deleteMessage,
            readMessage: readMessage,
            handleFav: handleFav,
            makeReserv: makeReserv,
            deleteReserv: deleteReserv,
            findReserv: findReserv,
            addAffil: addAffil,
            removeAffil: removeAffil,
            getPosts: getPosts,
            likePost: likePost,
            dislikePost: dislikePost
        };
        return api;

        function likePost(postId, username) {
            return $http.post("/foodie/like/", {
                post: postId,
                user: username,
                stat: 1
            });
        }

        function dislikePost(postId, username) {
            return $http.post("/foodie/like/", {
                post: postId,
                user: username,
                stat: 0
            });
        }

        function getPosts(usernames) {
            return $http.post("/foodie/posts/", usernames);
        }

        function addAffil(username, rID) {
            return $http.post("/foodie/user/"+username+"/"+rID);
        }

        function removeAffil(username) {
            return $http.delete("/foodie/user/affil/"+username);
        }

        function findReserv(username) {
            return $http.get("/foodie/reserve/"+username);
        }

        function makeReserv(reserv) {
            return $http.post("/foodie/reserve/", reserv);
        }

        function deleteReserv(reservId) {
            return $http.delete("/foodie/reserve/" + reservId);
        }

        function handleFav(username, rID, stat) {
            return $http.post("/foodie/user/fav", {
                rID: rID,
                username: username,
                stat: stat
            });
        }

        function logout() {
            return $http.post("/foodie/user/logout");
        }

        function getCurrentUser() {
            return $http.get("/foodie/user/loggedin");
        }

        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function findUserByUsername(username) {
            return $http.get("/foodie/user/"+username);
        }

        function deleteMessage(username, mailId) {
            return $http.post("/foodie/mail/" + username, {id: mailId});
        }

        function readMessage(username, mailId) {
            return $http.put("/foodie/mail/" + username, {id: mailId});
        }

        function sendMessage(mail) {
            return $http.post("/foodie/mail/", mail);
        }

        function findUsersByUsernames(usernames) {
            return $http.post("/foodie/user/", usernames);
        }

        function findUserByCredentials (username, password) {
            return $http.get("/foodie/user?username="+username+"&password="+password);
        }

        function login(credentials) {
            return $http.post("/foodie/user/login", credentials);
        }

        function findAllUsers() {
            return $http.get("/foodie/admin/user");
        }

        function register(user) {
            return $http.post("/foodie/user/register", user);
        }

        function deleteUserById(userId) {
            return $http.delete("/foodie/user/"+userId);
        }

        function updateUser(userId, user) {
            return $http.put("/foodie/user/"+userId, user);
        }

        function adminAdd(user) {
            return $http.post("/foodie/admin/user", user);
        }

        function adminUpdate(userId, user) {
            return $http.put("/foodie/admin/user/"+userId, user);
        }

        function adminDelete(userId) {
            return $http.delete("/foodie/admin/user/"+userId);
        }

        function search(fname, lname) {
            fname = fname.length == 0? '_':fname;
            lname = lname.length == 0? '_':lname;
            return $http.get("/foodie/user/search/"+fname+"/"+lname);
        }

        function handleFollow(username, followname, stat) {
            return $http.put("/foodie/follow/", {
                username: username,
                followname: followname,
                stat: stat
            });
        }
    }
})();