(function(){
    angular
        .module("FormBuilderApp")
        .controller("MainController", MainController);

    function MainController($scope, $location){
        $scope.$location = $location;
        $scope.headerPage = '/assignments/views/header/header.view.html';
        $scope.sidebarPage = '/assignments/views/sidebar/sidebar.view.html';
    }
})();

