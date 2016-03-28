"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService){
        var vm = this;
        vm.login = login;
        function init() {
            vm.$location = $location;
        }
        init();

        function login() {
            if(!vm.username || !vm.password) {
                return;
            }
            UserService
                .login({
                    username: vm.username,
                    password: vm.password
                })
                .then(function(response){
                    if(response.data) {
                        UserService.setCurrentUser(response.data);
                        vm.$location.url("/home");
                    } else {
                        alert("Invalid username or password");
                    }
                });
        }
    }
})();