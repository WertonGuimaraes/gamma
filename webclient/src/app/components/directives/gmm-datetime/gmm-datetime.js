(function () {
  'use strict';

  angular.module('gmm.datetime', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']).
  directive('gmmDatetime', gmmDatetime);

  function gmmDatetime() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/directives/gmm-datetime/gmm-datetime.html',
      transclude: 'element',
      replace: true,
      scope: {
        datetimeName: '=',
        datetimeOptional: '=?',
        dateTimeModel: '=ngModel',
        dateTimeMin: '=minDate',
        ngDisabled: '=',
        ngOnChange: '=?'
      },
      controller: GmmDatetimeController
    };

    function GmmDatetimeController($scope) {
      $scope.isOpen = false;
      $scope.openCalendar = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $scope.isOpen = true;
      };
    }

  }
})();


