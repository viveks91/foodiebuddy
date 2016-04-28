"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("HomeController", HomeController);

    function HomeController($location, $rootScope, UserService){
        var vm = this;
        vm.likePost = likePost;
        vm.dislikePost = dislikePost;

        function init() {
            vm.$location = $location;
            vm.posts = [];
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.user = response.data;
                    return UserService.getPosts(vm.user.following);
                })
                .then(function(response) {
                    var posts = response.data;
                    for(var i=0; i< posts.length; i++) {
                        loadDetails(posts[i]);
                    }
                })
        }
        init();

        function loadDetails(post) {
            UserService
                .findUserByUsername(post.username)
                .then(function(response) {
                    var user = response.data;
                    post.user = user.firstName + " " + user.lastName;
                    post.image = user.image;
                    vm.posts.push(post);
                })
        }

        function likePost(postId) {
            UserService
                .likePost(postId, vm.user.username)
                .then(function(response) {
                    for (var i=0; i< vm.posts.length; i++) {
                        if (postId == vm.posts[i]._id) {
                            vm.posts[i].likes.push(vm.user.username);
                            break;
                        }
                    }
                })
        }

        function dislikePost(postId) {
            UserService
                .dislikePost(postId, vm.user.username)
                .then(function(response) {
                    for (var i=0; i< vm.posts.length; i++) {
                        if (postId == vm.posts[i]._id) {
                            vm.posts[i].likes.splice(vm.posts[i].likes.indexOf(vm.user.username), 1);
                            break;
                        }
                    }
                })
        }
    }
})();