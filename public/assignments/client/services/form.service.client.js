"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .factory("FormService", formService);

    function formService($http, $rootScope) {
        var api = {
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById,
            getFormById: getFormById
        };
        return api;

        function createFormForUser(userId, form) {
            return $http.post("/api/assignment/user/"+userId+"/form", form);
        }

        function findAllFormsForUser(userId) {
            return $http.get("/api/assignment/user/"+userId+"/form");
        }

        function deleteFormById(formId) {
            return $http.delete("/api/assignment/form/"+formId);
        }

        function updateFormById(formId, newForm) {
            return $http.put("/api/assignment/form/"+formId, newForm);
        }

        function getFormById(formId) {
            return $http.get("/api/assignment/form/"+formId);
        }
    }
})();