(function () {
  'use strict';

  angular.module('gmm')
    .controller('ParticipantsController', ParticipantsController);

  /* @ngInject */
  /*jshint -W072*/
  function ParticipantsController($state, $scope, $mdSidenav, participantPrepService, participantService,
                                  campaignService, regionService, gameService, $stateParams, exportCsvService, moment) {

    /*jshint -W071*/
    var participantsCtrl = this;
    var lastField = 'game__name';
    var listCount = count();
    var SIMPLE_DATE_FORMAT = 'MM-DD-YYYY';
    participantsCtrl.campaignId = $stateParams.campaignId;
    participantsCtrl.controllerToolbar = $scope.$parent.homeCtrl;
    participantsCtrl.controllerToolbar.viewAll = viewAllParticipants;
    participantsCtrl.controllerToolbar.change = change;
    participantsCtrl.controllerToolbar.notNew = true;
    participantsCtrl.controllerToolbar.filter = true;
    participantsCtrl.export = exportCsvService.exportParticipant;
    participantsCtrl.ascendant = true;
    participantsCtrl.clearFilter = clearFilter;
    participantsCtrl.closeSidenavFilter = closeSidenavFilter;
    participantsCtrl.isLastSortedField = isLastSortedField;
    participantsCtrl.checkLastField = checkLastField;
    participantsCtrl.formatDate = formatDate;
    participantsCtrl.games = [];
    participantsCtrl.regions = [];
    participantsCtrl.list = list();
    participantsCtrl.listParticipants = list();
    participantsCtrl.lowercaseCountryCode = lowercaseCountryCode;
    participantsCtrl.nextList = nextList;
    participantsCtrl.orderBy = orderBy;
    participantsCtrl.page = 1;
    participantsCtrl.filter = filter;
    participantsCtrl.lastQuery = '';
    participantsCtrl.removeGame = removeGame;
    participantsCtrl.removeRegion = removeRegion;
    participantsCtrl.querySearchGame = querySearchGame;
    participantsCtrl.querySearchRegion = querySearchRegion;
    participantsCtrl.export.getCsvExport = getCsvExport;
    participantsCtrl.export.sendEmail = sendEmail;
    participantsCtrl.sendEmail = sendEmail;
    participantsCtrl.sendPush = sendPush;
    participantsCtrl.showFilter = showFilter;

    function forAllPages(onSuccess) {
      return participantService.list(getGamesId().toString(), getRegionsId().toString(), participantsCtrl.campaignId,
        participantsCtrl.ascendant, lastField, 'all', participantsCtrl.lastQuery).then(onSuccess);
    }

    function getCsvExport() {
      participantsCtrl.export.fileName = participantsCtrl.export.participantFileName();
      return forAllPages(exportCSV);

      function exportCSV(data) {
        return participantsCtrl.export.participantExport(data.results);
      }
    }

    function sendEmail() {
      return forAllPages(getEmailsAndRedirectToEmailPage);

      function getEmailsAndRedirectToEmailPage(data) {
        var emails = [];
        data.results.map(function(object){
          emails.push(object.email);
        });

        $state.go('home.email', { 'emailsTo': emails, 'urlFallback': 'home.campaign.list' });
      }
    }

    function sendPush() {
      $state.go('home.push.create', { 'games': participantsCtrl.games, 'regions': participantsCtrl.regions,
        'campaignsIds': [participantsCtrl.campaignId], 'beginDateTime': getCorrectDate(participantsCtrl.beginDateTime),
        'endDateTime': getCorrectDate(participantsCtrl.endDateTime) });
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

    function change(query) {
      participantsCtrl.lastQuery = query;
      participantsCtrl.page = 1;
      filterParticipants(success);
    }

    function isLastSortedField(field) {
      return field === lastField;
    }

    function checkLastField(field) {
      return isLastSortedField(field) ? 'selected' : 'default';
    }

    function filter() {
      participantsCtrl.page = 1;
      filterParticipants(success);
    }

    function filterParticipants(success) {
      participantService.list(getGamesId().toString(), getRegionsId().toString(), participantsCtrl.campaignId,
        participantsCtrl.ascendant, lastField, participantsCtrl.page, participantsCtrl.lastQuery,
        getCorrectDate(participantsCtrl.beginDateTime), getCorrectDate(participantsCtrl.endDateTime)).then(success);
    }

    function getGamesId() {
      return participantsCtrl.games.map(function (game) {
        return game.id;
      });
    }

    function getRegionsId() {
      /*jshint -W106*/
      return participantsCtrl.regions.map(function (region) {
        return region.countries.map(function (country) {
          return country.country_code;
        });
      });
    }

    function getCorrectDate(date) {
      return moment(date).isValid() ? date : undefined;
    }

    function list() {
      return participantPrepService.results;
    }

    function count() {
      return participantPrepService.count;
    }

    function lowercaseCountryCode(countryCode) {
      return angular.lowercase(countryCode);
    }

    function nextList() {
      if (listCount > participantsCtrl.list.length) {
        ++participantsCtrl.page;
        filterParticipants(pushSuccess);
      }
    }

    function orderBy(field) {
      participantsCtrl.page = 1;
      participantsCtrl.ascendant = isLastSortedField(field) ? !participantsCtrl.ascendant : false;
      lastField = field;
      filterParticipants(success);
    }

    function remove(list, item) {
      for (var i = list.length; i--;) {
        if (list[i].id === item.id) {
          return i;
        }
      }
    }

    function removeGame(item) {
      var gamesID = getGamesId();
      gamesID.splice(remove(participantsCtrl.games, item), 1);
      participantService.list(gamesID.toString(), getRegionsId().toString(), participantsCtrl.campaignId,
        participantsCtrl.ascendant, lastField, participantsCtrl.page, participantsCtrl.lastQuery).then(success);
    }

    function removeRegion(iten) {
      var regionsID = getRegionsId();
      regionsID.splice(remove(participantsCtrl.regions, iten), 1);
      participantService.list(getGamesId().toString(), regionsID.toString(), participantsCtrl.campaignId,
        participantsCtrl.ascendant, lastField, participantsCtrl.page, participantsCtrl.lastQuery).then(success);
    }

    function success(data) {
      participantsCtrl.list = data.results;
      listCount = data.count;
    }

    function pushSuccess(data) {
      if (data.results.length > 0) {
        participantsCtrl.list.push.apply(participantsCtrl.list, data.results);
        listCount = data.count;
      }
    }

    function viewAllParticipants() {
      $state.go('home.campaign.participants', {campaignId: participantsCtrl.campaignId}, {reload: true});
    }

    function closeSidenavFilter() {
      $mdSidenav('right').close();
    }

    function clearFilter() {
      participantsCtrl.beginDateTime = undefined;
      participantsCtrl.endDateTime = undefined;
      filterParticipants(success);
    }

    function showFilter() {
      return (participantsCtrl.beginDateTime !== undefined || participantsCtrl.beginDateTime != null ||
              participantsCtrl.endDateTime !== undefined || participantsCtrl.endDateTime != null);
    }

    function formatDate(date) {
      return moment(date).format(SIMPLE_DATE_FORMAT);
    }

  }
})();
