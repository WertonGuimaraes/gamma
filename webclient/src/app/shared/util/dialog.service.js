(function () {
  'use strict';

  angular.module('gmm')
    .factory('dialogService', dialogService);

  /* @ngInject */
  function dialogService($mdToast, $mdDialog, $translate) {

    var service = {
      show: show,
      showConfirm: showConfirm,
      showToast: showToast,
      showToastInfo: showToastInfo,
      showCampaignDialog: showCampaignDialog,
      showBannerDialog: showBannerDialog,
      showRegionDialog: showRegionDialog,
      showLoginDialog: showLoginDialog,
      showPushDetails: showPushDetails,
      showPushDetailsSuccess: showPushDetailsSuccess,
      showRenameFormDialog: showRenameFormDialog,
      showCampaignConfigDialog: showCampaignConfigDialog,
      showPushConfigDialog: showPushConfigDialog,
      showGroupDialog: showGroupDialog,
      showUserDialog: showUserDialog
    };

    return service;

    function showConfirm(ev, title, ok) {
      return $translate(['YES_ID', 'NO_ID']).then(confirmTranslate);

      function confirmTranslate(translations) {
        var confirm = $mdDialog.confirm()
          .title(title)
          .targetEvent(ev)
          .ariaLabel('confirmCancel')
          .ok(translations.YES_ID)
          .cancel(translations.NO_ID);
        $mdDialog.show(confirm).then(ok);
      }
    }

    function show(parent, title, content, ariaLabel, clickOutsideToClose, ok, functionFinally) {

      if (parent == null) {
        parent = angular.element(document.querySelector('#divHome'));
      }

      var mdAlert = $mdDialog.alert()
        .parent(parent)
        .title(title)
        .textContent(content)
        .ariaLabel(ariaLabel)
        .clickOutsideToClose(clickOutsideToClose)
        .ok(ok);

      $mdDialog
        .show(mdAlert)
        .finally(functionFinally);
    }

    function showToast(message) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position('top right')
          .hideDelay(1500)
      );
    }

    function showToastInfo(message, time) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position('top right')
          .theme('success-toast')
          .hideDelay(time)
      );
    }

    function showPushConfigDialog(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/directives/gmm-multi-push/push.show-dialog-configuration.html');
    }

    function showCampaignConfigDialog(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/campaign/campaign.show-dialog-configuration.html');
    }

    function showRegionDialog(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/region/region.show-dialog-template.html');
    }

    function showRenameFormDialog(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/game/game.dialog-rename-form.html');
    }

    function showBannerDialog(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/banner/banner.show-dialog-template.html');
    }

    function showCampaignDialog(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/campaign/campaign.show-dialog-template.html');
    }

    function showGroupDialog(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/group/group.show-dialog-template.html');
    }

    function showPushDetails(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/push/push.show-dialog-template-details.html');
    }

    function showPushDetailsSuccess(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/push/push.show-dialog-template-details.success.html');
    }

    function showUserDialog(ev, dialogController) {
      showDialog(ev, dialogController, 'app/components/user/user.show-dialog-template.html');
    }

    function showLoginDialog() {
      $mdDialog.show({
        templateUrl: 'app/components/login/login.show-dialog.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false
      });
    }

    function showDialog(ev, dialogController, templateUrl) {
      $mdDialog.show({
        controller: dialogController,
        controllerAs: 'dialogCtrl',
        templateUrl: templateUrl,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    }
  }
})();

