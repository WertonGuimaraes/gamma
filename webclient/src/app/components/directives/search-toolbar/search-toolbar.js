(function () {
  'use strict';

  angular
    .module('gmm')
    .directive('searchToolbar', searchToolbar);

  function searchToolbar() {
    return {
      restrict: 'E',
      require: ['ngModel', 'ngClickViewAll', 'ngClickNew'],
      templateUrl: 'app/components/directives/search-toolbar/search-toolbar.html',
      controller:SearchToolbarController,
      scope: {
        homeCtrl: '=',
        searchBar: '=?',
      },
    };

    /* @ngInject */
    function SearchToolbarController($scope) {
      /*jshint -W116*/
      if($scope.searchBar == undefined){
        $scope.searchBar = false;
      }
    }
  }

})();
