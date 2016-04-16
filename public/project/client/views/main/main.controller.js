"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("MainController", MainController);

    function MainController($location){
        var vm = this;
        vm.$location = $location;
        vm.headerPage = '/project/client/views/header/header.view.html';
        vm.sidebarPage = '/project/client/views/sidebar/sidebar.view.html';
    }
})();

