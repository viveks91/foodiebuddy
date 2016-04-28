"use strict";
var passport         = require('passport');
var bcrypt           = require('bcrypt-nodejs');
var Yelp             = require('yelp');

module.exports = function(app, restaurantModel, reservationModel, postModel) {

    var authorize = authorized;
    var authorizeAdmin = isAdmin;
    var yelp = new Yelp({
        consumer_key:    process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        token:           process.env.TOKEN,
        token_secret:    process.env.TOKEN_SECRET
    });

    app.post   ("/foodie/search/",          authorize,   queryApi );
    app.post   ("/foodie/restaurant/",      authorize,   createRestaurant );
    app.post   ("/foodie/restaurant/fav",   authorize,   handleFav );
    app.post   ("/foodie/restaurant/many",  authorize,   findRestaurantsByRIDs );
    app.post   ("/foodie/post/",            authorize,   createPost );
    app.get    ("/foodie/restaurant/:rID",  authorize,   findRestaurantByRID );
    app.get    ("/foodie/restaurant/reserve/:rID",     authorize,   getReserve );
    app.post   ("/foodie/review/:rID",     authorize,   addReview );
    app.get    ("/foodie/review/:rID",     authorize,   getReviews );

    function createPost(req, res) {
        var post = req.body;
        postModel
            .createPost(post)
            .then(function(post) {
                res.json(post);
            },
            function(err) {
                res.status(400).send(err);
            })
    }

    function addReview(req, res) {
        var rID = req.params.rID;
        var review = req.body;
        restaurantModel
            .addReview(rID, review)
            .then(function(restaurant) {
                    res.json(restaurant);
                },
                function (err) {
                    console.log(err);
                    res.status(400).send(err);
                })
    }

    function getReviews(req, res) {
        var rID = req.params.rID;
        restaurantModel
            .findRestaurantByRID(rID)
            .then(function(rest) {
                    res.json(rest.reviews.slice(0,4));
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function getReserve(req, res) {
        var rID = req.params.rID;
        reservationModel
            .findReservationByRID(rID)
            .then(function(reservs) {
                    res.json(reservs);
                },
                function (err) {
                    res.status(400).send(err);
                })
    }

    function handleFav(req, res) {
        if (req.body.stat) {
            restaurantModel
                .addFav(req.body.username, req.body.rID)
                .then(function (restaurant) {
                        res.json(restaurant);
                    },
                    function(err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                )
        } else {
            restaurantModel
                .removeFav(req.body.username, req.body.rID)
                .then(function (restaurant) {
                        res.json(restaurant);
                    },
                    function(err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                )
        }

    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function findRestaurantByRID(req, res) {
        var rID = req.params.rID;
        restaurantModel
            .findRestaurantByRID(rID)
            .then(function(rest){
                    if(rest) {
                        res.json(rest);
                    } else {
                        res.json(null);
                    }
                },
                function (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
            )
    }

    function findRestaurantsByRIDs(req, res) {
        var rIDs = req.body;

        restaurantModel
            .findRestaurantsByRIDs(rIDs)
            .then(
                function (restaurants) {
                    res.json(restaurants);
                },
                function (err) {
                    console.log(err);
                    res.status(400).send(err);
                });
    }

    function isAdmin(req, res, next) {
        if (req.isAuthenticated() || req.user.roles.indexOf('admin')>-1) {
            next();
        } else {
            res.send(403);
        }
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function createRestaurant(req, res) {
        var restaurant = req.body;
        restaurantModel
            .findRestaurantByRID(restaurant.rID)
            .then(function(rest){
                    if(rest) {
                        res.json(restaurant);
                    } else {
                        return restaurantModel.createRestaurant(restaurant);
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function(restaurant){
                    res.json(restaurant);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function queryApi(req, res) {
        var name = req.body.name;
        var location = req.body.location;

        var sort = 0;
        if (name.length == 0) {
            sort = 2;
        }
        yelp.search({
                term: name,
                location: location,
                limit: 14,
                sort: sort,
                category_filter: "food,restaurants,bars"
            })
            .then(function (data) {
                res.json(data);
            })
            .catch(function (err) {
                res.json(err);
            });
    }

};
