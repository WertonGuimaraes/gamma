(function () {
  'use strict';

  angular.module('gmm')
    .service('authService', authService);

  /* @ngInject */
  function authService($window, $rootScope) {

    return {
      saveToken: saveToken,
      getToken: getToken,
      refreshToken: refreshToken,
      isAuthed: isAuthed,
      logout: logout
    };


    function saveToken(token) {
      $window.localStorage['jwtToken'] = token;
      $window.localStorage['jwtToken-exp'] = parseJwt(token)['exp'];
    }

    function getToken() {
      return $window.localStorage['jwtToken'];
    }

    function refreshToken() {
      if (getToken()) {
        $rootScope.$broadcast('refresh-token');
      }
    }

    function isAuthed() {
      if ($window.localStorage['jwtToken']) {
        return true;
      }
      return false;
    }

    function logout() {
      $window.localStorage.removeItem('jwtToken');
      $rootScope.$broadcast('logout');
    }

    function parseJwt(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    }
  }

})();
