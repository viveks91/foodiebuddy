"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("FollowersController", FollowersController);


    function FollowersController(UserService, $location){
        var vm = this;
        vm.moreFollowers = moreFollowers;
        vm.href = href;

        function init() {
            vm.$location = $location;
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.currentUser = response.data;
                    return UserService.findUsersByUsernames(vm.currentUser.followers)
                })
                .then(function(response) {
                    vm.totalFollowers = response.data;
                    vm.followers = vm.totalFollowers.slice(0,12);
                    vm.followersCount = 12;
                });
        }
        init();

        function moreFollowers() {
            if (vm.followersCount >= vm.totalFollowers.length) {
                return;
            }
            vm.followers = vm.totalFollowers.slice(vm.followersCount, vm.followersCount+12);
            vm.followersCount = vm.followersCount + 12;
        }

        function href(username) {
            vm.$location.url("/profile/"+ username);
        }
    }
})();