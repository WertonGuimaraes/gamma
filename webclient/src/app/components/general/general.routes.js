(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider
      .state('home.settings.general', {
        url: '/general',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.settings.general.update', {
        url: '/edit',
        data: {
          title: 'GENERAL_SETTINGS_CREATE_ID',
          save: editSave
        },
        views: {
          '': {
            templateUrl: 'app/components/general/general.html',
            controller: 'GeneralController',
            controllerAs: 'generalCtrl',
            resolve: {
              generalPrepService: generalSettingsService,
              generalPrepTranslateService: generalPrepTranslateService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }

  function editSave(generalService, general, success, error) {
    generalService.update(general, success, error);
  }

  /* @ngInject */
  function generalPrepTranslateService(generalTranslateService){
    return generalTranslateService.translation();
  }

  /* @ngInject */
  function generalSettingsService(generalService) {
    return generalService.get();
  }
})();
