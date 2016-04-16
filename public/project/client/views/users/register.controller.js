"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService){
        var vm = this;
        vm.register = register;
        function init() {
            vm.$location = $location;
        }
        init();

        function register() {
            if (vm.curUser.password != vm.repassword || !vm.repassword || !vm.curUser.password) {
                alert("Passwords dont match!");
                return;
            }

            UserService
                .register(vm.curUser)
                .then(function(response){
                    var user = response.data;
                    if(user) {
                        UserService.setCurrentUser(response.data);
                        vm.$location.url("/profile");
                    } else {
                        alert("Username already exits");
                    }
                })
        }
    }
})();