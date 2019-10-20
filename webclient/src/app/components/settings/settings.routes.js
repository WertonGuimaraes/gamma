(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider

      .state('home.settings', {
        url: '/settings',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.settings.list', {
        url: '/',
        data: {
          title: 'SYSTEM_SETTINGS_ID'
        },
        views: {
          '': {
            templateUrl: 'app/components/settings/settings.list.html'
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }
})();
