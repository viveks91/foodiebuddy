"use strict";
module.exports = function(app, fieldModel) {
    app.get(    "/api/assignment/form/:formId/field",          getFieldsByFormId );
    app.get(    "/api/assignment/form/:formId/field/:fieldId", getFieldById      );
    app.delete( "/api/assignment/form/:formId/field/:fieldId", deleteFieldById   );
    app.post(   "/api/assignment/form/:formId/field",          createField       );
    app.put(    "/api/assignment/form/:formId/field/:fieldId", updateField       );
    app.put(    "/api/assignment/form/:formId/field",          updateFields      );

    function updateFields (req, res) {
        var formId = req.params.formId;
        var startIndex = null;
        var startIndex = req.query.startIndex;
        var endIndex = null;
        var endIndex = req.query.endIndex;

        if(startIndex != null && endIndex != null) {
            fieldModel
                .sortFields(formId, startIndex, endIndex)
                .then(
                    function(stat) {
                        return res.json(200);
                    },
                    function(err) {
                        res.status(400).send(err);
                    }
                );
        }
    }

    function updateField(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        var field = req.body;
        fieldModel
            .updateField(field, fieldId, formId)
            .then(
                function (updatedField) {
                    res.json(updatedField);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function createField(req, res) {
        var formId = req.params.formId;
        var field = req.body;
        delete field._id;
        fieldModel
            .createField(field, formId)
            .then(
                function (newField) {
                    res.json(newField);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function deleteFieldById(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        fieldModel
            .deleteField(fieldId, formId)
            .then(
                function (updatedForm) {
                    res.json(updatedForm);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function getFieldById(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        fieldModel
            .findFieldById(fieldId, formId)
            .then(
                function (field) {
                    res.json(field);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function getFieldsByFormId(req, res) {
        var formId = req.params.formId;
        fieldModel
            .findFieldsByFormId(formId)
            .then(
                function (fields) {
                    res.json(fields);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }
};
