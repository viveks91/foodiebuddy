(function(){
    angular
        .module("FoodWorldApp")
        .controller("SearchController", SearchController);

    function SearchController($scope, $rootScope, PlacesService){
        //var container = document.getElementById('search');
        $scope.searchResults = null;

        $scope.searchPlaces = function(formDetails) {
            PlacesService.getPlace(formDetails.placeName, formDetails.placeLocation, function(response) {
                console.log(response.data.businesses);
                $scope.searchResults = angular.copy(response.data.businesses);
            });
        };

        $scope.clear = function() {
            $scope.searchResults = null;
        };
    }
})();