"use strict";
module.exports = function(app) {
    var UserModel = require("./assignments/server/models/user.model.js")(app);

    require("./assignments/server/services/user.server.service.js")(app, UserModel);
};