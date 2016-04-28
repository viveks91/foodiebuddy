"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/users/login.view.html",
                controller: "LoginController",
                controllerAs: "model",
                resolve: {
                    loggedin: isLoggedin
                }
            })
            .when("/home", {
                templateUrl: "views/home/home.view.html",
                controller: "HomeController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/profile/:username", {
                templateUrl: "views/users/people.view.html",
                controller: "PeopleController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/following", {
                templateUrl: "views/users/following.view.html",
                controller: "FollowingController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/followers", {
                templateUrl: "views/users/followers.view.html",
                controller: "FollowersController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/fav", {
                templateUrl: "views/users/fav.view.html",
                controller: "FavoritesController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/login", {
                templateUrl: "views/users/login.view.html",
                controller: "LoginController",
                controllerAs: "model",
                resolve: {
                    loggedin: isLoggedin
                }
            })
            .when("/inbox", {
                templateUrl: "views/users/inbox.view.html",
                controller: "InboxController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/register", {
                templateUrl: "views/users/register.view.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/error", {
                templateUrl: "views/404.html",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/finduser", {
                templateUrl: "views/users/finduser.view.html",
                controller: "FinduserController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/finduser/:query", {
                templateUrl: "views/users/finduser.view.html",
                controller: "FinduserController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/notFound", {
                templateUrl: "views/notFound.html",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/profile", {
                templateUrl: "views/users/profile.view.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/search", {
                templateUrl: "views/restaurant/restaurantsearch.view.html",
                controller: "SearchController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/search/:query", {
                templateUrl: "views/restaurant/restaurantsearch.view.html",
                controller: "SearchController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/reservations", {
                templateUrl: "views/users/reserv.view.html",
                controller: "ReservationController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/restaurant/:rID", {
                templateUrl: "views/restaurant/details.view.html",
                controller: "DetailsController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/admin", {
                templateUrl: "views/admin/admin.view.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkAdmin
                }
            })
            .otherwise({
                redirectTo: "/error"
            });
    }

    var checkAdmin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/foodie/user/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0' && user.roles.indexOf('admin') != -1)
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/home');
            }
        });

        return deferred.promise;
    };


    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/foodie/user/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            // User is Not Authenticated
            else
            {
                $rootScope.errorMessage = 'You need to log in.';
                alert($rootScope.errorMessage);
                $rootScope.currentUser = null;
                deferred.reject();
                $location.url('/login');
            }
        });

        return deferred.promise;
    };

    var isLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/foodie/user/loggedin').success(function(user)
        {
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                deferred.reject();
                $location.url('/home');
            }
            // User is Not Authenticated
            else
            {
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    var checkCurrentUser = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/foodie/user/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
            }
            deferred.resolve();
        });

        return deferred.promise;
    };
})();