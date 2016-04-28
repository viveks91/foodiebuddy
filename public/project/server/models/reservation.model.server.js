module.exports = function(db, mongoose) {
    // load user schema
    var ReservationSchema = require("./reservation.schema.server.js")(mongoose);
    var ReservationModel = mongoose.model('Reservation', ReservationSchema);

    var api = {
        createReservation: createReservation,
        findReservationByRID: findReservationByRID,
        findReservationByUsername: findReservationByUsername,
        deleteReservation: deleteReservation
    };
    return api;

    function findReservationByRID(rID) {
        return ReservationModel
            .find({'rID': rID})
            .where({'date': {"$gte": new Date()}})
            .sort({'date': -1})
            .limit(5);
    }

    function findReservationByUsername(username) {
        return ReservationModel
            .find({'username': username})
            .sort({'date': -1})
            .limit(10);
    }

    function createReservation (reservation) {
        delete reservation['_id'];
        return ReservationModel.create(reservation);
    }

    function deleteReservation (id) {
        return ReservationModel.findByIdAndRemove(id);
    }

};