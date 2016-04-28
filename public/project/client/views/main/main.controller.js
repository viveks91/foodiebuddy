"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("MainController", MainController);

    function MainController($location, $rootScope){
        var vm = this;
        vm.$location = $location;
        vm.headerPage = '/project/client/views/header/header.view.html';

        angular.element(document).ready(function () {
            var body = document.body;

            $rootScope.$on("pushRight", function(){
                changeView();
            });

            function changeView() {
                //classie.toggle( this, 'active' );
                classie.toggle( body, 'cbp-spmenu-push-toright' );
                //classie.toggle( menuLeft, 'cbp-spmenu-open' );
            }
        });
    }
})();

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

