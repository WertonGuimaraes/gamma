(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('EmailController', EmailController);

  /* @ngInject */
  /*jshint -W071*/
  function EmailController($state, $stateParams, dialogService) {
    var emailCtrl = this;

    emailCtrl.email = [];
    emailCtrl.email.from = "";
    emailCtrl.email.subject = "";
    emailCtrl.email.body = "";
    emailCtrl.emailSent = false;
    emailCtrl.emailJson = {};
    emailCtrl.submit = submit;
    emailCtrl.cancel = cancel;

    setUrlFallback();
    setEmailsTo();

    configSubmitButton(false, 'send');

    function setEmailsTo(){
      if (typeof $stateParams.emailsTo === 'string') {
        emailCtrl.email.to = [$stateParams.emailsTo];
      } else {
        emailCtrl.email.to = $stateParams.emailsTo;
      }
    }

    function setUrlFallback(){
      if($stateParams.urlFallback) {
        emailCtrl.urlFallback = $stateParams.urlFallback;
      } else {
        emailCtrl.urlFallback = 'home';
      }
    }

    function configSubmitButton(isEnabled, buttonText) {
      emailCtrl.isEnabled = isEnabled;
      emailCtrl.buttonText = buttonText;
    }

    function submit(ev) {
      dialogService.showConfirm(ev, 'Are you sure you want to send this email?', sendMail);

      function sendMail() {
        var email = getEmail();
        emailCtrl.emailSent = true;
        emailCtrl.emailJson = getEmail();
      }
    }

    function cancel(ev) {
      dialogService.showConfirm(ev, 'Are you sure you want to cancel and leave this page?', goBack);

      function goBack() {
        $state.go(emailCtrl.urlFallback);
      }
    }

    function getEmail(){
      return {
        'from': emailCtrl.email.from,
        'to': emailCtrl.email.to,
        'subject': emailCtrl.email.subject,
        'body': emailCtrl.email.body,
      };
    }

  }

})();
