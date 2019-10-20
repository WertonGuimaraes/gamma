(function () {
  'use strict';

  angular.module('gmm.gmmFormGeneretor', ['dndLists']).
  directive('gmmFormGeneretor', gmmFormGeneretor);

  function gmmFormGeneretor() {
    return {
      restrict: 'E',
      scope: {
        models: '=ngModel'
      },
      controller: controllerFormGeneretor,
      templateUrl: 'app/components/directives/gmm-form-generator/gmm-form-generator.html'
    };

    /* @ngInject */
    function controllerFormGeneretor($scope) {
      $scope.itemName = itemName;

      function itemName(item) {
        if (!item.templateName.apply) {
          item.templateName.apply = !item.templateName.apply;
          item.id = item.id + ' ' + item.templateName.count;
        }
      }
    }
  }
})();

