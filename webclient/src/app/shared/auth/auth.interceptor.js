(function () {
  'use strict';

  angular.module('gmm')
    .factory('authInterceptor', authInterceptor);

  /* @ngInject */
  function authInterceptor($q, $injector, authService, urlUtil) {

    return {
      request: requestInterception,
      response: responseInterception,
      responseError: responseErrorIntertception
    };

    function requestInterception(config) {
      activateProgressLinear(true);
      // improve this solution to only add auth token on API requests
      if (config.url.indexOf('gmm') > -1 && authService.isAuthed()) {
        config.headers['Authorization'] = 'JWT ' + authService.getToken();
        return config;
      }
      return config;
    }

    function responseErrorIntertception(rejection) {
      activateProgressLinear(false);
      if (rejection.status === 403 || rejection.status === 401) {
        authService.logout();
      }
      return $q.reject(rejection);
    }

    function responseInterception(response) {
      activateProgressLinear(false);
      //Refresh token only on API requests, except on login and refresh requests
      if (response.config.url.indexOf(urlUtil.API) > -1
        && response.config.url != urlUtil.REFRESH_TOKEN
        && response.config.url != urlUtil.LOGIN) {
        authService.refreshToken();
      }
      return response;
    }

    function activateProgressLinear(active) {
      var target = angular.element(document.getElementById('progressLinear'));
      if (target.context !== undefined) {
        target.context.hidden = !active;
      }
    }

  }

})();
