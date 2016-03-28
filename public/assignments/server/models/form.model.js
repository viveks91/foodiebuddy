"use strict";
var mock = require("./form.mock.json");
module.exports = function(app) {
    var api = {
        createForm: createForm,
        findFormById: findFormById,
        findFormsByUserId: findFormsByUserId,
        findAllForms: findAllForms,
        updateForm: updateForm,
        deleteForm: deleteForm,
        findFormByTitle: findFormByTitle,
        findFieldsByFormId: findFieldsByFormId,
        findFieldById: findFieldById,
        deleteField: deleteField,
        createField: createField,
        updateField: updateField
    };
    return api;

    function updateField(field, fieldId, formId) {
        for (var u in mock) {
            if (mock[u]._id == formId) {
                var fields = mock[u].fields;

                for (var f in fields) {
                    if (fields[f]._id == fieldId) {

                        for (var eachKey in field) {
                            if (field.hasOwnProperty(eachKey)) {
                                mock[u].fields[f][eachKey] = field[eachKey];
                            }
                        }
                        return field;
                    }
                }
                break;
            }
        }
        return null;
    }

    function createField(field, formId) {
        for (var u in mock) {
            if (mock[u]._id == formId) {
                mock[u].fields.push(field);
                return field;
            }
        }
    }

    function deleteField(fieldId, formId) {
        for (var u in mock) {
            if (mock[u]._id == formId) {
                var fields = mock[u].fields;
                for (var f in fields) {
                    if (fields[f]._id == fieldId) {
                        mock[u].fields.splice(f,1);
                        break;
                    }
                }
                break;
            }
        }
    }

    function findFieldsByFormId(formId) {
        var fields = [];
        for (var u in mock) {
            if (mock[u]._id == formId) {
                fields = mock[u].fields;
                break;
            }
        }
        return fields;
    }

    function findFieldById(fieldId, formId) {
        for (var u in mock) {
            if (mock[u]._id == formId) {
                var fields = mock[u].fields;
                for (var f in fields) {
                    if (fields[f]._id == fieldId) {
                        return fields[f];
                    }
                }
                break;
            }
        }
        return null;
    }

    function findAllForms() {
        return mock;
    }

    function updateForm(formId, updatedForm) {
        for(var u in mock) {
            if( mock[u]._id == formId ) {
                mock[u].title = updatedForm.title;
                mock[u].userId = updatedForm.userId;
                mock[u].fields = updatedForm.fields;

                return mock[u];
            }
        }
        return null;
    }

    function deleteForm(formId) {
        for(var u in mock) {
            if( mock[u]._id == formId ) {
                mock.splice(u,1);
                break;
            }
        }
    }

    function findFormsByUserId(userId) {
        var forms = [];
        for (var u in mock) {
            if (mock[u].userId == userId) {
                forms.push (mock[u]);
            }
        }
        return forms;
    }

    function findFormById(formId) {
        for(var u in mock) {
            if( mock[u]._id == formId ) {
                return mock[u];
            }
        }
        return null;
    }

    function createForm(userId, form) {
        form.userId = userId;
        mock.push(form);
        return form;
    }

    function findFormByTitle(title) {
        for(var u in mock) {
            if( mock[u].title === title) {
                return mock[u];
            }
        }
        return null;
    }
};