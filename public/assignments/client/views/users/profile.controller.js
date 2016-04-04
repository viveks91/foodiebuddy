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
                    vm.user['email'] = vm.user['email'].toString();
                })
        }
        init();

        function updateUser(newUser) {
            newUser['email'] = newUser['email'].split(",");
            UserService
                .updateUser(newUser._id, newUser)
                .then(function(response){
                    var user = response.data;
                    UserService.setCurrentUser(user);
                });

        }
    }
})();