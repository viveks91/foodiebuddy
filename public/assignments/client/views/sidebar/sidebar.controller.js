"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("SidebarController", SidebarController);

    function SidebarController($location){
        var vm = this;

        function init() {
            vm.$location = $location;
        }
        init();
    }
})();