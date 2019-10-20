(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        data: {
          requireLogin: true,
          title: 'HOME_ID'
        },
        views: {
          '': {
            templateUrl: 'app/components/home/home.html'
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }

})();
