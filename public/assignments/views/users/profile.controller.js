(function(){
    angular
        .module("FormBuilderApp")
        .controller("ProfileController", ProfileController);

    function ProfileController($scope, $rootScope, UserService){
        $scope.currentUser = angular.copy($rootScope.user);

        $scope.updateUser = function(newUser) {
            UserService.updateUser(newUser._id, newUser, function(updatedUser){
                $rootScope.user = angular.copy(updatedUser);
            });
        }
    }
})();