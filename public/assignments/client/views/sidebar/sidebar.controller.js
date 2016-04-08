"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("SidebarController", SidebarController);

    function SidebarController($location, UserService){
        var vm = this;

        function init() {
            vm.$location = $location;
        }
        init();
    }
})();