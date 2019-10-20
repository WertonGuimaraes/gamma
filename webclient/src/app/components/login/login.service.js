(function () {
  'use strict';

  angular.module('gmm')
    .service('loginService', loginService);

  /* @ngInject */
  function loginService($resource, urlUtil) {

    return {
      login: login
    };

    function login(username, password, onSuccess, onFail) {
      var loginData = {
        username: username,
        password: password
      };
      $resource(urlUtil.LOGIN).save(loginData, onSuccess, onFail);
    }

  }

})();
