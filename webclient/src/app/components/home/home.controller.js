(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('HomeController', HomeController);

  /* @ngInject */
  function HomeController($state, $mdSidenav, $mdBottomSheet, $q, $window) {

    var homeCtrl = this;
    homeCtrl.currentTittle = currentTitle;
    homeCtrl.toggleList = toggleUsersList;
    homeCtrl.logout = logout;
    homeCtrl.toggleRight = buildToggler('right');
    homeCtrl.user = $window.localStorage['userName'];
    angular.element('body').css({'background-color': '#f2f2f2'});

    function currentTitle() {
      return $state.current.data.title;
    }

    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    function logout() {
      $window.localStorage.removeItem('jwtToken');
      $state.go('login');
    }

    function buildToggler(navID) {
      return function () {
        $mdSidenav(navID).toggle();
      };
    }

  }


})();
