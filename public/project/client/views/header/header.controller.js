

"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("HeaderController", HeadController);

    function HeadController($location, $rootScope, UserService){
        var vm = this;
        vm.logout = logout;
        vm.unread = unread;
        vm.firstName = "User";
        vm.secondName = "User";
        $rootScope.messageBundle = [];

        function init() {
            $rootScope.messageBundle = [];
            $rootScope.myReservs = [];
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.user = response.data;

                    if (vm.user.hasOwnProperty('firstName')) {
                        vm.firstName = vm.user['firstName'];
                        vm.secondName = vm.user['roles'].indexOf("admin")!= -1 ? "Admin" : vm.user['lastName'];
                    } else {
                        vm.firstName = vm.user['user']
                    }
                    loadMails(vm.user.mails);
                    return UserService.findReserv(vm.user.username)
                })
                .then(function(response) {
                    var reservs = response.data;
                    var now = new Date();
                    for (var i=0; i < reservs.length; i++) {
                        var date = new Date(reservs[i].date);
                        reservs[i].rDate = date.toISOString().split("T")[0];
                        reservs[i].hasOccurred = now > date;
                    }
                    loadReservs(reservs);
                });
            vm.$location = $location;
        }
        init();

        function loadReservs(reservs) {
            $rootScope.myReservs = [];
            for (var i=0; i< reservs.length; i++) {
                if (!reservs[i].hasOccurred) {
                    $rootScope.myReservs.push(reservs[i]);
                }
            }
        }

        function loadMails(mails) {
            var maildrop = mails.slice(0, 3);
            for (var i=0; i < maildrop.length; i++) {
                loadData(maildrop[i]);
            }
        }

        function loadData(mail) {
            UserService
                .findUserByUsername(mail.from)
                .then( function(response) {
                    var user = response.data;
                    mail.fromName = user.firstName + " " + user.lastName;
                    mail.fromImage = user.image;

                    var now = new Date();
                    var mailDate = new Date(mail.time);
                    var timeDiff = Math.abs(now.getTime() - mailDate.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                    if (diffDays != 0) {
                        mail.timeAgo = diffDays.toString() + " days ago";
                    } else {
                        var hours = Math.abs(now.getHours() - mailDate.getHours());
                        mail.timeAgo = hours.toString()+ " hours ago";
                    }
                    $rootScope.messageBundle.unshift(mail);
                });
        }

        function unread(mail) {
            return !mail.read;
        }

        function logout() {
            UserService
                .logout()
                .then(function(){
                    UserService.setCurrentUser(null);
                    vm.$location.url("/login");
                });
        }

        angular.element(document).ready(function () {
            var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
                showLeftPush = document.getElementById( 'showLeftPush' );
                //body = document.body;

            //$rootScope.$on("reloadMails", function(){
            //    init();
            //});

            showLeftPush.onclick = function() {
                classie.toggle( this, 'active' );
                //classie.toggle( body, 'cbp-spmenu-push-toright' );
                classie.toggle( menuLeft, 'cbp-spmenu-open' );
                disableOther( 'showLeftPush' );
                $rootScope.$emit("pushRight", {});
            };

            function disableOther( button ) {
                if( button !== 'showLeftPush' ) {
                    classie.toggle( showLeftPush, 'disabled' );
                }
            }
        });
    }
})();