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
            vm.followingCount = 12;
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.currentUser = response.data;
                    reloadDetails(vm.currentUser.following);
                })
        }
        init();

        function reloadDetails(usernames) {
            UserService
                .findUsersByUsernames(usernames)
                .then(function(response) {
                    vm.totalFollowing = response.data;
                    vm.following = vm.totalFollowing.slice(vm.followingCount-12, vm.followingCount);
                    vm.followingCount = 12;
                })
        }

        function unfollow(username) {
            UserService
                .handleFollow(vm.currentUser.username, username, 0)
                .then(function(response) {
                    UserService.setCurrentUser(response.data[0]);
                    reloadDetails(response.data[0].following);
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