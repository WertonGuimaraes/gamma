(function () {
  'use strict';

  angular.module('gmm')
    .controller('GroupController', GroupController);

  function GroupController($state, dialogService, groupService, groupPrepService, groupPrepTranslateService) {

    var groupCtrl = this;
    var translate = groupPrepTranslateService;
    groupCtrl.cancel = cancel;
    groupCtrl.disabled = disabled;
    groupCtrl.group = groupPrepService;
    groupCtrl.save = save;
    groupCtrl.selectAllCheckBoxes =selectAllCheckBoxes;
    groupCtrl.controlCheckBox = true;


      verifyCheckbox();

    function verifyCheckbox() {
      var checkboxes = angular.element('input[type="checkbox"]');
      for(var i = 0; i < checkboxes.length; i++) {
        for (var j = 0; j < groupCtrl.group.permissions.length; j++){
          if (groupCtrl.group.permissions[j].codename === checkboxes[i].id) {
            checkboxes[i].checked = true;
          }
        }
      }
    }

    function getCheckboxes() {
      groupCtrl.group.permissions = [];
      var checkboxes = angular.element('input[type="checkbox"]');
      for(var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          groupCtrl.group.permissions.push({codename: checkboxes[i].id});
        }
      }
    }

    configSaveButton(false, translate.SAVE_ID);

    function cancel(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_CANCEL_ID, redirectState);
    }

    function configSaveButton(buttonSave, buttonText) {
      groupCtrl.buttonSave = buttonSave;
      groupCtrl.buttonText = buttonText;
    }

    function disabled() {
      return !groupCtrl.group.name;
    }

    function redirectState() {
      $state.go('home.settings.group.list');
    }

    function saveError(response) {
      configSaveButton(false, translate.SAVE_ID);
    }

    function save(ev) {
      getCheckboxes();
      dialogService.showConfirm(ev, translate.CONFIRM_SAVE_GROUP_ID, saveGroup);
    }

    function saveGroup() {
      configSaveButton(true, translate.SAVING_ID);
      $state.current.data.save(groupService, groupCtrl.group, saveSuccess, saveError);
    }

    function saveSuccess(response) {
      redirectState();
      dialogService.showToast (translate.SUCCESS_SAVE_ID);
    }

    function selectAllCheckBoxes(){
      var checkboxes = angular.element('input[type="checkbox"]');
      for(var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = groupCtrl.controlCheckBox;
      }
      groupCtrl.controlCheckBox = !groupCtrl.controlCheckBox;
    }

  }
})();
