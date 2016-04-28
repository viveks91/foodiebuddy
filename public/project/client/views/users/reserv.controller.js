"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("ReservationController", ReservationController);


    function ReservationController(UserService, $location, $rootScope){
        var vm = this;
        vm.href = href;
        vm.cancelReserv = cancelReserv;

        function init() {
            vm.$location = $location;
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.currentUser = response.data;
                    loadReservs();
                })
        }
        init();

        function loadReservs() {
            UserService
                .findReserv(vm.currentUser.username)
                .then(function(response) {
                    vm.reservations = response.data;
                    var now = new Date();
                    for (var i=0; i < vm.reservations.length; i++) {
                        var date = new Date(vm.reservations[i].date);
                        vm.reservations[i].rDate = date.toISOString().split("T")[0];
                        vm.reservations[i].hasOccurred = now >= date;
                    }
                    loadHeaderReservs(vm.reservations)
                })
        }

        function loadHeaderReservs(reservs) {
            $rootScope.myReservs = [];
            for (var i=0; i< reservs.length; i++) {
                if (!reservs[i].hasOccurred) {
                    $rootScope.myReservs.push(reservs[i]);
                }
            }
        }

        function cancelReserv(id) {
            UserService
                .deleteReserv(id)
                .then(function(response) {
                    loadReservs();
                });
        }

        function href(rID) {
            vm.$location.url("/restaurant/"+rID);
        }
    }
})();