"use strict";

module.exports = function(mongoose) {

    var PostSchema = mongoose.Schema({
        username: String,
        rID: String,
        rName: String,
        rImage: String,
        date: {type: Date, default: Date.now},
        likes: [String],
        body: String

    }, {collection: 'foodie.posts'});

    PostSchema.index({ username: 1});
    PostSchema.set('autoIndex', false);

    return PostSchema;
};