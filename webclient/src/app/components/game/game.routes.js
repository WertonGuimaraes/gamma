(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  /* @ngInject */
  function configRoutes($stateProvider) {

    $stateProvider
      .state('home.game', {
        url: '/game',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.game.list', {
        url: '/',
        data: {
          title: 'GAME_ID'
        },
        views: {
          '': {
            templateUrl: 'app/components/game/game.list.html',
            controller: 'GameControllerList',
            controllerAs: 'gameCtrl',
            resolve: {
              gamePrepService: gamePrepService
            },
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        }

      })

      .state('home.game.edit', {
        url: '/edit/{gameId:[0-9]*}',
        data: {
          title: 'EDIT_GAME_ID',
          save: editSave
        },
        views: {
          '': {
            templateUrl: 'app/components/game/game.html',
            controller: 'GameController',
            controllerAs: 'gameCtrl',
            resolve: {
              gamePrepService: gamePrepServiceEdit,
              gamePrepServiceTranslate: serviceTranslate
            },
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      })

      .state('home.game.create', {
        url: '/create',
        data: {
          title: 'CREATE_GAME_ID',
          save: createSave
        },
        views: {
          '': {
            templateUrl: 'app/components/game/game.html',
            controller: 'GameController',
            controllerAs: 'gameCtrl',
            resolve: {
              gamePrepService: gamePrepServiceCreate,
              gamePrepServiceTranslate: serviceTranslate
            },

          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }

  function editSave(gameService, game, success, error) {
    gameService.update(game, success, error);
  }

  function createSave(gameService, game, success, error) {
    gameService.create(game, success, error);
  }

  /* @ngInject */
  function gamePrepService(gameService) {
    return gameService.list('', true, 'name', 1);
  }

  /* @ngInject */
  function gamePrepServiceEdit($stateParams, gameService) {
    return gameService.get($stateParams.gameId);
  }

  /* @ngInject */
  function gamePrepServiceCreate(gamePrepServiceTranslate) {
    /*jshint -W106*/
    return {
      form_template: {
        selected: null,
        templates: [
          {
            id: gamePrepServiceTranslate.NEW_FEATURE_ID,
            templateName: {count: 1, apply: false},
            type: 'container',
            columns: [[]],
            name: 'FEATURE_ID',
            tooltip: 'FEATURE_TOOLTIP_ID',
            desc: ''
          },
          {
            id: gamePrepServiceTranslate.NEW_ATTRIBUTE_ID,
            templateName: {count: 1, apply: false},
            name: 'ATTRIBUTE_ID',
            type: 'item',
            tooltip: 'ATTRIBUTE_TOOLTIP_ID'
          },
        ],
        dropzones: {
          'root': []
        }
      }
    };
  }

  /* @ngInject */
  function serviceTranslate(gameTranslateService) {
    return gameTranslateService.translation();
  }

})();
