(function () {
  'use strict';

  angular.module('gmm')
    .controller('PushControllerList', PushControllerList);

  /* @ngInject */
  /*jshint -W071*/
  function PushControllerList($scope, $state, pushPrepService, dialogService, pushService, exportCsvService) {

    var pushCtrl = this;
    var lastField = 'data';
    var listCount = count();
    pushCtrl.page = 1;
    pushCtrl.list = list();
    pushCtrl.listPush = list();
    pushCtrl.pushDetails = {};
    pushCtrl.nextList = nextList;
    pushCtrl.showDialog = showDialog;
    pushCtrl.lastQuery = '';
    pushCtrl.controllerToolbar = $scope.$parent.homeCtrl;
    pushCtrl.controllerToolbar.new = newPush;
    pushCtrl.controllerToolbar.viewAll = viewAllPush;
    pushCtrl.controllerToolbar.change = change;
    pushCtrl.isLastSortedField = isLastSortedField;
    pushCtrl.checkLastField = checkLastField;
    pushCtrl.orderBy = orderBy;
    pushCtrl.ascendant = true;
    pushCtrl.export = exportCsvService.exportPush;
    pushCtrl.export.getCsvExport = getCsvExport;

    function getCsvExport() {
      pushCtrl.export.fileName = pushCtrl.export.pushFileName();
      return pushService.list(pushCtrl.lastQuery, pushCtrl.ascendant, lastField, 'all')
        .then(successAll);
      function successAll(data) {
        return pushCtrl.export.pushExport(data.results);
      }
    }

    function list() {
      return pushPrepService.results;
    }

    function count() {
      return pushPrepService.count;
    }

    function change(query) {
      pushCtrl.lastQuery = query;
      lastField = 'data';
      pushCtrl.ascendant = true;
      pushCtrl.page = 1;
      pushService.list(pushCtrl.lastQuery, pushCtrl.ascendant, lastField, pushCtrl.page).then(success);
    }

    function isLastSortedField(field){
      return field === lastField;
    }

    function checkLastField(field) {
      return isLastSortedField(field) ? 'selected' : 'default';
    }

    function orderBy(field) {
      pushCtrl.page = 1;
      pushCtrl.ascendant = isLastSortedField(field) ? !pushCtrl.ascendant : false;
      pushService.list(pushCtrl.lastQuery, pushCtrl.ascendant, field, pushCtrl.page).then(success);
      lastField = field;
    }

    function success(data) {
      pushCtrl.list = data.results;
      listCount = data.count;
    }

    function newPush() {
      $state.go('home.push.create');
    }

    function viewAllPush() {
      $state.go('home.push.list', {}, {reload: true});
    }

    function nextList() {
      if (listCount > pushCtrl.list.length) {
        ++pushCtrl.page;
        pushService.list(pushCtrl.lastQuery, pushCtrl.ascendant, lastField, pushCtrl.page).then(successNextList);
      }
      function successNextList(data) {
        pushCtrl.list.push.apply(pushCtrl.list, data.results);
        listCount = data.count;
      }
    }


    function showDialog(ev, push, status) {
      var pushDetails = {};
      /*jshint -W106*/
      pushService.pushDetails(push.id, 1).then(function (data) {
        var results = data.results.filter(createFilterForStatus(status));
        pushDetails.results = results;
        if (!status) {
          pushDetails.count = data.count - push.success_count;
        } else {
          pushDetails.count = push.success_count;
        }
        dialogService.showPushDetailsSuccess(ev, PushDetailsController);
      });

      return {dialogController: PushDetailsController};

      /* @ngInject */
      function PushDetailsController($mdDialog) {
        var dialogCtrl = this;
        dialogCtrl.pushDetails = pushDetails;
        dialogCtrl.cancel = cancelDialog;
        dialogCtrl.scrollAction = scrollAction;
        dialogCtrl.lowercaseCountryCode = lowercaseCountryCode;

        return dialogCtrl;

        function lowercaseCountryCode(countryCode) {
          return angular.lowercase(countryCode);
        }

        function cancelDialog() {
          $mdDialog.cancel();
        }

        function scrollAction(page) {
          pushService.pushDetails(push.id, page).then(successNextListPushDetails);
        }

        function successNextListPushDetails(data) {
          dialogCtrl.pushDetails.results.push.apply(dialogCtrl.pushDetails.results,
            data.results.filter(createFilterForStatus(status)));
        }
      }
    }

    function createFilterForStatus(status) {
      return function filterFn(item) {
        return (item.status === status);
      };
    }

  }
})();
