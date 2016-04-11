"use strict";
module.exports = function(db, mongoose) {

    var FormSchema = require("./form.schema.server.js")(mongoose);

    var FormModel = mongoose.model('Form', FormSchema);

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
        delete form['_id'];
        return FormModel.create(form);
    }

    function findFormByTitle(title) {
        return FormModel.find({title: title});
    }
};