"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService){
        var vm = this;
        vm.register = register;
        function init() {
            vm.$location = $location;
        }
        init();

        function register() {
            var repassword = vm.repassword;
            if (vm.curUser.password != repassword) {
                alert("Passwords dont match!");
                return;
            }
            vm.curUser["firstName"] = null;
            vm.curUser["lastName"] = null;
            vm.curUser["roles"] = [];
            UserService
                .createUser(vm.curUser)
                .then(function(response){
                    if(response.data) {
                        UserService.setCurrentUser(response.data);
                        vm.$location.url("/profile");
                    }
                })
        }
    }
})();