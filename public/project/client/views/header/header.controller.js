"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("HeaderController", HeadController);

    function HeadController($location, UserService){
        var vm = this;
        vm.logout = logout;

        function init() {
            vm.$location = $location;
        }
        init();

        function logout() {
            UserService
                .logout()
                .then(function(){
                    UserService.setCurrentUser(null);
                    vm.$location.url("/home");
                });
        }
    }
})();