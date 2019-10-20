(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider

      .state('home.banner', {
        url: '/banner',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.banner.list', {
        url: '/',
        data: {
          title: 'BANNERS_ID'
        },
        views: {
          '': {
            templateUrl: 'app/components/banner/banner.list.html',
            controller: 'BannerControllerList',
            controllerAs: 'bannerCtlList',
            resolve: {
              bannerPrepService: bannerPrepService,
              bannerListPrepTranslateService: bannerListPrepTranslateService
            }

          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        },
        onEnter: visibleButtonAuthAnalytics,
        onExit: invisibleButtonAuthAnalytics
      })

      .state('home.banner.edit', {
        url: '/edit/{bannerId:[1-9][0-9]*}',
        data: {
          title: 'BANNER_EDIT_ID',
          save: editSave
        },
        views: {
          '': {
            templateUrl: 'app/components/banner/banner.html',
            controller: 'BannerController',
            controllerAs: 'bannerCtrl',
            resolve: {
              bannerPrepService: bannerPrepServiceEdit,
              bannerPrepTranslateService: bannerPrepTranslateService
            },
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      })

      .state('home.banner.create', {
        url: '/create',
        data: {
          title: 'BANNER_CREATE_ID',
          save: createSave
        },
        views: {
          '': {
            templateUrl: 'app/components/banner/banner.html',
            controller: 'BannerController',
            controllerAs: 'bannerCtrl',
            resolve: {
              bannerPrepService: bannerPrepServiceCreate,
              bannerPrepTranslateService: bannerPrepTranslateService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }

  function visibleButtonAuthAnalytics(){
    buttonAuthAnalytics(false);
  }

  function invisibleButtonAuthAnalytics(){
    buttonAuthAnalytics(true);
  }

  function buttonAuthAnalytics(visible) {
    var target = angular.element(document.getElementById('embed-api-auth-container'));
    if (target.context !== undefined) {
      target.context.hidden = visible;
    }
  }

  function createSave(bannerService, banner, success, error) {
    bannerService.create(banner, success, error);
  }

  function editSave(bannerService, banner, success, error) {
    bannerService.update(banner, success, error);
  }

  function bannerPrepServiceCreate() {
    /*jshint -W106*/
    return {
      regions: [],
      banners: [],
      games: [],
      campaigns: [],
      begin_date: null,
      end_date: null,
      is_using_campaign_date: false,
      gmt_timezone: null
    };
  }

  /* @ngInject */
  function bannerPrepService(bannerService) {
    return bannerService.list('', '', '', '', '', false, 'status', 1);
  }

  /* @ngInject */
  function bannerPrepServiceEdit($stateParams, bannerService) {
    return bannerService.get($stateParams.bannerId);
  }

  /* @ngInject */
  function bannerPrepTranslateService(bannerTranslateService) {
    return bannerTranslateService.translation();
  }

  /* @ngInject */
  function bannerListPrepTranslateService(bannerListTranslateService) {
    return bannerListTranslateService.translation();
  }

})();
