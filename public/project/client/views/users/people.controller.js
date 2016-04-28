"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("PeopleController", PeopleController);


    function PeopleController($location, UserService, $routeParams){
        var vm = this;
        vm.unfollow = unfollow;
        vm.follow = follow;
        vm.moreFollowing = moreFollowing;
        vm.href = href;

        function init() {
            vm.$location = $location;


            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.currentUser = response.data;
                    if (response.data.username == $routeParams.username) {
                        $location.url('/profile');
                    }
                });
            UserService
                .findUserByUsername($routeParams.username)
                .then(function(response) {
                    if (response.data == null) {
                        $location.url('/notFound');
                    }
                    vm.user = response.data;
                    return UserService.findUsersByUsernames(vm.user.following)
                })
                .then(function(response) {
                    vm.totalFollowing = response.data;
                    vm.following = vm.totalFollowing.slice(0,6);
                    vm.followingCount = 6;

                });
            vm.moreInfo = false;
        }
        init();

        function unfollow() {
            UserService
                .handleFollow(vm.currentUser.username, vm.user.username, 0)
                .then(function(response) {
                    var user = response.data[1];
                    UserService.setCurrentUser(response.data[0]);
                });
        }

        function follow() {
            UserService
                .handleFollow(vm.currentUser.username, vm.user.username, 1)
                .then(function(response) {
                    var user = response.data[1];
                    UserService.setCurrentUser(response.data[0]);
                });
        }

        function moreFollowing() {
            if (vm.followingCount >= vm.totalFollowing.length) {
                return;
            }
            vm.following = vm.totalFollowing.slice(vm.followingCount, vm.followingCount+6);
            vm.followingCount = vm.followingCount + 6;
        }

        function href(username) {
            vm.$location.url("/profile/"+ username);
        }
    }
})();