(function(){
    angular
        .module("FoodWorldApp")
        .controller("HeaderController", HeadController);

    function HeadController($scope, $location, $rootScope){
        $scope.logout = function () {
            $rootScope.user = null;
        };
    }
})();