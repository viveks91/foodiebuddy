"use strict";
module.exports = function(app, formModel) {
    app.get("/api/assignment/user/:userId/form", getFormByUserId);
    app.get("/api/assignment/form/:formId", getFormById);
    app.delete("/api/assignment/form/:formId", deleteForm);
    app.post("/api/assignment/user/:userId/form", createForm);
    app.put("/api/assignment/form/:formId", updateForm);

    var uuid = require('uuid');

    function updateForm(req, res) {
        var formId = req.params.formId;
        var form = req.body;
        res.json(formModel.updateForm(formId, form));
    }

    function createForm(req, res) {
        var userId = req.params.userId;
        var form = req.body;
        form._id = uuid.v1();
        res.json(formModel.createForm(userId, form))
    }

    function deleteForm(req, res) {
        var formId = req.params.formId;
        formModel.deleteForm(formId)
        res.send(204);
    }

    function getFormByUserId(req, res) {
        var userId = req.params.userId;
        res.json(formModel.findFormsByUserId(userId));
    }

    function getFormById(req, res) {
        var formId = req.params.formId;
        res.json(formModel.findFormById(formId));
    }
};
