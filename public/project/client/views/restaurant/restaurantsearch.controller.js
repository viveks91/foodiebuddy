"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("SearchController", SearchController);

    function SearchController($location, RestaurantService, $routeParams){
        var vm = this;
        vm.search = search;
        vm.selectRestaurant = selectRestaurant;
        vm.href= href;

        function init() {
            vm.$location = $location;

            var query = $routeParams.query;

            if (query) {
                var parts = query.split("$");
                vm.name = parts[0];
                vm.location = parts[1];
                search(parts[0],parts[1]);
            }
        }
        init();

        function search(name, location) {
            vm.errorMessage = "";

            if (name.length == 0 && location.length == 0) {
                return;
            }

            if (location.length == 0) {
                vm.errorMessage = "Cannot search without location";
                return;
            }

            RestaurantService
                .searchApi(name, location)
                .then(function(response) {
                    if ('statusCode' in response.data || response.data.businesses.length == 0) {
                        vm.errorMessage = "No such place found.";
                    }
                    normalize(response.data.businesses);
                });
        }

        function normalize(results) {
            vm.normalized = [];
            for (var i=0; i<results.length; i++) {
                var result = {};
                result.name = results[i].name;
                result.phone= results[i].display_phone;
                result.rID = results[i].id;
                result.image = results[i].image_url;
                result.ratingImage = results[i].rating_img_url_large;
                result.rating = results[i].rating;
                result.url = results[i].url;
                if (results[i].location.display_address.length > 2) {
                    result.address = results[i].location.display_address[0] + ", " + results[i].location.display_address[results[i].location.display_address.length-1];
                } else {
                    result.address = results[i].location.display_address.join(", ");
                }
                result.snippet = results[i].snippet_text;
                result.categories = "";
                var categories = results[i].categories.slice(0,3);
                for (var j=0; j< categories.length; j++) {
                    categories[j] = categories[j].join(", ");
                }
                result.categories = categories.join(", ");

                vm.normalized.push(result);
            }
        }

        function selectRestaurant(restaurant) {
            RestaurantService
                .insertRestaurant(restaurant)
                .then(function(response) {
                    if (response.data) {
                        vm.$location.url("/restaurant/"+response.data.rID);
                    }
                })
        }

        function href(name, location) {
            name = name.replace(/\s/g, '');
            location = location.replace(/\s/g, '');
            vm.$location.url("/search/"+name+"$"+location);
        }
    }
})();