(function () {
  'use strict';

  angular.module('gmm').config(httpInterceptorConfig);

  /* @ngInject */
  function httpInterceptorConfig($httpProvider, $resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $httpProvider.interceptors.push('authInterceptor');
  }

})();
