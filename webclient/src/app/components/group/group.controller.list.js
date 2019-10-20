(function () {
  'use strict';

  angular.module('gmm')
    .controller('GroupControllerList', GroupControllerList);

  function GroupControllerList($scope, $state, dialogService, groupPrepService, groupService, exportCsvService) {

    var groupCtrlList = this;
    var lastField = 'name';
    var listCount = count();
    groupCtrlList.ascendant = true;
    groupCtrlList.infinityList = 1;
    groupCtrlList.lastQuery = '';
    groupCtrlList.controllerToolbar = $scope.$parent.homeCtrl;
    groupCtrlList.controllerToolbar.new = newGroup;
    groupCtrlList.controllerToolbar.viewAll = viewAllGroup;
    groupCtrlList.controllerToolbar.change = change;
    groupCtrlList.isLastSortedField = isLastSortedField;
    groupCtrlList.list = list();
    groupCtrlList.nextList = nextList;
    groupCtrlList.orderBy = orderBy;
    groupCtrlList.showDialog = showDialog;
    groupCtrlList.export = exportCsvService.exportRegion;
    groupCtrlList.export.getCsvExport = getCsvExport;

    function count() {
      return groupPrepService.count;
    }

    function change(query) {
      groupCtrlList.lastQuery = query;
      lastField = 'name';
      groupCtrlList.ascendant = true;
      groupCtrlList.infinityList = 1;
      groupService.list(groupCtrlList.lastQuery, groupCtrlList.ascendant, lastField,
        groupCtrlList.infinityList, false).then(success);
    }

    function getCsvExport() {
      groupCtrlList.export.fileName = groupCtrlList.export.groupFileName();
      return groupService.list(groupCtrlList.lastQuery, groupCtrlList.ascendant, lastField, 'all', false)
        .then(successAll);
      function successAll(data) {
        return groupCtrlList.export.groupExport(data.results);
      }
    }

    function isLastSortedField(field) {
      return field === lastField;
    }

    function list() {
      return groupPrepService.results;
    }

    function newGroup() {
      $state.go('home.settings.group.create');
    }

    function nextList() {
      if (listCount > groupCtrlList.list.length) {
        ++groupCtrlList.infinityList;
        groupService.list(groupCtrlList.lastQuery, groupCtrlList.ascendant, lastField,
          groupCtrlList.infinityList, false).then(successPush);
      }
      function successPush(data) {
        groupCtrlList.list.push.apply(groupCtrlList.list, data.results);
        listCount = data.count;
      }
    }

    function orderBy(field) {
      groupCtrlList.infinityList = 1;
      groupCtrlList.ascendant = isLastSortedField(field) ? !groupCtrlList.ascendant : false;
      groupService.list(groupCtrlList.lastQuery, groupCtrlList.ascendant, field,
        groupCtrlList.infinityList, false).then(success);
      lastField = field;
    }

    function showDialog(ev, group) {
      dialogService.showGroupDialog(ev, DialogController);

      return {dialogController: DialogController};

      /* @ngInject */
      function DialogController($mdDialog, $timeout) {

        var dialogCtrl = this;
        dialogCtrl.group = group;
        dialogCtrl.cancel = cancel;

        $timeout(verifyCheckbox, 1);

        return dialogCtrl;

        function cancel() {
          $mdDialog.cancel();
        }

        function verifyCheckbox() {
          var checkboxes = angular.element('input[type="checkbox"]');
          for(var i = 0; i < checkboxes.length; i++) {
            for (var j = 0; j < dialogCtrl.group.permissions.length; j++){
              if (dialogCtrl.group.permissions[j].codename === checkboxes[i].id) {
                checkboxes[i].checked = true;
              }
            }
          }
        }
      }
    }

    function success(data) {
      groupCtrlList.list = data.results;
      listCount = data.count;
    }

    function viewAllGroup() {
      $state.go('home.settings.group.list', {}, {reload: true});
    }
  }
})();
