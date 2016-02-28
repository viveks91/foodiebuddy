(function(){
    angular
        .module("FormBuilderApp")
        .controller("HeaderController", HeadController);

    function HeadController($scope, $location, $rootScope){
        $scope.logout = function () {
            $rootScope.user = null;
        };
    }
})();