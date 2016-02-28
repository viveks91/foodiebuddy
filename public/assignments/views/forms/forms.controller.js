(function(){
    angular
        .module("FormBuilderApp")
        .controller("FormsController", FormsController);

    function FormsController($scope, $rootScope, FormService) {

        $scope.sortType = 'title';
        $scope.sortReverse = false;

        var user_id = $rootScope.user._id;

        $scope.select = {};

        $scope.reloadForms = function(){
            FormService.findAllFormsForUser(user_id, function(forms) {
                $scope.allForms = angular.copy(forms);
            });
        };
        $scope.reloadForms();

        $scope.addForm = function(newForm) {
            FormService.createFormForUser(user_id, newForm, function(success) {
                $scope.select = {};
            });
        };

        $scope.updateForm = function(newForm) {
            FormService.updateFormById(newForm._id, newForm, function(success) {
                $scope.select = {};
            });
        };

        $scope.deleteForm = function(formId) {
            FormService.deleteFormById(formId, function(success) {
            });
        };

        $scope.selectForm = function(selected) {
            $scope.select = angular.copy(selected);
        };

    }
})();