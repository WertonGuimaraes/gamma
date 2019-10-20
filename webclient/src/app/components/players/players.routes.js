(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider

      .state('home.players', {
        url: '/players',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.players.list', {
        url: '/',
        data :{
          title: 'PLAYERS_ID'
        },
        views: {
          '': {
            templateUrl: 'app/components/players/players.list.html',
            controller: 'PlayersController',
            controllerAs: 'playersCtrl',
            resolve: {
              playersPrepService: playersPrepService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        }
      });
  }

  /* @ngInject */
  function playersPrepService(playerService) {
    return playerService.list('', '', true, 'game__name', 1, '');
  }

})();
