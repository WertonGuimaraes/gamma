(function () {
  'use strict';

  angular.module('gmm').directive('forceLowerCase', forceLowerCase);

  function forceLowerCase($parse) {
    return {
      require: 'ngModel',
      link: postLink
    };

    function postLink(scope, element, attrs, modelCtrl) {
      var lowerize = function (inputValue) {
        if (!inputValue) {
          return inputValue;
        }
        inputValue = ''+ inputValue;
        var lowerized = inputValue.toLowerCase();
        if (lowerized !== inputValue) {
          modelCtrl.$setViewValue(lowerized);
          modelCtrl.$render();
        }
        return lowerized;
      };

      var model = $parse(attrs.ngModel);
      modelCtrl.$parsers.push(lowerize);
      lowerize(model(scope));
    }
  }

})();
