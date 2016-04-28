module.exports = function(db, mongoose) {
    // load user schema
    var PostSchema = require("./post.schema.server.js")(mongoose);
    var PostModel = mongoose.model('Post', PostSchema);

    var api = {
        createPost: createPost,
        findPostsforUsernames: findPostsforUsernames,
        likePost: likePost,
        dislikePost: dislikePost

    };
    return api;

    function findPostsforUsernames(usernames) {
        return PostModel.find({'username': {$in: usernames}})
            .sort({'date': -1})
            .limit(15);
    }

    function createPost (post) {
        delete post['_id'];
        return PostModel.create(post);
    }

    function likePost(postId, username) {
        return PostModel
            .findById(postId)
            .then(
                function(restaurant){
                    if (restaurant) {
                        if (restaurant.likes.indexOf(username) == -1) {
                            restaurant.likes.push(username);
                        }
                        restaurant.markModified("likes");
                        return restaurant.save();
                    }
                }
            )
    }

    function dislikePost(postId, username) {
        return PostModel
            .findById(postId)
            .then(
                function(restaurant){
                    if (restaurant) {
                        if (restaurant.likes.indexOf(username) != -1) {
                            restaurant.likes.splice(restaurant.likes.indexOf(username), 1);
                        }
                        restaurant.markModified("likes");
                        return restaurant.save();
                    }
                }
            )
    }

};