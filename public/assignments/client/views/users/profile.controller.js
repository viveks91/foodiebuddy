"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("ProfileController", ProfileController);

    function ProfileController(UserService){

        var vm = this;
        vm.updateUser = updateUser;
        function init() {
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.user = response.data;
                })
        }
        init();

        function updateUser(newUser) {
            UserService
                .updateUser(newUser._id, newUser)
                .then(function(){
                });
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.updatedUser = response.data;
                    UserService.setCurrentUser(vm.updatedUser);
                })
        }
    }
})();