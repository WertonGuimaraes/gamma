(function () {
  'use strict';

  angular.module('gmm').controller('PushController', PushController);

  /* @ngInject */
  /*jshint -W071*/
  /*jshint -W072*/
  function PushController($state, $stateParams, campaignService, regionService, gameService, dialogService, pushService,
                          playerService, participantService, campaignsPrepService, moment, pushPrepTranslateService) {

    var pushCtrl = this;
    pushCtrl.pushDetails = {};
    pushCtrl.total = 0;
    pushCtrl.campaigns = [];
    pushCtrl.translate = pushPrepTranslateService;
    pushCtrl.cancel = cancel;
    pushCtrl.changeGame = changeGame;
    pushCtrl.disablePush = disablePush;
    pushCtrl.filterChange = filterChange;
    pushCtrl.onAddPush = onAddPush;
    pushCtrl.onDeselect = onDeselect;
    pushCtrl.onRemove = onRemove;
    pushCtrl.onSelect = onSelect;
    pushCtrl.PushDetailsController = PushDetailsController;
    pushCtrl.querySearchCampaign = querySearchCampaign;
    pushCtrl.querySearchGame = querySearchGame;
    pushCtrl.querySearchRegion = querySearchRegion;
    pushCtrl.removeCampaign = removeCampaign;
    pushCtrl.removeGame = removeGame;
    pushCtrl.removeRegion = removeRegion;
    pushCtrl.sendMessagePush = sendMessagePush;
    pushCtrl.showDialogPushDetails = showDialogPushDetails;

    setUrlFallback();
    setGames();
    setRegions();
    setCampaigns();
    setDates();
    configSaveButton(false, pushCtrl.translate.SAVE_ID);
    filterChange();

    function onSelect(index) {
      if (pushCtrl.games[index].formPushValues.length > 0) {
        angular.element('md-tab-item:nth-child(' + (index + 1) + ') span').css({'color': 'rgb(63,81,181)'});
      }
    }

    function onDeselect(index) {
      var tab = angular.element('md-tab-item:nth-child(' + (index + 1) + ') span');
      if (pushCtrl.games[index].formPushValues.length <= 0) {
        tab.css({'color': 'red'});
      } else {
        tab.css({'color': 'rgba(0,0,0,0.54)'});
      }
    }

    function changeGame(game) {
      /*jshint -W106*/
      if (game.push_templates.length <= 0) {
        var index = pushCtrl.games.indexOf(game);
        pushCtrl.games.splice(index, 1);
        dialogService.showToastInfo(pushCtrl.translate.INFO_NOT_PUSH_CONFIGURATION_ID, 5000);
        return;
      }

      pushCtrl.filterChange();

    }

    function onRemove(game) {
      onDeselect(pushCtrl.games.indexOf(game));
    }

    function onAddPush(game) {
      onSelect(pushCtrl.games.indexOf(game));
    }

    function setUrlFallback() {
      if ($stateParams.urlFallback) {
        pushCtrl.urlFallback = $stateParams.urlFallback;
      } else {
        pushCtrl.urlFallback = 'home.push.list';
      }
    }

    function setGames() {
      if ($stateParams.games) {
        pushCtrl.games = $stateParams.games;
      } else {
        pushCtrl.games = [];
      }
    }

    function setRegions() {
      if ($stateParams.regions) {
        pushCtrl.regions = $stateParams.regions;
      } else {
        pushCtrl.regions = [];
      }
    }

    function setCampaigns() {
      pushCtrl.campaigns.push.apply(pushCtrl.campaigns, $stateParams.campaigns);
      pushCtrl.campaigns.push.apply(pushCtrl.campaigns, campaignsPrepService.results);
    }

    function setBeginDateTime() {
      if ($stateParams.beginDateTime) {
        pushCtrl.beginDateTime = $stateParams.beginDateTime;
      } else {
        pushCtrl.beginDateTime = undefined;
      }
    }

    function setEndDateTime() {
      if ($stateParams.endDateTime) {
        pushCtrl.endDateTime = $stateParams.endDateTime;
      } else {
        pushCtrl.endDateTime = undefined;
      }
    }

    function setDates() {
      setBeginDateTime();
      setEndDateTime();
    }

    function cancel(ev) {
      dialogService.showConfirm(ev, pushCtrl.translate.CONFIRM_CANCEL_ID, goBack);

      function goBack() {
        $state.go(pushCtrl.urlFallback);
      }
    }

    function redirectState() {
      $state.go('home.push.list');
    }

    function filterChange() {
      filter(getGamesId().toString(), getRegionsId().toString(), getCampaignsId().toString(),
        1, getCorrectDate(pushCtrl.beginDateTime), getCorrectDate(pushCtrl.endDateTime), successFilter);
    }

    function filter(gamesId, regionsId, campaignsId, page, beginDate, endDate, success) {
      if (campaignsId !== '') {
        participantService.countSearch(regionsId, gamesId, campaignsId, page, beginDate, endDate)
          .then(success, errorFilter);
      } else {
        playerService.countSearch(regionsId, gamesId, page, beginDate, endDate).then(success, errorFilter);
      }
    }

    function successFilter(data) {
      pushCtrl.pushDetails = data;
      pushCtrl.total = data.count;
    }

    function errorFilter() {
      pushCtrl.total = 0;
    }

    function remove(list, item) {
      for (var i = list.length; i--;) {
        if (list[i].id === item.id) {
          return i;
        }
      }
    }

    function removeGame(iten) {
      var gamesID = getGamesId();
      gamesID.splice(remove(pushCtrl.games, iten), 1);
      filter(gamesID.toString(), getRegionsId().toString(), getCampaignsId().toString(), 1,
        undefined, undefined, successFilter);
    }

    function removeCampaign(iten) {
      var campaignsID = getCampaignsId();
      campaignsID.splice(remove(pushCtrl.campaigns, iten), 1);
      filter(getGamesId().toString(), getRegionsId().toString(), campaignsID.toString(), 1,
        undefined, undefined, successFilter);
    }

    function removeRegion(iten) {
      var regionsID = getRegionsId();
      regionsID.splice(remove(pushCtrl.regions, iten), 1);
      filter(getGamesId().toString(), regionsID.toString(), getCampaignsId().toString(), 1,
        undefined, undefined, successFilter);
    }

    function disablePush() {
      return pushCtrl.total <= 0 || pushCtrl.games.length <= 0 || !validatedGamePushValue();
    }

    function validatedGamePushValue() {
      for (var i in pushCtrl.games) {
        if (pushCtrl.games[i] !== null) {
          if (pushCtrl.games[i].formPushValues.length <= 0) {
            return false;
          }
        }
      }
      return true;
    }

    function getCampaignsId() {
      return pushCtrl.campaigns.map(function (campaign) {
        return campaign.id;
      });
    }

    function getGamesId() {
      return pushCtrl.games.map(function (game) {
        return game.id;
      });
    }

    function getRegionsId() {
      /*jshint -W106*/
      return pushCtrl.regions.map(function (region) {
        return region.countries.map(function (country) {
          return country.country_code;
        });
      });
    }

    function getQuery(game) {
      /*jshint -W106*/
      var query = {};
      if (getGamesId().length > 0) {
        query.games = game.id;
      }
      if (getRegionsId().length > 0) {
        var regionsId = getRegionsId().toString();
        regionsId = regionsId.split('"').join('\'');
        query.location_country_codes = regionsId;
      }
      if (getCampaignsId().length > 0) {
        query.campaigns = getCampaignsId();
      }

      query = JSON.stringify(query);
      query = query.split('[').join('\'');
      query = query.split(']').join('\'');

      return query;
    }

    function querySearchRegion(query) {
      return regionService.list(query, true, 'name', 1, true).then(function (data) {
        return data.results;
      });
    }

    function querySearchGame(query) {
      return gameService.list(query, true, 'name', 1).then(function (data) {
        return data.results;
      });
    }

    function querySearchCampaign(query) {
      return campaignService.list('', '', '', query, false, 'name', 1).then(function (data) {
        return data.results;
      });
    }

    function showDialogPushDetails(ev) {
      dialogService.showPushDetails(ev, PushDetailsController);
    }

    /* @ngInject */
    function PushDetailsController($mdDialog) {
      var dialogCtrl = this;
      dialogCtrl.pushDetails = pushCtrl.pushDetails;
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
        filter(getGamesId().toString(), getRegionsId().toString(), getCampaignsId().toString(), page,
          undefined, undefined, successNextListPushDetails);
      }

      function successNextListPushDetails(data) {
        dialogCtrl.pushDetails.results.push.apply(dialogCtrl.pushDetails.results, data.results);
      }
    }

    function sendMessagePush(ev) {
      dialogService.showConfirm(ev, pushCtrl.translate.CONFIRM_SEND_PUSH_ID, push);
    }

    function addQuery(pushJson) {
      for (var i in pushCtrl.games) {
        if (pushCtrl.games[i] !== null) {
          for (var j in pushCtrl.games[i].formPushValues) {
            if (pushCtrl.games[i].formPushValues[j] !== null) {
              var pushValue = angular.copy(pushCtrl.games[i].formPushValues[j]);
              pushValue.query = getQuery(pushCtrl.games[i]);
              pushValue.data = angular.toJson(pushValue.data);
              pushJson.pushes.push(pushValue);
            }
          }
        }
      }
    }

    function push() {
      /*jshint -W106*/
      configSaveButton(true, pushCtrl.translate.SAVING_ID);
      var pushJson = {};
      pushJson.pushes = [];
      addQuery(pushJson);
      pushService.push(pushJson, successPush, errorPush);
    }

    function successPush() {
      dialogService.showToast (pushCtrl.translate.SUCCESS_SEND_ID);
      redirectState();
    }

    function errorPush() {
      configSaveButton(false, pushCtrl.translate.SAVE_ID);
    }

    function configSaveButton(buttonSave, buttonText) {
      pushCtrl.buttonSave = buttonSave;
      pushCtrl.buttonText = buttonText;
    }

    function getCorrectDate(date) {
      return moment(date).isValid() && angular.isDefined(date) ? date : undefined;
    }

  }
})();
