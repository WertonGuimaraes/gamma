(function () {
  'use strict';

  angular.module('gmm')
    .controller('UserController', UserController);

  function UserController($scope, $state, dialogService, userService, userPrepService, userPrepTranslateService,
                          groupPrepService) {

    var userCtrl = this;
    var translate = userPrepTranslateService;
    userCtrl.user = userPrepService;
    userCtrl.cancel = cancel;
    userCtrl.disabled = disabled;
    userCtrl.group = setGroup();
    userCtrl.groups = groupPrepService;
    userCtrl.onChangeGroup = onChangeGroup;
    userCtrl.save = save;
    userCtrl.confirmPassword = userCtrl.user.password;
    userCtrl.selectAllCheckBoxes = selectAllCheckBoxes;
    userCtrl.controlCheckBox = true;

    configSaveButton(false, translate.SAVE_ID);
    verifyCheckbox();

    function cancel(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_CANCEL_ID, redirectState);
    }

    function clearCheckbox() {
      var checkboxes = angular.element('input[type="checkbox"]');
      for(var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
    }

    function configSaveButton(buttonSave, buttonText) {
      userCtrl.buttonSave = buttonSave;
      userCtrl.buttonText = buttonText;
    }

    function disabled() {
      return !userCtrl.user.username || !userCtrl.user.first_name || !userCtrl.user.last_name || !userCtrl.user.email ||
        !userCtrl.user.password || userCtrl.user.password !== userCtrl.confirmPassword ||
        !userCtrl.group;
    }

    function formatGroup() {
      userCtrl.user.groups = [];
      userCtrl.user.groups.push({name: userCtrl.group});
    }

    function getCheckboxes() {
      userCtrl.user.user_permissions = [];
      var checkboxes = angular.element('input[type="checkbox"]');
      for(var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          userCtrl.user.user_permissions.push({codename: checkboxes[i].id});
        }
      }
    }

    function onChangeGroup() {
      clearCheckbox();
      for (var i = 0; i < userCtrl.groups.results.length; i++) {
        if (userCtrl.groups.results[i].name === userCtrl.group) {
          userCtrl.user.user_permissions = userCtrl.groups.results[i].permissions;
          verifyCheckbox();
        }
      }
    }

    function redirectState() {
      $state.go('home.settings.user.list');
    }

    function saveError(response) {
      configSaveButton(false, translate.SAVE_ID);
    }

    function save(ev) {
      getCheckboxes();
      formatGroup();
      dialogService.showConfirm(ev, translate.CONFIRM_SAVE_USER_ID, saveUser);
    }

    function saveUser() {
      configSaveButton(true, translate.SAVING_ID);
      $state.current.data.save(userService, userCtrl.user, saveSuccess, saveError);
    }

    function saveSuccess(response) {
      redirectState();
      dialogService.showToast (translate.SUCCESS_SAVE_ID);
    }

    function setGroup() {
      var name = '';
      if (userCtrl.user.groups.length > 0) {
        name = userCtrl.user.groups[0].name;
      }

      return name;
    }

    function selectAllCheckBoxes(){
      var checkboxes = angular.element('input[type="checkbox"]');

      for(var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = userCtrl.controlCheckBox;
      }
      userCtrl.controlCheckBox = !userCtrl.controlCheckBox;
    }

    function verifyCheckbox() {

      var checkboxes = angular.element('input[type="checkbox"]');
      for(var i = 0; i < checkboxes.length; i++) {
        for (var j = 0; j < userCtrl.user.user_permissions.length; j++){
          if (userCtrl.user.user_permissions[j].codename === checkboxes[i].id) {
            checkboxes[i].checked = true;
          }
        }
      }
    }

    $scope.$watch('userCtrl.confirmPassword', function (newValue, oldValue) {
      userCtrl.classErrorPassword = '';
      if (userCtrl.user.password !== newValue) {
        userCtrl.classErrorPassword = 'md-input-invalid';
      }
    });
  }
})();
