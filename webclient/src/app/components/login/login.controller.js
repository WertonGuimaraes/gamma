(function () {
  'use strict';

  angular.module('gmm')
    .controller('LoginController', LoginController);

  /* @ngInject */
  function LoginController($state, loginService, authService, $mdDialog, $window, $timeout, $document) {

    var loginCtrl = this;
    loginCtrl.login = login;
    loginCtrl.account = account();

    setBackgroundColor();
    checkPasswordInput();

    function account() {
      return {
        login: '',
        password: ''
      };
    }

    function setBackgroundColor() {
      if (isStateLogin()) {
        angular.element('body').css({'background-color': 'white'});
      }
    }

    function checkPasswordInput() {
      $timeout(function () {
        var elem = angular.element($document[0].querySelector('input[type=password]:-webkit-autofill'));

        if (elem.length) {
          elem.parent().addClass('md-input-has-value');
        }
      }, 150);
    }

    function login() {
      loginService.login(loginCtrl.account.login, loginCtrl.account.password, onSuccess, onFail);
    }

    function onSuccess(response) {
      $window.localStorage['userName'] = loginCtrl.account.login;
      authService.saveToken(response.token);
      $mdDialog.cancel();
      if(isStateLogin()){
        $state.go('home');
      } else {
        $state.go($state.nextState !== undefined && $state.nextState.name.length ? $state.nextState.name : 'home');
      }
    }

    function onFail() {
      if (isStateLogin()) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#loginContainer')))
            .clickOutsideToClose(true)
            .title('Login failed')
            .textContent('Unable to login with provided credentials.')
            .ariaLabel('Login Status Dialog')
            .ok('Retry')
        );
      } else {
        loginCtrl.invalidLogin = true;
      }
    }

    function isStateLogin() {
      return $state.is('login');
    }

  }

})();
