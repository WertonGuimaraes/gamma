(function () {
  'use strict';

  angular.module('gmm')
    .controller('PlayersController', PlayersController);

  /* @ngInject */
  /*jshint -W071*/
  function PlayersController($scope, $state, playersPrepService, playerService, gameService, regionService,
                             exportCsvService, moment) {

    var playersCtrl = this;
    var lastField = 'game__name';
    var listCount = count();
    playersCtrl.controllerToolbar = $scope.$parent.homeCtrl;
    playersCtrl.controllerToolbar.viewAll = viewAllPlayers;
    playersCtrl.controllerToolbar.notNew = true;
    playersCtrl.controllerToolbar.change = change;
    playersCtrl.ascendant = true;
    playersCtrl.export = exportCsvService.exportPlayer;
    playersCtrl.isLastSortedField = isLastSortedField;
    playersCtrl.checkLastField = checkLastField;
    playersCtrl.games = [];
    playersCtrl.list = list();
    playersCtrl.listPlayers = list();
    playersCtrl.lowercaseCountryCode = lowercaseCountryCode;
    playersCtrl.nextList = nextList;
    playersCtrl.orderBy = orderBy;
    playersCtrl.page = 1;
    playersCtrl.regions = [];
    playersCtrl.filter = filter;
    playersCtrl.lastQuery = '';
    playersCtrl.removeGame = removeGame;
    playersCtrl.removeRegion = removeRegion;
    playersCtrl.querySearchGame = querySearchGame;
    playersCtrl.querySearchRegion = querySearchRegion;
    playersCtrl.getListExport = getListExport;
    playersCtrl.export.getCsvExport = getListExport;
    playersCtrl.sendPush = sendPush;

    function sendPush() {
      $state.go('home.push.create', { 'games': playersCtrl.games, 'regions': playersCtrl.regions,
                        'beginDateTime': playersCtrl.beginDateTime, 'endDateTime': playersCtrl.endDateTime });
    }

    function getListExport() {
      playersCtrl.export.fileName = playersCtrl.export.playerFileName();
      return playerService.list(getGamesId().toString(), getRegionsId().toString(), playersCtrl.ascendant, lastField,
        'all', playersCtrl.lastQuery).then(successAll);
      function successAll(data) {
        return playersCtrl.export.playerExport(data.results);
      }
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
      playersCtrl.lastQuery = query;
      playersCtrl.page = 1;
      filterPlayers(success);
    }

    function isLastSortedField(field){
      return field === lastField;
    }

    function checkLastField(field) {
      return isLastSortedField(field) ? 'selected' : 'default';
    }

    function filter() {
      playersCtrl.page = 1;
      filterPlayers(success);
    }

    function filterPlayers(success) {
      playerService.list(getGamesId().toString(), getRegionsId().toString(), playersCtrl.ascendant, lastField,
        playersCtrl.page, playersCtrl.lastQuery, getCorrectDate(playersCtrl.beginDateTime),
        getCorrectDate(playersCtrl.endDateTime)).then(success);
    }

    function getGamesId() {
      return playersCtrl.games.map(function (game) {
        return game.id;
      });
    }

    function getRegionsId() {
      /*jshint -W106*/
      return playersCtrl.regions.map(function (region) {
        return region.countries.map(function (country) {
          return country.country_code;
        });
      });
    }

    function getCorrectDate(date) {
      return moment(date).isValid() ? date : undefined;
    }

    function list() {
      return playersPrepService.results;
    }

    function count() {
      return playersPrepService.count;
    }

    function lowercaseCountryCode(countryCode) {
      return angular.lowercase(countryCode);
    }

    function nextList() {
      if (listCount > playersCtrl.list.length) {
        ++playersCtrl.page;
        filterPlayers(successNextList);
      }
    }

    function orderBy(field) {
      playersCtrl.page = 1;
      playersCtrl.ascendant = isLastSortedField(field) ? !playersCtrl.ascendant : false;
      lastField = field;
      filterPlayers(success);
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
      gamesID.splice(remove(playersCtrl.games, iten), 1);
      playerService.list(gamesID.toString(), getRegionsId().toString(), playersCtrl.ascendant, lastField,
        playersCtrl.page, playersCtrl.lastQuery).then(success);
    }

    function removeRegion(iten) {
      var regionsID = getRegionsId();
      regionsID.splice(remove(playersCtrl.regions, iten), 1);
      playerService.list(getGamesId().toString(), regionsID.toString(), playersCtrl.ascendant, lastField,
        playersCtrl.page, playersCtrl.lastQuery).then(success);
    }

    function success(data) {
      playersCtrl.list = data.results;
      listCount = data.count;
    }

    function successNextList(data) {
      if (data.results.length > 0) {
        playersCtrl.list.push.apply(playersCtrl.list, data.results);
        listCount = data.count;
      }
    }

    function viewAllPlayers() {
      $state.go('home.players.list', {}, {reload: true});
    }

  }

})();
