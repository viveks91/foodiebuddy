"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("FavoritesController", FavoritesController);


    function FavoritesController(UserService, RestaurantService, $location){
        var vm = this;
        vm.dislike = dislike;
        vm.moreFavs = moreFavs;
        vm.href = href;

        function init() {
            vm.$location = $location;
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.currentUser = response.data;
                    return RestaurantService.findRestaurantsByRIDs(vm.currentUser.favs)
                })
                .then(function(response) {
                    vm.totalFavs = response.data;
                    vm.favs = vm.totalFavs.slice(0,12);
                    vm.favsCount = 12;
                });
        }
        init();

        function dislike(rID) {
            var stat = 0;

            UserService
                .handleFav(vm.currentUser.username, rID, stat)
                .then(function(response) {
                    UserService.setCurrentUser(response.data);
                    return RestaurantService.findRestaurantsByRIDs(response.data.favs);
                })
                .then(function(response) {
                    vm.totalFavs = response.data;
                    vm.favs = vm.totalFavs.slice(vm.favsCount -12, vm.favsCount);
                });

            RestaurantService
                .handleFav(vm.currentUser.username, rID, stat)
                .then(function(response) {
                });
        }

        function moreFavs() {
            if (vm.favsCount >= vm.totalFavs.length) {
                return;
            }
            vm.favs = vm.totalFavs.slice(vm.favsCount, vm.favsCount+12);
            vm.favsCount = vm.favsCount + 12;
        }

        function href(rID) {
            vm.$location.url("/restaurant/"+ rID);
        }
    }
})();