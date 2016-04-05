"use strict";

module.exports = function(db, mongoose) {

    var FormSchema = require("./form.schema.server.js")(mongoose);
    var FieldSchema = require("./field.schema.server.js")(mongoose);

    var FormModel = mongoose.model('FormField', FormSchema);
    var FieldModel = mongoose.model('Field', FieldSchema);


    var api = {
        findFieldsByFormId: findFieldsByFormId,
        findFieldById: findFieldById,
        deleteField: deleteField,
        createField: createField,
        updateField: updateField
    };
    return api;

    function updateField(updatedField, fieldId, formId) {
        return FormModel.findOneAndUpdate(
            { "_id": formId, "fields._id": fieldId },
            {
                "$set": {
                    "fields.$": updatedField,
                    "updated": Date.now()
                }
            },
            {safe: true, upsert: true, new: true}
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

        return FormModel.findByIdAndUpdate(
            formId,
            {
                "$pull": {
                    "fields": {"_id": fieldId}
                },
                "$set": {
                    "updated": Date.now()
                }
            },
            {new: true}
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
