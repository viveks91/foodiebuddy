"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("SidebarController", SidebarController);

    function SidebarController($location, UserService){
        var vm = this;

        function init() {
            vm.$location = $location;
        }
        init();
    }
})();