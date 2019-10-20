(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('CampaignControllerList', CampaignControllerList);

  /* @ngInject */
  /*jshint -W071*/
  /*jshint -W072*/
  function CampaignControllerList($timeout, $scope, $state, $interval, $translate,
                                  campaignPrepService, campaignService,
                                  dialogService, exportCsvService, $mdSidenav,
                                  regionService, gameService, querySearchService, generalPrepService, generalService) {


    var CLASS_CARD_CAMPAIGN_DISABLED = 'card-list-campaign-disable';
    var CLASS_CARD_CAMPAIGN_INACTIVE = 'card-list-campaign-inactive';
    var CLASS_CARD_CAMPAIGN_ACTIVE = 'card-list-campaign-active';
    var CLASS_CARD_CAMPAIGN_COMPLETED = 'card-list-campaign-completed';

    var CAMPAIGN_NOT_STARTED_ACTIVE = 'CAMPAIGN_NOT_STARTED_ACTIVE';
    var CAMPAIGN_NOT_STARTED_INACTIVE = 'CAMPAIGN_NOT_STARTED_INACTIVE';
    var CAMPAIGN_RUNNING_ACTIVE = 'CAMPAIGN_RUNNING_ACTIVE';
    var CAMPAIGN_RUNNING_INACTIVE = 'CAMPAIGN_RUNNING_INACTIVE';
    var CAMPAIGN_FINISHED_PARTICIPANTS_NUMBER = 'CAMPAIGN_FINISHED_PARTICIPANTS_NUMBER';
    var CAMPAIGN_FINISHED_TIME_OUT = 'CAMPAIGN_FINISHED_TIME_OUT';

    var ABOUT_TO_START = 'ABOUT TO START';
    var FINISHED = 'FINISHED';
    var PAUSED = 'PAUSED';
    var STARTED = 'STARTED';

    var UPDATE_TIME_PARTICIPANT_PUSH = generalPrepService.update_time_participant_number;

    var campaignCtlList = this;
    var dateNow = new Date();
    var listCount = campaignPrepService.count;
    var interval = {};

    campaignCtlList.lastField = 'status';
    campaignCtlList.ascendant = false;
    campaignCtlList.list = campaignPrepService.results;
    campaignCtlList.infinityList = 1;
    campaignCtlList.lastQuery = '';
    campaignCtlList.status = 'all';
    campaignCtlList.ordinations = ordinations();
    campaignCtlList.filterStatus = filterStatus();
    campaignCtlList.games = [];
    campaignCtlList.regions = [];
    campaignCtlList.campaigns = [];
    campaignCtlList.timerInterval = 1000;

    campaignCtlList.controllerToolbar = $scope.$parent.homeCtrl;
    campaignCtlList.controllerToolbar.new = newCampaign;
    campaignCtlList.controllerToolbar.viewAll = viewAllCampaign;
    campaignCtlList.controllerToolbar.change = change;
    campaignCtlList.controllerToolbar.filter = true;

    campaignCtlList.export = exportCsvService.exportCampaign;
    campaignCtlList.export.getCsvExport = getCsvExport;
    campaignCtlList.querySearchRegion = querySearchService.querySearchRegion;
    campaignCtlList.querySearchGame = querySearchService.querySearchGame;
    campaignCtlList.querySearchCampaign = querySearchService.querySearchCampaign;
    campaignCtlList.clockTimeToFinishOnFinished = clockTimeToFinishOnFinished;
    campaignCtlList.getCardId = getCardId;
    campaignCtlList.getParticipantsCardId = getParticipantsCardId;
    campaignCtlList.lowercaseCountryCode = lowercaseCountryCode;
    campaignCtlList.getGameNames = getGameNames;
    campaignCtlList.showDialog = showDialog;
    campaignCtlList.nextList = nextList;
    campaignCtlList.countCountries = countCountries;
    campaignCtlList.participantsProgress = participantsProgress;
    campaignCtlList.classSelected = classSelected;
    campaignCtlList.getCampaignStatus = getNGClassForCampaign;
    campaignCtlList.shouldShowClockTimeToStart = shouldShowClockTimeToStart;
    campaignCtlList.campaignClockTimeToStart = campaignClockTimeToStart;
    campaignCtlList.clockTimeToStartOnFinished = clockTimeToStartOnFinished;
    campaignCtlList.shouldRunClockCampaignDuration = shouldRunClockCampaignDuration;
    campaignCtlList.campaignClockCampaignDuration = campaignClockCampaignDuration;
    campaignCtlList.shouldShowClockTimeToFinish = shouldShowClockTimeToFinish;
    campaignCtlList.campaignClockTimeToFinish = campaignClockTimeToFinish;
    campaignCtlList.filter = filter;
    campaignCtlList.clearFilter = clearFilter;
    campaignCtlList.removeGame = removeGame;
    campaignCtlList.removeRegion = removeRegion;
    campaignCtlList.removeCampaign = removeCampaign;
    campaignCtlList.closeSidenavFilter = closeSidenavFilter;
    campaignCtlList.showFilter = showFilter;
    campaignCtlList.startCountDown = startCountDown;
    campaignCtlList.startClockDuration = startClockDuration;
    campaignCtlList.startClockStartToTime = startClockStartToTime;
    campaignCtlList.startClockTimeToFinish = startClockTimeToFinish;
    campaignCtlList.setLabelActiveCampaign = setLabelActiveCampaign;

    runIntervalParticipants();

    function startClockStartToTime(campaign) {
      if (shouldShowClockTimeToStart(campaign)) {
        startClock('clockCampaignTimeToStart' + campaign.id);
      }
    }

    function startClockDuration(campaign) {
      campaign.startTime = campaignClockCampaignDuration(campaign);
      if (shouldRunClockCampaignDuration(campaign)) {
        startClock('clockCampaignDuration' + campaign.id);
      }
    }

    function startClockTimeToFinish(campaign) {
      if (shouldShowClockTimeToFinish(campaign)) {
        campaign.countdown = campaignClockTimeToFinish(campaign);
        startClock('clockTimeToFinish' + campaign.id);
      } else {
        /*jshint -W106*/
        campaign.countdown = (new Date(campaign.end_date) - new Date(campaign.expiration_date)) / 1000;
      }
    }

    function startClock(id) {
      $timeout(function () {
        document.getElementById(id).start();
      }, 1000);
    }

    function startCountDown(campaign) {
      if (campaignCtlList.shouldShowClockTimeToFinish(campaign)) {
        document.getElementById('clockTimeToFinish' + campaign.id).start();
      }
    }

    function clockTimeToStartOnFinished(campaign) {

      dateNow = new Date();
      var clockTimeToFinish = document.getElementById('clockTimeToFinish' + campaign.id);

      startClockDuration(campaign);
      startClockTimeToFinish(campaign);
      var card = document.getElementById(getCardId(campaign));
      var cardParticipants = document.getElementById(getParticipantsCardId(campaign));
      shiftClass(card, CLASS_CARD_CAMPAIGN_INACTIVE, CLASS_CARD_CAMPAIGN_ACTIVE);
      shiftClass(cardParticipants, CLASS_CARD_CAMPAIGN_INACTIVE, CLASS_CARD_CAMPAIGN_ACTIVE);
    }

    function getCardId(campaign) {
      return 'campaignCard' + campaign.id;
    }

    function getParticipantsCardId(campaign) {
      return 'campaignParticipantsCard' + campaign.id;
    }

    function showFilter() {
      return (campaignCtlList.games.length > 0 || campaignCtlList.regions.length > 0 ||
      campaignCtlList.campaigns.length > 0 || campaignCtlList.status !== 'all');
    }

    function closeSidenavFilter() {
      $mdSidenav('right').close();
    }

    function clearFilter() {
      campaignCtlList.lastField = 'status';
      campaignCtlList.ascendant = false;
      campaignCtlList.status = 'all';
      campaignCtlList.games = [];
      campaignCtlList.regions = [];
      campaignCtlList.campaigns = [];
      filterCampaign(querySearchService.getIds(campaignCtlList.games).toString(),
        querySearchService.getRegionsId(campaignCtlList.regions).toString(),
        querySearchService.getIds(campaignCtlList.campaigns).toString(), success);
    }

    function ordinations() {
      return [
        {'key': 'begin_date', 'value': 'BEGIN_DATE_ID'},
        {'key': 'created_date', 'value': 'CREATED_ID'},
        {'key': 'end_date', 'value': 'END_DATE_ID'},
        {'key': 'name', 'value': 'NAME_ID'},
        {'key': 'total_registered_participants', 'value': 'PARTICIPANTS_NUMBER_ID'},
        {'key': 'total_registered_percentage', 'value': 'PARTICIPANTS_PERCENTAGE_ID'},
        {'key': 'status', 'value': 'STATUS_ID'},
        {'key': 'modified_date', 'value': 'UPDATE_ID'}
      ];
    }

    function filterStatus() {
      return [
        {'key': 'all', 'value': 'ALL_ID'},
        {'key': 'started', 'value': 'STARTED_ID'},
        {'key': 'about to start', 'value': 'ABOUT_TO_START_ID'},
        {'key': 'paused', 'value': 'PAUSED_ID'},
        {'key': 'finished', 'value': 'FINISHED_ID'}
      ];
    }


    function removeGame(item) {
      var gamesID = querySearchService.getIds(campaignCtlList.games);
      gamesID.splice(querySearchService.remove(campaignCtlList.games, item), 1);
      filterCampaign(gamesID.toString(), querySearchService.getRegionsId(campaignCtlList.regions).toString(),
        querySearchService.getIds(campaignCtlList.campaigns).toString(), success);
    }

    function removeRegion(iten) {
      var regionsID = querySearchService.getRegionsId(campaignCtlList.regions);
      regionsID.splice(querySearchService.remove(campaignCtlList.regions, iten), 1);
      filterCampaign(querySearchService.getIds(campaignCtlList.games).toString(), regionsID.toString(),
        querySearchService.getIds(campaignCtlList.campaigns).toString(), success);
    }

    function removeCampaign(iten) {
      var campaignsID = querySearchService.getIds(campaignCtlList.campaigns);
      campaignsID.splice(querySearchService.remove(campaignCtlList.campaigns, iten), 1);
      filterCampaign(querySearchService.getIds(campaignCtlList.games).toString(),
        querySearchService.getRegionsId(campaignCtlList.regions).toString(), campaignsID.toString(), success);
    }

    function filter() {
      campaignCtlList.infinityList = 1;
      filterCampaign(querySearchService.getIds(campaignCtlList.games).toString(),
        querySearchService.getRegionsId(campaignCtlList.regions).toString(),
        querySearchService.getIds(campaignCtlList.campaigns).toString(), success);
    }

    function filterCampaign(games, regions, campaigns, success) {
      campaignService.list(games, regions, campaigns, campaignCtlList.lastQuery, campaignCtlList.ascendant,
        campaignCtlList.lastField, campaignCtlList.infinityList, campaignCtlList.status).then(success);
    }

    function getCsvExport() {
      campaignCtlList.export.fileName = campaignCtlList.export.campaignFileName();
      return campaignService.list(querySearchService.getIds(campaignCtlList.games).toString(),
        querySearchService.getRegionsId(campaignCtlList.regions).toString(),
        querySearchService.getIds(campaignCtlList.campaigns).toString(),
        campaignCtlList.lastQuery, campaignCtlList.ascendant, campaignCtlList.lastField, 'all', campaignCtlList.status)
        .then(successAll);
      function successAll(data) {
        return campaignCtlList.export.campaignExport(data.results);
      }
    }

    function classSelected(campaign) {
      var ngClass = 'card-info';
      var progress = campaignCtlList.participantsProgress(campaign);
      if (progress > 50 && progress < 100) {
        ngClass = 'card-warn';
      } else if (progress >= 100) {
        ngClass = 'card-end';
      }
      return ngClass;
    }

    function participantsProgress(campaign) {
      /*jshint -W106*/

      // Just in case there is any inconsistency in the db
      if (campaign.participant_limit === 0) {
        return 100;
      }

      var total = (campaign.total_registered_participants / campaign.participant_limit) * 100;

      if (total === 0) {
        return total;
      }

      return total.toFixed(2);
    }

    function change(query) {
      campaignCtlList.lastQuery = query;
      campaignCtlList.lastField = 'name';
      campaignCtlList.ascendant = true;
      campaignCtlList.infinityList = 1;
      dateNow = new Date();
      filterCampaign(querySearchService.getIds(campaignCtlList.games).toString(),
        querySearchService.getRegionsId(campaignCtlList.regions).toString(),
        querySearchService.getIds(campaignCtlList.campaigns).toString(), success);
    }

    function countCountries(regions) {
      var count = 1;

      for (var i in regions) {
        if (regions.hasOwnProperty(i)) {
          count += regions[i].countries.length;
        }
      }

      return (count - 2);
    }

    function timeDiffInSeconds(begin, end) {
      return (new Date(end) - new Date(begin)) / 1000;
    }

    function timeDiffInSecondsFrom(date) {
      return (dateNow - new Date(date)) / 1000;
    }

    function timeDiffInSecondsTo(date) {
      return (new Date(date) - dateNow) / 1000;
    }

    function shouldShowClockTimeToStart(campaign) {
      var status = getCampaignStatus(campaign);
      return status === CAMPAIGN_NOT_STARTED_ACTIVE || status === CAMPAIGN_NOT_STARTED_INACTIVE;
    }

    function campaignClockTimeToStart(campaign) {
      /*jshint -W106*/
      if (shouldShowClockTimeToStart(campaign)) {
        var response = timeDiffInSecondsTo(campaign.begin_date);
        return response == null || response < 0 ? 0 : response;
      }
      return 0;
    }

    function shouldRunClockCampaignDuration(campaign) {
      var status = getCampaignStatus(campaign);
      return (status === CAMPAIGN_RUNNING_ACTIVE);
    }

    function shouldShowClockCampaignDuration(campaign) {
      var status = getCampaignStatus(campaign);
      return (status === CAMPAIGN_RUNNING_ACTIVE || status === CAMPAIGN_RUNNING_INACTIVE) ||
        status === CAMPAIGN_FINISHED_TIME_OUT || status === CAMPAIGN_FINISHED_PARTICIPANTS_NUMBER;
    }

    function campaignClockCampaignDuration(campaign) {
      /*jshint -W106*/
      var duration = campaign.partial_enabled_time * 1000;
      if (campaign.active && shouldShowClockCampaignDuration(campaign)) {
        var status = getCampaignStatus(campaign);

        var end = campaign.end_date;
        if (status === CAMPAIGN_RUNNING_ACTIVE) {
          end = dateNow;
        } else if (status === CAMPAIGN_FINISHED_PARTICIPANTS_NUMBER) {
          end = campaign.expiration_date;
        }
        duration += (new Date(end) - new Date(campaign.last_enabled_time));
      }

      return dateNow.getTime() - duration;
    }

    function shouldShowClockTimeToFinish(campaign) {
      var status = getCampaignStatus(campaign);
      return (status === CAMPAIGN_RUNNING_ACTIVE || status === CAMPAIGN_RUNNING_INACTIVE);
    }

    function campaignClockTimeToFinish(campaign) {
      /*jshint -W106*/
      if (shouldShowClockTimeToFinish(campaign)) {
        return timeDiffInSecondsTo(campaign.end_date);
      }
      return 0;
    }

    function clockTimeToFinishOnFinished(campaign) {
      var timer = document.getElementById('clockCampaignDuration' + campaign.id);
      var card = document.getElementById(getCardId(campaign));
      var cardParticipants = document.getElementById(getParticipantsCardId(campaign));
      timer.stop();
      shiftClass(card, CLASS_CARD_CAMPAIGN_ACTIVE, CLASS_CARD_CAMPAIGN_COMPLETED);
      shiftClass(cardParticipants, CLASS_CARD_CAMPAIGN_ACTIVE, CLASS_CARD_CAMPAIGN_COMPLETED);
    }

    function shiftClass(element, oldClass, newClass) {
      try {
        if (element !== undefined && element.classList !== undefined && element.classList.contains(oldClass)) {
          element.classList.remove(oldClass);
          element.classList.add(newClass);
        }
      } catch (err) {
      }
    }

    function getGameNames(campaign) {
      var gameName = '';
      for (var i in campaign.forms) {
        if (campaign.forms.hasOwnProperty(i)) {
          gameName += campaign.forms[i].game.name + ', ';
        }
      }
      return gameName.substring(0, (gameName.length - 2));
    }

    function getGames(campaign) {
      var games = [];
      for (var i in campaign.forms) {
        if (campaign.forms.hasOwnProperty(i)) {
          var game = campaign.forms[i].game;
          if (game) {
            games.push(game);
          }
        }
      }
      return games;
    }

    function lowercaseCountryCode(countryCode) {
      return angular.lowercase(countryCode);
    }

    function newCampaign() {
      $state.go('home.campaign.create');
    }

    function nextList() {
      if (listCount > campaignCtlList.list.length) {
        ++campaignCtlList.infinityList;
        dateNow = new Date();
        filterCampaign(querySearchService.getIds(campaignCtlList.games).toString(),
          querySearchService.getRegionsId(campaignCtlList.regions).toString(),
          querySearchService.getIds(campaignCtlList.campaigns).toString(), successPush);
      }

      function successPush(data) {
        if (data.results.length > 0) {
          campaignCtlList.list.push.apply(campaignCtlList.list, data.results);
          listCount = data.count;
        }
      }
    }

    function showDialog(ev, campaign) {
      dialogService.showCampaignDialog(ev, DialogController);

      /* @ngInject */
      function DialogController($scope, $mdDialog) {

        var dialogCtrl = this;
        dialogCtrl.activate = activate;
        dialogCtrl.campaign = campaign;
        dialogCtrl.hide = hide;
        dialogCtrl.cancel = cancel;
        dialogCtrl.lowercaseCountryCode = lowercaseCountryCode;
        dialogCtrl.getGameNames = getGameNames;
        dialogCtrl.myInterval = 0;
        dialogCtrl.noWrapSlides = false;
        dialogCtrl.forms = forms();
        dialogCtrl.getGames = getGames;
        dialogCtrl.setLabelActiveCampaign = campaignCtlList.setLabelActiveCampaign;

        function activate(ev, active) {
          $mdDialog.cancel();

          $translate(msgStatus(campaign.active)).then(statusTranslate);

          function statusTranslate(status) {
            $translate('CONFIRM_CAMPAIGN_CHANGE_ENABLED_STATUS_ID', {'status': status}).then(showConfirmTranslate);
          }

          function showConfirmTranslate(translation) {
            dialogService.showConfirm(ev, translation, activeCampaign);
          }

          function activeCampaign() {
            dateNow = new Date();
            campaignService.activatedCampaign(dialogCtrl.campaign, active).then(successStatus);
          }
        }

        function msgStatus(status) {
          var msg = 'ENABLE_ID';
          if (status) {
            msg = 'DISABLE_ID';
          }
          return msg;
        }

        function successStatus(data) {
          campaign.active = data.active;
          filterCampaign(querySearchService.getIds(campaignCtlList.games).toString(),
            querySearchService.getRegionsId(campaignCtlList.regions).toString(),
            querySearchService.getIds(campaignCtlList.campaigns).toString(), success);

          $translate(msgStatus(campaign.active)).then(statusTranslate);

          function statusTranslate(status) {
            $translate('SUCCESS_CAMPAIGN_CHANGE_ENABLED_STATUS_ID', {'status': status}).then(showToastTranslate);
          }

          function showToastTranslate(translate) {
            dialogService.showToast (translate);
          }

        }

        function hide() {
          $mdDialog.hide();
        }

        function cancel() {
          $mdDialog.cancel();
        }

        function forms() {
          /*jshint -W106*/
          var json = [];
          if (dialogCtrl.campaign.forms !== undefined) {
            for (var i = 0; i < dialogCtrl.campaign.forms.length; i++) {
              var values = dialogCtrl.campaign.forms[i];
              values.form_value = angular.fromJson(angular.fromJson(values.form_value));
              values.game = values.game;
              json.push(values);
            }
          }
          return json;
        }
      }
    }

    function success(data) {
      listCount = data.count;
      campaignCtlList.list = data.results;
    }

    function viewAllCampaign() {
      $state.go('home.campaign.list', {}, {reload: true});
    }

    function isFuture(date) {
      return timeDiffInSecondsTo(date) > 0;
    }

    function isPast(date) {
      return timeDiffInSecondsFrom(date) > 0;
    }

    function getCampaignStatus(campaign) {
      /*jshint -W106*/
      if (isFuture(campaign.begin_date)) {
        return campaign.active ? CAMPAIGN_NOT_STARTED_ACTIVE : CAMPAIGN_NOT_STARTED_INACTIVE;
      }
      if (campaign.total_registered_participants >= campaign.participant_limit) {
        return CAMPAIGN_FINISHED_PARTICIPANTS_NUMBER;
      }
      if (isPast(campaign.end_date)) {
        return CAMPAIGN_FINISHED_TIME_OUT;
      }

      return campaign.active ? CAMPAIGN_RUNNING_ACTIVE : CAMPAIGN_RUNNING_INACTIVE;
    }

    function getNGClassForCampaign(campaign) {
      var status = getCampaignStatus(campaign);

      if (campaign.active === false) {
        return CLASS_CARD_CAMPAIGN_DISABLED;
      } else if (status === CAMPAIGN_FINISHED_PARTICIPANTS_NUMBER || status === CAMPAIGN_FINISHED_TIME_OUT) {
        return CLASS_CARD_CAMPAIGN_COMPLETED;
      } else if (status === CAMPAIGN_RUNNING_ACTIVE) {
        return CLASS_CARD_CAMPAIGN_ACTIVE;
      }

      return CLASS_CARD_CAMPAIGN_INACTIVE;
    }

    function setLabelActiveCampaign(campaign) {
      /*jshint -W106*/
      // About to start: When a campaign is enabled but did not start yet;
      if (isFuture(campaign.begin_date) && campaign.active) {
        return ABOUT_TO_START;
      }

      //Finished: A campaign has concluded (either by time or participants limit based criteria);
      if (campaign.total_registered_participants >= campaign.participant_limit || isPast(campaign.end_date)) {
        return FINISHED;
      }

      // Started: When a campaign has started and is enabled, but did not attend closure parameters yet;
      // Paused: When the campaign is disabled by an user;
      return campaign.active ? STARTED : PAUSED;
    }

    function runIntervalParticipants() {
      interval = $interval(updateParticipants, 1 * UPDATE_TIME_PARTICIPANT_PUSH * 1000);

      $scope.$watch(getCurrentStateName, cancelIntervalUpdateParticipants);
    }

    function getCurrentStateName() {
      return $state.current.name;
    }

    function cancelIntervalUpdateParticipants() {
      if (!$state.is('home.campaign.list')) {
        $interval.cancel(interval);
      }
    }

    function updateParticipants() {
      var activeCampaigns = [];

      for (var i = 0; i < campaignCtlList.list.length; i++) {
        var campaign = campaignCtlList.list[i];
        if (getCampaignStatus(campaign) === CAMPAIGN_RUNNING_ACTIVE) {
          activeCampaigns.push(campaign.id);
        }
      }

      if (activeCampaigns.length > 0) {
        /*jshint -W106*/
        campaignService.getParticipants(activeCampaigns).then(function (data) {
          for (var c = 0; c < campaignCtlList.list.length; c++) {
            var currentCampaign = campaignCtlList.list[c];
            for (var j = 0; j < data.results.length; j++) {
              var result = data.results[j];
              currentCampaign.total_registered_participants = changeRegisteredParticipants(currentCampaign, result);
              currentCampaign.countdown = stopClock(currentCampaign);
            }
          }
        });
      }

      $interval.cancel(interval);
      generalService.get().then(resetIntervalTimeUpdate);
    }

    function resetIntervalTimeUpdate(data) {
      interval = $interval(updateParticipants, 1 * data.update_time_participant_number * 1000);
    }

    function stopClock(campaign) {
      /*jshint -W106*/
      if (campaign.participant_limit === campaign.total_registered_participants) {
        clockTimeToFinishOnFinished(campaign);
        var timer = document.getElementById('clockTimeToFinish' + campaign.id);
        timer.stop();
        return campaignClockTimeToFinish(campaign);
      } else {
        return campaign.countdown;
      }
    }

    function changeRegisteredParticipants(campaign, result) {
      /*jshint -W106*/
      if (campaign.id === result.id) {
        return result.total_registered_participants;
      } else {
        return campaign.total_registered_participants;
      }
    }
  }

})
();
