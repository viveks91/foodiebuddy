"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("MainController", MainController);

    function MainController($location){
        var vm = this;
        vm.$location = $location;
        vm.headerPage = '/assignments/client/views/header/header.view.html';
        vm.sidebarPage = '/assignments/client/views/sidebar/sidebar.view.html';
    }
})();

