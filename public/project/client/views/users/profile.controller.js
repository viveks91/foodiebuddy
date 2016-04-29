"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("ProfileController", ProfileController);

    function ProfileController(UserService, $location){

        var vm = this;
        vm.updateUser = updateUser;
        vm.moreFollowers = moreFollowers;
        vm.href = href;

        function init() {
            vm.$location = $location;
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.user = response.data;
                    vm.user['email'] = vm.user['email'].toString();
                    vm.user['password'] = "";
                    return UserService.findUsersByUsernames(vm.user.followers)
                })
                .then(function(response) {
                    vm.totalFollowers = response.data;
                    vm.followers = vm.totalFollowers.slice(0,6);
                    vm.followersCount = 6;
                });

            vm.editInfo = false;
            vm.moreInfo = false;
        }
        init();

        function updateUser(newUser) {
            if(newUser.gender == 1) {
                newUser.image = "images/dp3.png";
            } else {
                newUser.image = "images/dp4.png";
            }
            UserService
                .updateUser(newUser._id, newUser)
                .then(function(response){
                    var user = response.data;
                    UserService.setCurrentUser(user);
                    vm.editInfo = false;
                    vm.moreInfo = false;
                });
        }

        function moreFollowers() {
            if (vm.followersCount >= vm.totalFollowers.length) {
                return;
            }
            vm.followers = vm.totalFollowers.slice(vm.followersCount, vm.followersCount+6);
            vm.followersCount = vm.followersCount + 6;
        }

        function href(username) {
            vm.$location.url("/profile/"+ username);
        }
    }
})();