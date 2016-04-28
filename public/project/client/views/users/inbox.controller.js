"use strict";
(function(){
    angular
        .module("FoodieBuddy")
        .controller("InboxController", InboxController);

    function InboxController($location, UserService, $rootScope){
        var vm = this;
        var months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        vm.compose = compose;
        vm.dateString = dateString;
        vm.reply = reply;
        vm.deleteMail = deleteMail;
        vm.openToggle = openToggle;

        function init() {
            vm.inboxView = 1;
            vm.$location = $location;
            UserService
                .getCurrentUser()
                .then(function(response) {
                    vm.curUser = response.data;
                    loadMails(vm.curUser);
                });
        }
        init();

        function loadMails(user) {
            vm.mails = user.mails.slice(0, 12);
            for (var i=0; i < vm.mails.length; i++) {
                loadName(vm.mails[i].from, i);
            }
        }

        function loadName(username, i) {
            UserService
                .findUserByUsername(username)
                .then( function(response) {
                    vm.mails[i].fromName = response.data.firstName + " " + response.data.lastName;
                    vm.mails[i].fromImage = response.data.image;
                    return "irrelevant";
                })
        }

        function compose() {
            vm.mail.from = vm.curUser.username;

            if (!vm.mail.message || vm.mail.message.length == 0 || vm.mail.to == vm.mail.from) {
                return;
            }

            UserService
                .sendMessage(vm.mail)
                .then(function(response) {
                    var res = response.data;
                    if (res.status == "error") {
                        vm.error = res.message;
                    } else {
                        vm.mail = {};
                        vm.inboxView = 1;
                    }
                });
        }

        function reply(mail) {

            if (!mail.reply || mail.reply.length == 0) {
                return;
            }

            var reply = {};
            reply.from = vm.curUser.username;
            reply.to = mail.from;
            reply.sub = "Re: " + mail.subject;
            reply.message = mail.reply;

            if (reply.to == reply.from) {
                return;
            }

            UserService
                .sendMessage(reply)
                .then(function(response) {
                    mail.reply = "";
                });
        }

        function deleteMail(mailId) {
            UserService
                .deleteMessage(vm.curUser.username, mailId)
                .then(function(response) {
                    if (response.data) {
                        loadMails(response.data);
                        if (response.data) {
                            UserService.setCurrentUser(response.data);
                        }
                        //$rootScope.$emit("reloadMails", {});
                        updateMessageBundle();
                    }
                });

        }

        function updateMessageBundle() {
            $rootScope.messageBundle = vm.mails.slice(0,3);
        }

        function openToggle(mail) {
            var mailId = mail._id;

            if (mail.read == false) {
                UserService
                    .readMessage(vm.curUser.username, mailId)
                    .then(function(response) {
                        mail.read = true;
                        if (response.data) {
                            UserService.setCurrentUser(response.data);
                            //$rootScope.$emit("reloadMails", {});
                            updateMessageBundle();
                        }
                    });
            }
            mail.open = !mail.open || 0;
        }

        function dateString(time) {
            var date = new Date(time);
            return date.getDate() + " " + months[date.getMonth()];
        }
    }

})(window.angular);