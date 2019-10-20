(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider
      .state('home.push', {
        url: '/push',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.push.list', {
        url: '/',
        data: {
          title: 'PUSH_ID'
        },
        views: {
          '': {
            templateUrl: 'app/components/push/push.list.html',
            controller: 'PushControllerList',
            controllerAs: 'pushCtrl',
            resolve: {
              pushPrepService: pushPrepService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        }
      })

      .state('home.push.create', {
        url: '/create',
        data: {
          title: 'PUSH_CREATE_ID'
        },
        params: {
          urlFallback: '',

          gamesIds: [],
          games: [],

          regionsIds: [],
          regions: [],

          campaignsIds: [],
          campaigns: [],

          beginDateTime: undefined,
          endDateTime: undefined
        },
        views: {
          '': {
            templateUrl: 'app/components/push/push.html',
            controller: 'PushController',
            controllerAs: 'pushCtrl',
            resolve: {
              campaignsPrepService: campaignsPrepService,
              pushPrepTranslateService: pushPrepTranslateService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }

  /* @ngInject */
  function pushPrepService(pushService) {
    return pushService.list('', true, 'data', 1);
  }

  /* @ngInject */
  function campaignsPrepService($stateParams, campaignService) {
    return $stateParams.campaignsIds.length > 0 ? campaignService.list('', '', $stateParams.campaignsIds.toString(), '',
      false, '', 1, '') : [];
  }


  /* @ngInject */
  function pushPrepTranslateService(pushTranslateService) {
    return pushTranslateService.translation();
  }


})();
