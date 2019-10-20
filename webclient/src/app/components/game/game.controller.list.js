(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('GameControllerList', GameControllerList);

  /* @ngInject */
  function GameControllerList($scope, $state, gamePrepService, gameService, exportCsvService, $q) {

    var emptyText = '';
    var lastField = 'name';
    var gameCtrl = this;
    var listCount = count();
    gameCtrl.list = list();
    gameCtrl.infinityList = 1;
    gameCtrl.ascendant = true;
    gameCtrl.lastQuery = '';
    gameCtrl.orderBy = orderBy;
    gameCtrl.nextList = nextList;
    gameCtrl.isLastSortedField = isLastSortedField;
    gameCtrl.checkLastField = checkLastField;
    gameCtrl.controllerToolbar = $scope.$parent.homeCtrl;
    gameCtrl.controllerToolbar.new = newGame;
    gameCtrl.controllerToolbar.viewAll = viewAllGame;
    gameCtrl.controllerToolbar.change = change;
    gameCtrl.controllerToolbar.search = '';
    gameCtrl.export = exportCsvService.exportGame;
    gameCtrl.export.getCsvExport = getCsvExport;

    function getCsvExport() {
      gameCtrl.export.fileName = gameCtrl.export.gameFileName();
      return gameService.list(gameCtrl.lastQuery, gameCtrl.ascendant, lastField, 'all').then(successAll);
      function successAll(data) {
        return  gameCtrl.export.gameExport(data.results);
      }
    }

    function orderBy(field) {
      gameCtrl.infinityList = 1;
      gameCtrl.ascendant = isLastSortedField(field) ? !gameCtrl.ascendant : false;
      gameService.list(gameCtrl.lastQuery, gameCtrl.ascendant, field, gameCtrl.infinityList).then(success);
      lastField = field;
    }

    function isLastSortedField(field) {
      return field === lastField;
    }

    function checkLastField(field) {
      return isLastSortedField(field) ? 'selected' : 'default';
    }

    function list() {
      return gamePrepService.results;
    }

    function count() {
      return gamePrepService.count;
    }

    function nextList() {
      if (listCount > gameCtrl.list.length) {
        ++gameCtrl.infinityList;
        gameService.list(gameCtrl.lastQuery, gameCtrl.ascendant, lastField, gameCtrl.infinityList).then(success);
      }
      function success(data) {
        gameCtrl.list.push.apply(gameCtrl.list, data.results);
        listCount = data.count;
      }
    }

    function change(query) {
      gameCtrl.lastQuery = query;
      lastField = 'name';
      gameCtrl.ascendant = true;
      gameCtrl.infinityList = 1;
      gameService.list(gameCtrl.lastQuery, gameCtrl.ascendant, lastField, gameCtrl.infinityList).then(success);
    }

    function newGame() {
      $state.go('home.game.create');
    }

    function success(data) {
      gameCtrl.list = data.results;
      listCount = data.count;
    }

    function viewAllGame() {
      $state.go('home.game.list', {}, {reload: true});
    }

  }
})();
