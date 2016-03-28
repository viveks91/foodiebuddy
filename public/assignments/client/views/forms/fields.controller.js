"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .controller("FieldsController", FieldsController);

    function FieldsController($rootScope, $location, $routeParams, FieldService, FormService) {

        var vm = this;
        vm.loadAllFields = loadAllFields;
        vm.deleteField = deleteField;
        vm.openDiag = openDiag;
        vm.addField = addField;

        vm.serializeOptions = serializeOptions;
        vm.deserializeOptions = deserializeOptions;
        vm.updateField = updateField;
        vm.addReplica = addReplica;

        vm.singleDialog = $( "#dialog-single" ).dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
                Cancel:function() {
                    vm.singleDialog.dialog( "close" );
                },
                "Ok": function() {
                    vm.updateField();
                    vm.singleDialog.dialog( "close" );
                }
            },

            close: function() {
                vm.singleDialog.dialog( "close" );
            }
        });

        vm.multiDialog = $( "#dialog-multi" ).dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
                Cancel:function() {
                    vm.multiDialog.dialog( "close" );
                },
                "Ok": function() {
                    vm.updateField();
                    vm.multiDialog.dialog( "close" );
                }
            },

            close: function() {
                vm.multiDialog.dialog( "close" );
            }
        });

        vm.dateDialog = $( "#dialog-date" ).dialog({
            autoOpen: false,
            height: 200,
            width: 350,
            modal: true,
            buttons: {
                Cancel:function() {
                    vm.dateDialog.dialog( "close" );
                },
                "Ok": function() {
                    vm.updateField();
                    vm.dateDialog.dialog( "close" );
                }
            },

            close: function() {
                vm.dateDialog.dialog( "close" );
            }
        });

        vm.optionDialog = $( "#dialog-option" ).dialog({
            autoOpen: false,
            height: 350,
            width: 350,
            modal: true,
            buttons: {
                Cancel:function() {
                    vm.optionDialog.dialog( "close" );
                },
                "Ok": function() {
                    vm.updateField();
                    vm.optionDialog.dialog( "close" );
                }
            },

            close: function() {
                vm.optionDialog.dialog( "close" );
            }
        });

        vm.checkDialog = $( "#dialog-check" ).dialog({
            autoOpen: false,
            height: 350,
            width: 350,
            modal: true,
            buttons: {
                Cancel:function() {
                    vm.checkDialog.dialog( "close" );
                },
                "Ok": function() {
                    vm.updateField();
                    vm.checkDialog.dialog( "close" );
                }
            },

            close: function() {
                vm.checkDialog.dialog( "close" );
            }
        });

        vm.radioDialog = $( "#dialog-radio" ).dialog({
            autoOpen: false,
            height: 350,
            width: 350,
            modal: true,
            buttons: {
                Cancel:function() {
                    vm.radioDialog.dialog( "close" );
                },
                "Ok": function() {
                    vm.updateField();
                    vm.radioDialog.dialog( "close" );
                }
            },

            close: function() {
                vm.radioDialog.dialog( "close" );
            }
        });
        //$('.ui-dialog-buttonset').css('float','none');
        //$('.ui-dialog-buttonset>button:last-child').css('float','right');

        function init() {
            vm.currentFormId = $routeParams.formId;
            vm.$location = $location;
            vm.user_id = $rootScope.currentUser._id;
            loadAllFields();
            vm.newField = "text";
        }
        init();

        function addField(fieldType) {
            var field = {};
            switch (fieldType) {
                case "text":
                    field._id = null;
                    field.label = "New Text Field";
                    field.placeholder = "New Field";
                    field.type = "TEXT";
                    break;
                case "area":
                    field._id = null;
                    field.label = "New Text Field";
                    field.placeholder = "New Field";
                    field.type = "TEXTAREA";
                    break;
                case "date":
                    field._id = null;
                    field.label = "New Date Field";
                    field.type = "DATE";
                    break;
                case "dropdown":
                    field._id = null;
                    field.label = "New Dropdown";
                    field.type = "OPTIONS";
                    field.options = [
                        {"label": "Option 1", "value": "OPTION_1"},
                        {"label": "Option 2", "value": "OPTION_2"},
                        {"label": "Option 3", "value": "OPTION_3"}
                    ];
                    break;
                case "checkbox":
                    field._id = null;
                    field.label = "New Checkboxes";
                    field.type = "CHECKBOXES";
                    field.options = [
                        {"label": "Option A", "value": "OPTION_A"},
                        {"label": "Option B", "value": "OPTION_B"},
                        {"label": "Option C", "value": "OPTION_C"}
                    ];
                    break;
                case "radio":
                    field._id = null;
                    field.label = "New Radio Buttons";
                    field.type = "RADIOS";
                    field.options =  [
                        {"label": "Option X", "value": "OPTION_X"},
                        {"label": "Option Y", "value": "OPTION_Y"},
                        {"label": "Option Z", "value": "OPTION_Z"}
                    ];
                    break;
            }
            FieldService
                .createFieldForForm(vm.currentFormId,field)
                .then(function(){
                });
            loadAllFields();
        }

        function openDiag(field) {
            vm.currentField = angular.copy(field);
            switch(field.type) {
                case "TEXT":
                case "EMAIL":
                    vm.singleDialog.dialog( "open" );
                    break;
                case "TEXTAREA":
                    vm.multiDialog.dialog( "open" );
                    break;
                case "DATE":
                    vm.dateDialog.dialog( "open" );
                    break;
                case "OPTIONS":
                    vm.serialized = vm.serializeOptions(field.options);
                    vm.optionDialog.dialog( "open" );
                    break;
                case "CHECKBOXES":
                    vm.serialized = vm.serializeOptions(field.options);
                    vm.checkDialog.dialog( "open" );
                    break;
                case "RADIOS":
                    vm.serialized = vm.serializeOptions(field.options);
                    vm.radioDialog.dialog( "open" );
                    break;
            }
        }

        function loadAllFields() {
            FormService
                .getFormById(vm.currentFormId)
                .then(function(response) {
                    vm.currentForm = response.data;
                    vm.fields = angular.copy(vm.currentForm.fields);
                    vm.fieldsFix = angular.copy(vm.currentForm.fields);
                });
        }

        function updateField() {
            if (typeof vm.serialized !== 'undefined' && vm.serialized !== null) {
                // variable is undefined or null
                vm.currentField.options = vm.deserializeOptions(vm.serialized);
            }

            FieldService
                .updateField(vm.currentFormId, vm.currentField._id, vm.currentField)
                .then(function () {
                });
            loadAllFields();
        }

        function addReplica(field) {
            field._id = null;
            FieldService
                .createFieldForForm(vm.currentFormId,field)
                .then(function(){
                });
            loadAllFields();
        }

        function serializeOptions(options) {
            var result = "";
            for (var i = 0; i < options.length; i++) {
                result = result + options[i].label + ":" +options[i].value + "\n";
            }
            return result;
        }

        function deserializeOptions(str) {
            var options = [];
            var parts = str.split("\n");
            for (var i = 0; i < parts.length; i++) {
                var pair = parts[i].split(":");
                options.push({
                    label: pair[0],
                    value: pair[1]
                });
            }
            return options;
        }

        function deleteField(fieldId, formId) {
            FieldService
                .deleteFieldFromForm(formId, fieldId)
                .then(function(){
                });
            loadAllFields();
        }

        setTimeout(function(){
            $(".field-list").sortable({
                connectWith: ".field-list",
                handle: ".handler",
                update: function (event, ui) {
                    var idsInOrder = $(".field-list").sortable("toArray");
                    var sortedfields = [];
                    for (var i = 0; i < idsInOrder.length; i++) {
                        sortedfields.push(vm.fieldsFix[idsInOrder[i]]);
                    }
                    vm.currentForm.fields = angular.copy(sortedfields);
                    FormService
                        .updateFormById(vm.currentFormId, vm.currentForm)
                        .then(function (response) {
                            vm.currentForm = response.data;
                        })
                }
            }).disableSelection();
        });
    }
})();