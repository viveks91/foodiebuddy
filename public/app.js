"use strict";

module.exports = function(app, db, mongoose) {
    require("./assignments/server/app.js")(app, db, mongoose);
    require("./project/server/app.js")(app, db, mongoose);
};
