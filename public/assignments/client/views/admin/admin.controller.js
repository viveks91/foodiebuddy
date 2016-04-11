"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("AdminController", AdminController);

    function AdminController($scope, UserService){
        var vm = this;

        vm.loadAllUsers = loadAllUsers;
        vm.addUser = addUser;
        vm.updateUser = updateUser;
        vm.removeUser = removeUser;
        vm.editUser = editUser;
        vm.allUsers = [];

        function init() {
            vm.sortType = 'username';
            vm.sortReverse = false;
            vm.edit = {};
            vm.loadAllUsers();
        }
        init();

        function loadAllUsers() {
            UserService
                .findAllUsers()
                .then(function(response) {
                    console.log(response.data);
                    vm.allUsers = angular.copy(response.data);
                });
        }

        function handleSuccess(response) {
            vm.edit = {};
            vm.allUsers = response.data;
        }

        function handleError(error) {
            $scope.error = error;
        }

        function addUser(newUser) {

            if (Object.keys(newUser).length == 0) {
                return;
            }

            UserService
                .adminAdd(newUser)
                .then(handleSuccess, handleError);
        }

        function updateUser(newUser) {
            if (Object.keys(newUser).length == 0) {
                return;
            }

            UserService
                .adminUpdate(newUser._id, newUser)
                .then(handleSuccess, handleError);
        }

        function removeUser(userId) {
            UserService
                .adminDelete(userId)
                .then(handleSuccess, handleError);
        }

        function editUser(selected) {
            vm.edit = angular.copy(selected);
            vm.edit.password = "";
        }
    }
})();