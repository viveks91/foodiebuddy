(function(){
    angular
        .module("FormBuilderApp")
        .factory("UserService", userService);

    function userService() {

        var users = [
            {
                "_id":123,
                "firstName":"Alice",
                "lastName":"Wonderland",
                "username":"alice",
                "password":"alice",
                "roles": ["user"]
            },
            {
                "_id":234,
                "firstName":"Bob",
                "lastName":"Hope",
                "username":"bob",
                "password":"bob",
                "roles": ["admin"]
            },
            {
                "_id":345,
                "firstName":"Charlie",
                "lastName":"Brown",
                "username":"charlie",
                "password":"charlie",
                "roles": ["staff"]
            },
            {
                "_id":456,
                "firstName":"Dan",
                "lastName":"Craig",
                "username":"dan",
                "password":"dan",
                "roles": ["staff", "user"]
            },
            {
                "_id":567,
                "firstName":"Edward",
                "lastName":"Norton",
                "username":"ed",
                "password":"ed",
                "roles": ["user"]
            }
        ];

        var findUserByCredentials = function (username, password, callback) {
            var found = null;
            for(var u in users)
            {
                if(users[u].username == username && users[u].password == password)
                {
                    found = users[u];
                    break;
                }
            }
            callback(found);
        };

        var findAllUsers = function (callback) {
            callback(users);
        };

        var createUser = function (user, callback) {
            user._id = (new Date).getTime();
            users.push(user);
            callback(user);
        };

        var deleteUserById = function (userId, callback) {
            var found = null;
            for(var u in users)
            {
                if(users[u]._id == userId)
                {
                    found = u;
                    break;
                }
            }
            if(found != null) {
                users.splice(u,1);
            }
            callback(users);
        };

        var updateUser = function (userId, user, callback) {
            for(var u in users)
            {
                if(users[u]._id == userId)
                {
                    users[u] = user;
                    break;
                }
            }
            callback(user);
        };

        return {
            findUserByCredentials: findUserByCredentials,
            findAllUsers: findAllUsers,
            createUser: createUser,
            deleteUserById: deleteUserById,
            updateUser: updateUser
        };
    }
})();