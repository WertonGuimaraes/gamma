(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider

      .state('home.settings.region', {
        url: '/region',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.settings.region.list', {
        url: '/',
        data: {
          title: 'REGION_ID'
        },
        views: {
          '': {
            controller: 'RegionControllerList',
            controllerAs: 'regionCtlList',
            templateUrl: 'app/components/region/region.list.html',
            resolve: {
              regionPrepService: regionPrepService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        }
      })

      .state('home.settings.region.edit', {
        url: '/edit/{regionId:[0-9]*}',
        data: {
          title: 'REGION_EDIT_ID',
          save: editSave
        },
        views: {
          '': {
            templateUrl: 'app/components/region/region.html',
            controller: 'RegionController',
            controllerAs: 'regionCtrl',
            resolve: {
              regionPrepService: regionPrepServiceEdit,
              regionPrepTranslateService: regionPrepTranslateService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      })

      .state('home.settings.region.create', {
        url: '/create',
        data: {
          title: 'REGION_CREATE_ID',
          save: createSave
        },
        views: {
          '': {
            templateUrl: 'app/components/region/region.html',
            controller: 'RegionController',
            controllerAs: 'regionCtrl',
            resolve: {
              regionPrepService: regionPrepServiceCreate,
              regionPrepTranslateService: regionPrepTranslateService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }

  function createSave(regionService, region, success, error) {
    regionService.create(region, success, error);
  }

  function editSave(regionService, region, success, error) {
    regionService.update(region, success, error);
  }

  function regionPrepServiceCreate() {
    return {
      color: '#FF6E40',
      countries: []
    };
  }

  /* @ngInject */
  function regionPrepService(regionService) {
    return regionService.list('', true, 'name', 1, false);
  }

  /* @ngInject */
  function regionPrepServiceEdit($stateParams, regionService) {
    return regionService.get($stateParams.regionId);
  }

  /* @ngInject */
  function regionPrepTranslateService(regionTranslateService){
    return regionTranslateService.translation();
  }

})();
