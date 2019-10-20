(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('GeneralController', GeneralController);

  function GeneralController($state, dialogService, generalService, generalPrepService, generalPrepTranslateService) {

    var generalCtrl = this;
    var translate = generalPrepTranslateService;
    generalCtrl.cancel = cancel;
    generalCtrl.disabled = disabled;
    generalCtrl.general = generalPrepService;
    generalCtrl.MIN_UPDATE_TIME_PUSH = 300;
    generalCtrl.MIN_UPDATE_TIME_PARTICIPANT_PUSH = 10;
    generalCtrl.MIN_UPDATE_TIME_REFRESH_TOKEN = 30;
    generalCtrl.save = save;

    configSaveButton(false, translate.SAVE_ID);

    function cancel(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_CANCEL_ID, redirectState);
    }

    function disabled() {
      return !generalCtrl.general.update_time_push || !generalCtrl.general.update_time_participant_number ||
        generalCtrl.general.update_time_push < generalCtrl.MIN_UPDATE_TIME_PUSH ||
        generalCtrl.general.update_time_participant_number < generalCtrl.MIN_UPDATE_TIME_PARTICIPANT_PUSH ||
        !generalCtrl.general.update_time_refresh_token ||
        generalCtrl.general.update_time_refresh_token < generalCtrl.MIN_UPDATE_TIME_REFRESH_TOKEN;
    }

    function save(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_SAVE_GENERAL_SETTINGS_ID, saveGeneral);
    }

    function saveError(response) {
      configSaveButton(false, translate.SAVE_ID);
    }

    function saveGeneral() {
      configSaveButton(true, translate.SAVING_ID);
      $state.current.data.save(generalService, generalCtrl.general, saveSuccess, saveError);
    }

    function saveSuccess(response) {
      redirectState();
      dialogService.showToast (translate.SUCCESS_SAVE_ID);
    }

    function redirectState() {
      $state.go('home.settings.list');
    }

    function configSaveButton(buttonSave, buttonText) {
      generalCtrl.buttonSave = buttonSave;
      generalCtrl.buttonText = buttonText;
    }
  }
})();
