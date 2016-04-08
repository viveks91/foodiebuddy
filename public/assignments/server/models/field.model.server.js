"use strict";

module.exports = function(db, mongoose) {

    var FormSchema = require("./form.schema.server.js")(mongoose);
    var FieldSchema = require("./field.schema.server.js")(mongoose);

    var FormModel = mongoose.model('FormField', FormSchema);
    var FieldModel = mongoose.model('Field', FieldSchema);

    var keys = ["label", "placeholder", "type", "options"];


    var api = {
        findFieldsByFormId: findFieldsByFormId,
        findFieldById: findFieldById,
        deleteField: deleteField,
        createField: createField,
        updateField: updateField,
        sortFields: sortFields
    };
    return api;

    function sortFields(formId, startIndex, endIndex) {
        return FormModel
            .findById(formId)
            .then(
                function(form) {
                    form.fields.splice(endIndex, 0, form.fields.splice(startIndex, 1)[0]);

                    // notify mongoose 'pages' field changed
                    form.markModified("fields");
                    form.save();
                }
            );
    }

    function updateField(updatedField, fieldId, formId) {
        return FormModel
            .findById(formId)
            .then(
                function(form){
                    var field = form.fields.id(fieldId);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (typeof updatedField[key] !== 'undefined' && updatedField[key] !== null) {
                            field[key] = updatedField[key];
                        }
                    }
                    form['updated'] = Date.now();
                    return form.save();
                }
            );
    }

    function createField(field, formId) {
        delete field['_id'];
        return FormModel.findByIdAndUpdate(
            formId,
            {
                "$push": {
                    "fields": field
                },
                "$set": {
                    "updated": Date.now()
                }
            },
            {safe: true, upsert: true, new: true}
        );
    }

    function deleteField(fieldId, formId) {

        return FormModel
            .findById(formId)
            .then(
                function(form){
                    form.fields.id(fieldId).remove();
                    form['updated'] = Date.now();
                    return form.save();
                }
            );
    }

    function findFieldsByFormId(formId) {
        return FormModel.findById(formId, "fields");
    }

    function findFieldById(fieldId, formId) {
        return FormModel.findOne(
            { "_id": formId, "fields._id": fieldId },
            {"fields.$" : true }
        );
    }

};
