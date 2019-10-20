(function () {
  'use strict';

  angular.module('gmm').
  directive('gmmMultiPush', gmmFormGeneretor);

  function gmmFormGeneretor() {
    return {
      restrict: 'E',
      scope: {
        game: '=',
        disabledAdd: '=?',
        onAdd: '=?',
        onRemove: '=?'
      },
      templateUrl: 'app/components/directives/gmm-multi-push/gmm-multi-push.html'
    };
  }
})();

