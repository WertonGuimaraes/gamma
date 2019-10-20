(function () {
  'use strict';

  angular.module('gmm')
    .controller('MultiPushController', MultiPushController);

  /* @ngInject */
  function MultiPushController($scope, moment, dialogService, formConfigService) {

    var FORMAT = 'YYYY-MM-DDTHH:mm';
    var multiPushCtrl = this;
    multiPushCtrl.game = getGame();
    multiPushCtrl.removeGamePushConfig = removeGamePushConfig;
    multiPushCtrl.showPushConfigDialog = showPushConfigDialog;

    function getGame() {
      if ($scope.game.pushTemplatesAux === undefined) {
        $scope.game.pushTemplatesAux = formConfigService.formTemplateFromJson($scope.game);
      }
      if ($scope.game.formPushValues === undefined) {
        $scope.game.formPushValues = [];
      }
      return $scope.game;
    }

    function disablePushTemplate(game, timezone, beginDate, endDate) {
      if (((beginDate || endDate) && timezone) && formConfigService.validateStructure(game.formJsonPush, true) &&
        dateCodition()) {
        return false;
      } else if ((!beginDate && !endDate && !timezone) &&
        formConfigService.validateStructure(game.formJsonPush, true)) {
        return false;
      }
      return true;

      function dateCodition() {
        /*jshint -W106*/
        if (beginDate <= endDate || !endDate || !beginDate) {
          return true;
        }
        return false;
      }
    }

    function removeGamePushConfig(game, pushTemplate) {
      var index = game.formPushValues.indexOf(pushTemplate);
      game.formPushValues.splice(index, 1);
      $scope.onRemove(game);
    }

    function addPushTemplate(game, pushConfig, timezone, beginDate, endDate) {
      /*jshint -W106*/
      var formTemplate = newFormTemplate(game);

      if (disablePushTemplate(game, timezone, beginDate, endDate)) {
        return false;
      } else {
        game.formPushValues.push(formTemplate);
        $scope.onAdd(game);
      }

      function newFormTemplate(game) {

        var pushValue = {};

        if ((beginDate || endDate) && timezone) {
          pushValue.push_timezone = timezone;
          if (beginDate) {
            pushValue.push_begin_date = moment.tz(moment(beginDate).format(FORMAT), timezone).format();
          }
          if (endDate) {
            pushValue.push_end_date = moment.tz(moment(endDate).format(FORMAT), timezone).format();
          }
        }

        pushValue.data = formConfigService.generateJsonValid(game.formJsonPush.root, true);
        pushValue.query = {};
        pushValue.form_push_template = angular.toJson(pushConfig);
        return pushValue;
      }
    }

    function showPushConfigDialog(ev, game) {
      dialogService.showPushConfigDialog(ev, DialogController);
      return {dialogController: DialogController};

      /* @ngInject */
      function DialogController($scope, $mdDialog) {
        var dialogCtrl = this;
        dialogCtrl.game = multiPushCtrl.game;
        dialogCtrl.formJsonPush = {};
        dialogCtrl.addPushTemplate = addAllTemplates;
        dialogCtrl.cancel = cancel;
        dialogCtrl.disablePushTemplate = disableTemplate;
        $scope.$watch('dialogCtrl.formJsonPush', watch);

        return dialogCtrl;

        function addAllTemplates(pushConfig) {
          cancel();
          addPushTemplate(game, pushConfig, dialogCtrl.gmtTimezone, dialogCtrl.beginDateTime, dialogCtrl.endDateTime);
        }

        function disableTemplate() {
          return disablePushTemplate(game, dialogCtrl.gmtTimezone, dialogCtrl.beginDateTime, dialogCtrl.endDateTime);
        }

        function watch() {
          game.formJsonPush = dialogCtrl.formJsonPush;
        }

        function cancel() {
          $mdDialog.cancel();
        }
      }
    }
  }
})();
