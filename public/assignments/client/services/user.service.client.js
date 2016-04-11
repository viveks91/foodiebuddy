"use strict";
(function(){
    angular
        .module("FormBuilderApp")
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
            return $http.post("/api/assignment/user/logout");
        }

        function getCurrentUser() {
            return $http.get("/api/assignment/user/loggedin");
        }

        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function findUserByUsername(username) {
            return $http.get("/api/assignment/user?username="+username);
        }

        function findUserByCredentials (username, password) {
            return $http.get("/api/assignment/user?username="+username+"&password="+password);
        }

        function login(credentials) {
            return $http.post("/api/assignment/user/login", credentials);
        }

        function findAllUsers() {
            return $http.get("/api/assignment/admin/user");
        }

        function register(user) {
            return $http.post("/api/assignment/user/register", user);
        }

        function deleteUserById(userId) {
            return $http.delete("/api/assignment/user/"+userId);
        }

        function updateUser(userId, user) {
            return $http.put("/api/assignment/user/"+userId, user);
        }

        function adminAdd(user) {
            return $http.post("/api/assignment/admin/user", user);
        }

        function adminUpdate(userId, user) {
            return $http.put("/api/assignment/admin/user/"+userId, user);
        }

        function adminDelete(userId) {
            return $http.delete("/api/assignment/admin/user/"+userId);
        }
    }
})();