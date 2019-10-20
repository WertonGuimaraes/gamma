(function () {
  'use strict';

  angular.module('gmm')
    .controller('UserControllerList', UserControllerList);

  /*jshint -W071*/
  /*jshint -W072*/
  function UserControllerList($scope, $state, $translate, dialogService, userPrepService, userService, exportCsvService,
                              groupPrepService, $mdSidenav, userPrepSearch, userPrepTranslateService) {
    var userCtrlList = this;
    userCtrlList.lastField = 'first_name';
    var listCount = count();
    var translate = userPrepTranslateService;
    userCtrlList.ascendant = true;
    userCtrlList.infinityList = 1;
    userCtrlList.lastQuery = '';
    userCtrlList.checkLastField = checkLastField;
    userCtrlList.clearFilter = clearFilter;
    userCtrlList.closeSidenavFilter = closeSidenavFilter;
    userCtrlList.controllerToolbar = $scope.$parent.homeCtrl;
    userCtrlList.controllerToolbar.filter = true;
    userCtrlList.controllerToolbar.new = newUser;
    userCtrlList.controllerToolbar.viewAll = viewAllUser;
    userCtrlList.controllerToolbar.change = change;
    userCtrlList.filter = filter;
    userCtrlList.groups = groupPrepService.results;
    userCtrlList.isLastSortedField = isLastSortedField;
    userCtrlList.list = list();
    userCtrlList.nextList = nextList;
    userCtrlList.orderBy = orderBy;
    userCtrlList.ordinations = ordinations;
    userCtrlList.showDialog = showDialog;
    userCtrlList.export = exportCsvService.exportRegion;
    userCtrlList.export.getCsvExport = getCsvExport;
    userCtrlList.showFilter = showFilter;
    userCtrlList.search = userPrepSearch;

    function clearFilter() {
      var CLEAR = '';
      userCtrlList.lastField = 'first_name';
      userCtrlList.ascendant = true;
      userCtrlList.search = {
        name: '',
        username: '',
        email: '',
        group: '',
        active: true
      };
      filterUser(CLEAR, CLEAR, CLEAR, CLEAR, getIsActive(), success);
    }

    function closeSidenavFilter() {
      $mdSidenav('right').close();
    }

    function count() {
      return userPrepService.count;
    }

    function change(query) {
      userCtrlList.lastQuery = query;
      userCtrlList.infinityList = 1;
      filterUser(userCtrlList.search.name, userCtrlList.search.username,
        userCtrlList.search.email, userCtrlList.search.group, getIsActive(), success);
    }

    function checkLastField(field) {
      return isLastSortedField(field) ? 'selected' : 'default';
    }

    function getIsActive() {
      return userCtrlList.search.active ? 'True' : 'False';
    }

    function showFilter() {
      return (userCtrlList.search.name.length > 0 || userCtrlList.search.username.length > 0 ||
      userCtrlList.search.email.length > 0 || userCtrlList.search.group.length > 0);
    }

    function filter() {
      userCtrlList.infinityList = 1;
      filterUser(userCtrlList.search.name, userCtrlList.search.username,
        userCtrlList.search.email, userCtrlList.search.group, getIsActive(), success);
    }

    function filterUser(name, username, email, group, active, success) {
      userService.list(name, username, email, group, active, userCtrlList.ascendant,
        userCtrlList.lastField, userCtrlList.lastQuery, userCtrlList.infinityList).then(success);
    }

    function getCsvExport() {
      userCtrlList.export.fileName = userCtrlList.export.userFileName();
      return userService.list(userCtrlList.lastQuery, userCtrlList.ascendant, userCtrlList.lastField, 'all', false)
        .then(successAll);
      function successAll(data) {
        return userCtrlList.export.userExport(data.results);
      }
    }

    function ordinations() {
      userCtrlList.ordersList = [
        {'key': 'first_name', 'value': translate.USER_FIRST_NAME_ID},
        {'key': 'last_name', 'value': translate.USER_LAST_NAME_ID},
        {'key': 'email', 'value': translate.EMAIL_ID},
        {'key': 'username', 'value': translate.USER_USERNAME_ID},
        {'key': 'groups', 'value': translate.GROUP_ID}
      ];
    }

    function isLastSortedField(field) {
      return field === userCtrlList.lastField;
    }

    function list() {
      return userPrepService.results;
    }

    function newUser() {
      $state.go('home.settings.user.create');
    }

    function nextList() {
      if (listCount > userCtrlList.list.length) {
        ++userCtrlList.infinityList;
        userService.list(userCtrlList.lastQuery, userCtrlList.ascendant, userCtrlList.lastField,
          userCtrlList.infinityList, false).then(successPush);
      }
      function successPush(data) {
        userCtrlList.list.push.apply(userCtrlList.list, data.results);
        listCount = data.count;
      }
    }

    function orderBy(field) {
      userCtrlList.infinityList = 1;
      userCtrlList.ascendant = isLastSortedField(field) ? !userCtrlList.ascendant : false;
      userService.list(userCtrlList.search.name, userCtrlList.search.username,
        userCtrlList.search.email, userCtrlList.search.group, getIsActive(), userCtrlList.ascendant,
        field, userCtrlList.lastQuery, userCtrlList.infinityList).then(success);
      userCtrlList.lastField = field;
    }

    function showDialog(ev, user) {
      dialogService.showUserDialog(ev, DialogController);

      return {dialogController: DialogController};

      /* @ngInject */
      function DialogController($mdDialog, $timeout) {

        var dialogCtrl = this;
        var dateNow = new Date();
        dialogCtrl.user = user;
        dialogCtrl.activate = activate;
        dialogCtrl.cancel = cancel;

        $timeout(verifyCheckbox, 1);

        return dialogCtrl;

        function activate(ev, active) {
          $mdDialog.cancel();
          $translate('CONFIRM_ACTIVATE_USER_ID', {'status': msgStatus(user.is_active)})
            .then(showToastInfoTranslateMessage);

          function showToastInfoTranslateMessage(translation) {
            dialogService.showConfirm(ev, translation, activeUser);
          }

          function activeUser() {
            dateNow = new Date();
            userService.activatedUser(dialogCtrl.user, active).then(success);
          }
        }

        function cancel() {
          $mdDialog.cancel();
        }

        function msgStatus(status) {
          var msg = translate.ENABLED_ID;
          if (!status) {
            msg = translate.DISABLED_ID;
          }
          return msg;
        }

        function success(data) {
          user.is_active = data.is_active;
          $translate('SUCCESS_USER_CHANGE_ENABLED_STATUS_ID', {'status': msgStatus(user.is_active)})
            .then(showToastTranslate);
          function showToastTranslate(translation) {
            dialogService.showToast (translation);
          }
        }

        function verifyCheckbox() {
          var checkboxes = angular.element('input[type="checkbox"]');
          for(var i = 0; i < checkboxes.length; i++) {
            for (var j = 0; j < dialogCtrl.user.user_permissions.length; j++){
              if (dialogCtrl.user.user_permissions[j].codename === checkboxes[i].id) {
                checkboxes[i].checked = true;
              }
            }
          }
        }
      }
    }

    function success(data) {
      userCtrlList.list = data.results;
      listCount = data.count;
    }

    function viewAllUser() {
      $state.go('home.settings.user.list', {}, {reload: true});
    }
  }
})();
