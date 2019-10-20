(function () {
  'use strict';

  angular.module('gmm.date', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']).
  directive('gmmDate', gmmDate);

  function gmmDate() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/directives/gmm-date/gmm-date.html',
      transclude: 'element',
      replace: true,
      scope: {
        dateName: '=',
        dateModel: '=ngModel',
        filter: '&',
        disable: '=?'
      },
      controller: GmmDateController
    };

    function GmmDateController($scope) {
      $scope.isOpen = false;
      $scope.openCalendar = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $scope.isOpen = true;
      };

      $scope.$watch('isOpen', function (newValue, oldValue) {
        if (!newValue && oldValue) {
          $scope.filter();
        }
      });
    }

  }
})();


