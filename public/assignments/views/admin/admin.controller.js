(function(){
    angular
        .module("FormBuilderApp")
        .controller("AdminController", AdminController);

    function AdminController($scope, UserService){

        $scope.sortType = 'username';
        $scope.sortReverse = false;
        $scope.edit = {};

        $scope.reloadUsers = function(){
            UserService.findAllUsers(function(users) {
                $scope.allUsers = angular.copy(users);
            });
        };
        $scope.reloadUsers();

        $scope.addUser = function(newUser) {

            newUser.firstName = null;
            newUser.secondName = null;
            newUser.email = null;
            if (!Array.isArray(newUser.roles)) {
                newUser.roles = newUser.roles.replace(/\s+/g, '').split(',');
            }
            UserService.createUser(newUser, function(success) {
                $scope.edit = {};
            });
        };

        $scope.updateUser = function(newUser) {
            if (!Array.isArray(newUser.roles)) {
                newUser.roles = newUser.roles.replace(/\s+/g, '').split(',');
            }
            UserService.updateUser(newUser._id, newUser, function(success) {
                $scope.edit = {};
            });
        };

        $scope.removeUser = function(userId) {
            UserService.deleteUserById(userId, function(success) {
            });
        };

        $scope.editUser = function(selected) {
            $scope.edit = angular.copy(selected);
        };
    }
})();