"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("FinduserController", FinduserController);


    function FinduserController($location, UserService, $routeParams){
        var vm = this;
        vm.href = href;
        //vm.search = search;
        vm.shref = shref;

        function init() {
            vm.query1 = "";
            vm.query2 = "";
            vm.$location = $location;

            var query = $routeParams.query;

            if (query) {
                var parts = query.split("$");
                search(parts[0],parts[1]);
            }
        }
        init();

        function search(firstName, lastName) {
            if (firstName.length == 0 && lastName.length == 0) {
                return;
            }
            UserService
                .search(firstName, lastName)
                .then(function(response) {
                    vm.results = response.data;
                });
        }
        function shref(firstName, lastName) {
            firstName = firstName.replace(/\s/g, '');
            lastName = lastName.replace(/\s/g, '');
            vm.$location.url("/finduser/"+firstName+"$"+lastName);
        }

        function href(username) {
            vm.$location.url("/profile/"+ username);
        }
    }
})();