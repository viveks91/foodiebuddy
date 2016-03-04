(function(){
    angular
        .module("FoodWorldApp")
        .controller("SearchController", SearchController);

    function SearchController($scope, $rootScope, PlacesService){
        $scope.searchResults = null;
        $scope.searchPlaces = function(formDetails) {
            PlacesService.getPlace(formDetails.placeName, formDetails.placeLocation, function(response) {
                $scope.searchResults = response;
            });
            console.log($scope.searchResults);
        };
    }
})();