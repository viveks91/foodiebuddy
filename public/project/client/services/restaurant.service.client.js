"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .factory("RestaurantService", restaurantService);

    function restaurantService($http, $rootScope) {

        var selected = null;

        var api = {
            searchApi: searchApi,
            insertRestaurant: insertRestaurant,
            findRestaurantByRID: findRestaurantByRID,
            handleFav: handleFav,
            findRestaurantsByRIDs: findRestaurantsByRIDs,
            addReview: addReview,
            getReviews: getReviews,
            getReserve: getReserve,
            createPost: createPost
        };
        return api;

        function createPost(post) {
            return $http.post("/foodie/post/", post);
        }

        function getReserve(rID) {
            return $http.get('/foodie/restaurant/reserve/'+ rID);
        }

        function findRestaurantByRID(rID) {
            return $http.get('/foodie/restaurant/'+ rID);
        }

        function findRestaurantsByRIDs(rIDs) {
            return $http.post('/foodie/restaurant/many', rIDs);
        }

        function insertRestaurant(restaurant) {
            return $http.post("/foodie/restaurant/", restaurant);
        }

        function handleFav(username, rID, stat) {
            return $http.post("/foodie/restaurant/fav", {
                rID: rID,
                username: username,
                stat: stat
            });
        }

        function searchApi (name, location) {
            return $http.post("/foodie/search/", {
                name: name,
                location: location
            });
        }

        function addReview(rID, review) {
            return $http.post("/foodie/review/"+rID, review);
        }

        function getReviews(rID) {
            return $http.get("/foodie/review/"+rID);
        }
    }
})();