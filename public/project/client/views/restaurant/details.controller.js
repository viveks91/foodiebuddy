"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("DetailsController", DetailsController);

    function DetailsController($location, RestaurantService, UserService, $routeParams, $rootScope){
        var vm = this;
        vm.toggleFav = toggleFav;
        vm.makeReserv = makeReserv;
        vm.addReview = addReview;
        vm.href = href;
        vm.addAffil = addAffil;
        vm.removeAffil = removeAffil;

        function init() {
            vm.$location = $location;
            vm.reserv = {};
            vm.reserv.guests = "1";
            vm.reserv.date = new Date();
            vm.date = new Date().toISOString().split("T")[0];
            vm.newReview = {};
            vm.newReview.body = "";
            vm.newReview.rating = "4";

            RestaurantService
                .findRestaurantByRID($routeParams.rID)
                .then(function(response) {
                    if (response.data) {
                        vm.restaurant = response.data;
                        vm.restaurantName = vm.restaurant.name + "\n" + vm.restaurant.address;
                    } else {
                        vm.$location.url("/error");
                    }
                    loadReviewDetails(vm.restaurant.reviews);
                    return UserService.getCurrentUser();
                })
                .then(function(response) {
                    if (response.data) {
                        vm.user = response.data;
                        vm.userName = response.data.firstName + " " + response.data.lastName;
                        if (vm.user.affil == vm.restaurant.rID) {
                            loadActiveReservs();
                        }
                    }
                })
        }
        init();

        function loadActiveReservs() {
            RestaurantService
                .getReserve(vm.restaurant.rID)
                .then(function(response) {
                    vm.reservations = [];
                    for (var i=0; i<response.data.length; i++) {
                        addUserDetails(response.data[i]);
                    }
                })
        }

        function addUserDetails(reservation) {
            UserService
                .findUserByUsername(reservation.username)
                .then(function(response) {
                    var date = new Date(reservation.date);
                    reservation.rDate = date.toISOString().split("T")[0];
                    reservation.name = response.data.firstName + " " + response.data.lastName;
                    reservation.image = response.data.image;
                    vm.reservations.push(reservation);
                })
        }

        function loadReviewDetails(rawReview) {
            vm.reviews = [];
            for (var i=0; i< rawReview.length; i++) {
                addUsername(rawReview[i]);
            }
        }

        function addUsername(review) {
            UserService
                .findUserByUsername(review.username)
                .then(function(response) {
                    review.name = response.data.firstName + " " + response.data.lastName;
                    review.image = response.data.image;
                    vm.reviews.push(review);
                })
        }

        function addAffil() {
            UserService
                .addAffil(vm.user.username, vm.restaurant.rID)
                .then(function(response) {
                    UserService.setCurrentUser(response.data);
                    loadActiveReservs();
                })
        }

        function removeAffil() {
            UserService
                .removeAffil(vm.user.username)
                .then(function(response) {
                    UserService.setCurrentUser(response.data);
                    delete vm.reservations;
                })
        }

        function href(username) {
            vm.$location.url("/profile/"+username);
        }

        function addReview(review) {
            review.username = vm.user.username;
            review.rID = vm.restaurant.rID;

            var post = {};
            post.username = vm.user.username;
            post.rID = vm.restaurant.rID;
            post.rName = vm.restaurant.name;
            post.rImage = vm.restaurant.image;
            post.body = review.body;

            RestaurantService
                .addReview(vm.restaurant.rID, review)
                .then(function(response) {
                    loadReviewDetails(response.data.reviews);
                    vm.newReview = {};
                    vm.writeReview = 0;
                });
            RestaurantService
                .createPost(post)
                .then(function(response) {
                })
        }


        function loadHeaderReservs() {
            UserService
                .findReserv(vm.user.username)
                .then(function(response) {
                    var reservs = response.data;
                    $rootScope.myReservs = [];
                    var now = new Date();
                    for (var i=0; i < reservs.length; i++) {
                        var date = new Date(reservs[i].date);
                        reservs[i].rDate = date.toISOString().split("T")[0];
                        reservs[i].hasOccurred = now > date;
                        if (!reservs[i].hasOccurred) {
                            $rootScope.myReservs.push(reservs[i]);
                        }
                    }
                });
        }

        function makeReserv(reserv) {

            if (!reserv.date || !reserv.timeSlot) {
                vm.errorMsg = "Enter all the required info";
                return;
            }
            vm.errorMsg = "";
            reserv.guests = reserv.guests[0];
            reserv.timeSlot = reserv.timeSlot[0];
            reserv.username = vm.user.username;
            reserv.rID = vm.restaurant.rID;
            reserv.rName = vm.restaurant.name;
            reserv.rImage = vm.restaurant.image;

            UserService
                .makeReserv(reserv)
                .then(function(response) {
                    vm.reserv = {};
                    vm.selectReserv = 0;
                    loadHeaderReservs();
                })
        }

        function toggleFav(user) {
            var stat = user.favs.indexOf(vm.restaurant.rID) != -1 ? 0: 1;

            UserService
                .handleFav(user.username, vm.restaurant.rID, stat)
                .then(function(response) {
                    if (response.data) {
                        UserService.setCurrentUser(response.data);
                    }
                });
            RestaurantService
                .handleFav(user.username, vm.restaurant.rID, stat)
                .then(function(response) {
                    if (response.data) {
                        vm.restaurant = response.data;
                    }
                });
        }
    }
})();