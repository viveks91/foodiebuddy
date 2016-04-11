"use strict";
module.exports = function(app, formModel) {
    app.get(    "/api/assignment/user/:userId/form", getFormByUserId );
    app.get(    "/api/assignment/form/:formId",      getFormById     );
    app.delete( "/api/assignment/form/:formId",      deleteForm      );
    app.post(   "/api/assignment/user/:userId/form", createForm      );
    app.put(    "/api/assignment/form/:formId",      updateForm      );

    function updateForm(req, res) {
        var formId = req.params.formId;
        var form = req.body;
        formModel
            .updateForm(formId, form)
            .then(
                function (updatedForm) {
                    res.json(updatedForm);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function createForm(req, res) {
        var userId = req.params.userId;
        var form = req.body;
        formModel
            .createForm(userId, form)
            .then(
                function (createdForm) {
                    res.json(createdForm);
                },
                function (err) {

                    res.status(400).send(err);
                }
            )
    }

    function deleteForm(req, res) {
        var formId = req.params.formId;
        formModel
            .deleteForm(formId)
            .then(
                function (doc) {
                    res.send(204);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function getFormByUserId(req, res) {
        var userId = req.params.userId;
        formModel
            .findFormsByUserId(userId)
            .then(
                function (forms) {
                    res.json(forms);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }

    function getFormById(req, res) {
        var formId = req.params.formId;
        formModel
            .findFormById(formId)
            .then(
                function (form) {
                    res.json(form);
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
    }
};
