(function(){
    angular
        .module("FormBuilderApp")
        .controller("LoginController", LoginController);

    function LoginController($scope, $rootScope, $location, UserService){
        $scope.login = function () {
            var username = $scope.username;
            var password = $scope.password;
            UserService.findUserByCredentials(username, password, function(loggedUser) {
                if (loggedUser == null) {
                    alert("Incorrect username or password!");
                    return;
                }
                $rootScope.user = angular.copy(loggedUser);
                $location.path("/home");
            });
        }
    }
})();