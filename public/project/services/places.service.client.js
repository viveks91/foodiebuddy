(function(){
    angular
        .module("FoodWorldApp")
        .factory("PlacesService", placesService);

    function placesService($http) {
        //var apiKey = "AIzaSyBTSIqcdFHPEW1HnivRTd6ZM76dhClMnp4";

        var api = {
            getPlace: getPlace
        };
        return api;

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }

        function getPlace(name, location, callback) {

            var method = 'GET';
            var url = 'http://api.yelp.com/v2/search';
            var params = {
                callback: 'angular.callbacks._0',
                location: location,
                oauth_consumer_key: 'jizYpyrilakp14_FxkEttA', //Consumer Key
                oauth_token: 'TVyqnWMKB4XVvcm8pExEqOtdvrcc7jHp', //Token
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: new Date().getTime(),
                oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                term: name + "+restaurant",
                limit: 3
            };
            var consumerSecret = '2CMDMAwV7iHtDWW87c9DEJhuon0'; //Consumer Secret
            var tokenSecret = 'FrG920RNO4gV6MWrJShu0icF31M'; //Token Secret

            var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
            params['oauth_signature'] = signature;
            //console.log(params);
            $http.jsonp(url, {params: params})
                .then(callback);
        }
    }
})();