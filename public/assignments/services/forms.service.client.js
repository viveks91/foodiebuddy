(function(){
    angular
        .module("FormBuilderApp")
        .factory("FormService", formService);

    function formService() {

        var forms = [
            {"_id": "000", "title": "Contacts", "userId": 123},
            {"_id": "010", "title": "ToDo",     "userId": 123},
            {"_id": "020", "title": "CDs",      "userId": 234}
        ];

        var createFormForUser = function (userId, form, callback) {
            form.userId = userId;
            form._id = (new Date).getTime();
            forms.push(form);
            callback(form);
        };

        var findAllFormsForUser = function (userId, callback) {
            var filtered = [];
            for(var f in forms)
            {
                if(forms[f].userId == userId)
                {
                    filtered.push(forms[f]);
                }
            }
            callback(filtered);
        };

        var deleteFormById = function (formId, callback) {
            var index = null;
            for(var f in forms)
            {
                if(forms[f]._id == formId)
                {
                    index = f;
                    break;
                }
            }
            if(index != null) {
                forms.splice(index,1);
            }
            callback(forms);
        };

        var updateFormById = function (formId, newForm, callback) {
            for(var f in forms)
            {
                if(forms[f]._id == formId)
                {
                    forms[f] = newForm;
                    break;
                }
            }
            callback(newForm);
        };

        return {
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById
        };
    }
})();