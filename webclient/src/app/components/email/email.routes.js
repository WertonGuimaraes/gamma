(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider
      .state('home.email', {
        url: '/email',
        data: {
          title: 'Send Email'
        },
        params: {
          emailsTo: [],
          urlFallback: ''
        },
        views: {
          '': {
            templateUrl: 'app/components/email/email.html',
            controller: 'EmailController',
            controllerAs: 'emailCtrl'
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }

})();
