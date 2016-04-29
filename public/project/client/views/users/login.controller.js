"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("LoginController", LoginController);


    function LoginController($location, UserService){
        var vm = this;
        vm.login = login;
        vm.register = register;
        vm.cSoon = comingSoon;

        function comingSoon() {
            alert("Feature coming soon");
        }

        function init() {
            vm.$location = $location;
        }
        init();

        function login(credentials) {
            if( !credentials || !credentials.username || !credentials.password) {
                return;
            }
            UserService
                .login({
                    username: credentials.username,
                    password: credentials.password
                })
                .then(function(response){
                    if(response.data) {
                        UserService.setCurrentUser(response.data);
                        vm.$location.url("/home");
                    }
                },
                function(err) {
                    alert("Invalid username or password");
                });
        }

        function register(curUser) {
            if (!curUser) {return;}
            if (curUser.password != vm.repassword || !vm.repassword || !curUser.password) {
                alert("Passwords dont match!");
                return;
            }

            UserService
                .register(curUser)
                .then(function(response){
                    var user = response.data;
                    if(user) {
                        UserService.setCurrentUser(response.data);
                        vm.$location.url("/profile");
                    } else {
                        alert("Username already exits");
                    }
                })
        }

        angular.element(document).ready(function () {
            LoginModalController.initialize();
            $("#slider4").responsiveSlides({
                auto: true,
                pager: true,
                nav: true,
                speed: 500,
                namespace: "callbacks",
                before: function () {
                    $('.events').append("<li>before event fired.</li>");
                },
                after: function () {
                    $('.events').append("<li>after event fired.</li>");
                }
            });

        });
    }

    var LoginModalController = {
        tabsElementName: ".logmod__tabs li",
        tabElementName: ".logmod__tab",
        inputElementsName: ".logmod__form .input",
        hidePasswordName: ".hide-password",

        inputElements: null,
        tabsElement: null,
        tabElement: null,
        hidePassword: null,

        activeTab: null,
        tabSelection: 0, // 0 - first, 1 - second

        findElements: function () {
            var base = this;

            base.tabsElement = $(base.tabsElementName);
            base.tabElement = $(base.tabElementName);
            //base.inputElements = $(base.inputElementsName);
            base.hidePassword = $(base.hidePasswordName);

            return base;
        },

        setState: function (state) {
            var base = this,
                elem = null;

            if (!state) {
                state = 0;
            }

            if (base.tabsElement) {
                elem = $(base.tabsElement[state]);
                elem.addClass("current");
                $("." + elem.attr("data-tabtar")).addClass("show");
            }

            return base;
        },

        getActiveTab: function () {
            var base = this;

            base.tabsElement.each(function (i, el) {
                if ($(el).hasClass("current")) {
                    base.activeTab = $(el);
                }
            });

            return base;
        },

        addClickEvents: function () {
            var base = this;

            base.hidePassword.on("click", function (e) {
                var $this = $(this),
                    $pwInput = $this.prev("input");

                if ($pwInput.attr("type") == "password") {
                    $pwInput.attr("type", "text");
                    $this.text("Hide");
                } else {
                    $pwInput.attr("type", "password");
                    $this.text("Show");
                }
            });

            base.tabsElement.on("click", function (e) {
                var targetTab = $(this).attr("data-tabtar");

                e.preventDefault();
                base.activeTab.removeClass("current");
                base.activeTab = $(this);
                base.activeTab.addClass("current");

                base.tabElement.each(function (i, el) {
                    el = $(el);
                    el.removeClass("show");
                    if (el.hasClass(targetTab)) {
                        el.addClass("show");
                    }
                });
            });

            //base.inputElements.find("input").on("click", function (e) {
            //   var $this = $(this);
            //       //$input = $this.next("input");
            //
            //    $this.focus();
            //});

            return base;
        },

        initialize: function () {
            var base = this;

            base.findElements().setState().getActiveTab().addClickEvents();
        }
    };
})(window.angular);