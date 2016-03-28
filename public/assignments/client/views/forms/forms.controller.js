"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("FormsController", FormsController);

    function FormsController($rootScope, $location, FormService) {

        var vm = this;
        vm.loadAllForms = loadAllForms;
        vm.addForm = addForm;
        vm.updateForm = updateForm;
        vm.deleteForm = deleteForm;
        vm.selectForm = selectForm;

        function init() {
            vm.$location = $location;
            vm.sortType = 'title';
            vm.sortReverse = false;
            vm.user_id = $rootScope.currentUser._id;
            vm.select = {};
            vm.loadAllForms();
        }
        init();

        function loadAllForms() {
            FormService
                .findAllFormsForUser(vm.user_id)
                .then(function(response) {
                    vm.allForms = angular.copy(response.data);
            });
        }

        function addForm(newForm) {
            if (Object.keys(newForm).length == 0) {
                return;
            }
            newForm["userId"] = vm.user_id;
            newForm["fields"] = [];
            FormService
                .createFormForUser(vm.user_id, newForm)
                .then(function(){
                    vm.select = {};
                });
            loadAllForms();
        }

        function updateForm(newForm) {
            if (Object.keys(newForm).length == 0) {
                return;
            }
            FormService
                .updateFormById(newForm._id, newForm)
                .then(function(){
                    vm.select = {};
                });
            loadAllForms();
        }

        function deleteForm(formId) {
            FormService
                .deleteFormById(formId)
                .then(function(){
                });
            loadAllForms();
        }

        function selectForm(selected) {
            vm.select = angular.copy(selected);
        }
    }
})();