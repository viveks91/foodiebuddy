"use strict";
var mock = require("./form.mock.json");
module.exports = function(db, mongoose) {

    var FormSchema = require("./form.schema.server.js")(mongoose);
    var UserSchema = require("./user.schema.server.js")(mongoose);

    var FormModel = mongoose.model('Form', FormSchema);
    var UserModel = mongoose.model('UserTemp', UserSchema);

    // Mock data load
    function init() {
        var aliceId = null;
        var bobId = null;

        UserModel
            .find({username: "alice"})
            .then(function(user){
                mock[0]['userId'] = user[0]._id;
                return UserModel.find({username: "bob"});
            })
            .then(function(user){
                    mock[1]['userId'] = user[0]._id;

                    for (var i=0; i< mock.length; i++) {
                        var query = FormModel.findOneAndUpdate(
                            {title: mock[i].title, userId: mock[i].userId},
                            mock[i],
                            {upsert: true}
                        );
                        query.exec();
                    }
                }
            );
    }
    init();

    var api = {
        createForm: createForm,
        findFormById: findFormById,
        findFormsByUserId: findFormsByUserId,
        findAllForms: findAllForms,
        updateForm: updateForm,
        deleteForm: deleteForm,
        findFormByTitle: findFormByTitle
    };
    return api;

    function findAllForms() {
        return FormModel.find();
    }

    function updateForm(formId, updatedForm) {
        updatedForm['updated'] = Date.now();
        delete updatedForm['_id'];
        return FormModel.findByIdAndUpdate(formId, updatedForm, {new: true});
    }

    function deleteForm(formId) {
        return FormModel.findByIdAndRemove(formId);
    }

    function findFormsByUserId(userId) {
        return FormModel.find({userId: userId});
    }

    function findFormById(formId) {
        return FormModel.findById(formId);
    }

    function createForm(userId, form) {
        form['userId'] = userId;
        return FormModel.create(form);
    }

    function findFormByTitle(title) {
        return FormModel.find({title: title});
    }
};