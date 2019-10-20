(function () {
  'use strict';

  angular.module('gmm').directive('fallbackSrc', fallbackSrc);

  function fallbackSrc() {
    var fallbackSrcErro = {
      link: postLink,
      scope: {
        imageFound: '=',
      }
    };

    return fallbackSrcErro;

    function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function () {
        angular.element(this).attr('src', iAttrs.fallbackSrc);
        scope.imageFound();
      });
    }
  }

})();
