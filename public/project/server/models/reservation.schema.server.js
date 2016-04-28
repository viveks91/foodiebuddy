"use strict";

module.exports = function(mongoose) {

    var ReservationSchema = mongoose.Schema({
        username: String,
        rID: String,
        guests: String,
        timeSlot: String,
        rName: String,
        rImage: String,
        date: Date

    }, {collection: 'foodie.reservation'});

    ReservationSchema.index({ username: 1});
    ReservationSchema.set('autoIndex', false);

    return ReservationSchema;
};