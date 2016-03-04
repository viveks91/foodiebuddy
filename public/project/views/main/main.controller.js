(function(){
    angular
        .module("FoodWorldApp")
        .controller("MainController", MainController);

    function MainController($scope, $location){
        $scope.$location = $location;
        $scope.headerPage = '/project/views/header/header.view.html';
        $scope.sidebarPage = '/project/views/sidebar/sidebar.view.html';
    }
})();

