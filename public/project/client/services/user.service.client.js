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
            adminDelete:adminDelete
        };
        return api;

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
            return $http.get("/foodie/user?username="+username);
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
    }
})();