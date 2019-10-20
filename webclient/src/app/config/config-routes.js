(function () {
  'use strict';

  angular
    .module('gmm')
    .config(config);

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginController',
        data: {
          requireLogin: false
        },
        onEnter: verifyAuthed

      });
  }

  /* @ngInject */
  function verifyAuthed($state, authService) {
    if (authService.isAuthed()) {
      $state.go('home');
    }
  }

})();
