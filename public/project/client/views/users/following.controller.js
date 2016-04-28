"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("FollowingController", FollowingController);


    function FollowingController(UserService, $location){
        var vm = this;
        vm.unfollow = unfollow;
        vm.moreFollowing = moreFollowing;
        vm.href = href;

        function init() {
            vm.$location = $location;
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.currentUser = response.data;
                    return UserService.findUsersByUsernames(vm.currentUser.following)
                })
                .then(function(response) {
                    vm.totalFollowing = response.data;
                    vm.following = vm.totalFollowing.slice(0,12);
                    vm.followingCount = 12;
                });
        }
        init();

        function unfollow(username) {
            UserService
                .handleFollow(vm.currentUser.username, username, 0)
                .then(function(response) {
                    UserService.setCurrentUser(response.data[0]);
                    vm.totalFollowing = response.data[0].following;
                    vm.following = vm.totalFollowing.slice(vm.followingCount-12, vm.followingCount);
                });
        }

        function moreFollowing() {
            if (vm.followingCount >= vm.totalFollowing.length) {
                return;
            }
            vm.following = vm.totalFollowing.slice(vm.followingCount, vm.followingCount+12);
            vm.followingCount = vm.followingCount + 12;
        }

        function href(username) {
            vm.$location.url("/profile/"+ username);
        }
    }
})();