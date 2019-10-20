(function () {
  'use strict';

  angular.module('gmm')
    .run(run);

  /* @ngInject */
  function run($rootScope, $state, authService, $http, urlUtil, dialogService) {
    $rootScope.$on('$stateChangeStart', changeState);
    $rootScope.$on('logout', logout);
    $rootScope.$on('refresh-token', refreshToken);

    function changeState(event, toState) {
      var requireLogin = toState.data.requireLogin;
      $state.nextState = toState;
      var isAuthed = authService.isAuthed();
      if (requireLogin && !isAuthed) {
        event.preventDefault();
        logout();
      }
    }

    function logout() {
      dialogService.showLoginDialog();
    }

    function refreshToken() {
      var data = {
        token: authService.getToken()
      };
      $http.post(urlUtil.REFRESH_TOKEN, data).then(
        function onSuccess(response) {
          authService.saveToken(response.data['token']);
        });
    }
  }

})();
