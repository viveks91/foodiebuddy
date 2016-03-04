(function(){
    angular
        .module("FoodWorldApp")
        .factory("PlacesService", placesService);

    function placesService($http) {
        var apiKey = "AIzaSyBTSIqcdFHPEW1HnivRTd6ZM76dhClMnp4";

        var api = {
            getPlace: getPlace
        };
        return api;

        function getPlace(name, location, callback) {
            $http.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + name + "+restaurants+in+" + location + "&key=" + apiKey )
                .success(callback);
        }
    }
})();