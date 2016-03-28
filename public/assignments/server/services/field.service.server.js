"use strict";
module.exports = function(app, formModel) {
    app.get("/api/assignment/form/:formId/field", getFieldsByFormId);
    app.get("/api/assignment/form/:formId/field/:fieldId", getFieldById);
    app.delete("/api/assignment/form/:formId/field/:fieldId", deleteFieldById);
    app.post("/api/assignment/form/:formId/field", createField);
    app.put("/api/assignment/form/:formId/field/:fieldId", updateField);

    var uuid = require('uuid');

    function updateField(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        var field = req.body;
        res.json(formModel.updateField(field, fieldId, formId));
    }

    function createField(req, res) {
        var formId = req.params.formId;
        var field = req.body;
        field._id = uuid.v1();
        res.json(formModel.createField(field, formId));
    }

    function deleteFieldById(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        formModel.deleteField(fieldId, formId);
        res.send(204);
    }

    function getFieldById(req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        res.json(formModel.findFieldById(fieldId, formId));
    }

    function getFieldsByFormId(req, res) {
        var formId = req.params.formId;
        res.json(formModel.findFieldsByFormId(formId));
    }
};
