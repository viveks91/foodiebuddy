(function(){
    angular
        .module("FoodWorldApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($scope, $rootScope, $location, UserService){

        $scope.register = function() {
            var repassword = $scope.repassword;
            if ($scope.curUser.password != repassword) {
                alert("Passwords dont match!");
                return;
            }
            $scope.curUser["firstName"] = null;
            $scope.curUser["lastName"] = null;
            $scope.curUser["roles"] = [];
            UserService.createUser($scope.curUser, function(newUser) {
                $rootScope.user = angular.copy(newUser);
                $location.path("/profile");
            });
        };
    }
})();