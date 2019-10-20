(function () {
  'use strict';

  angular.module('gmm').config(mdMaxLengthConfig);

  /* @ngInject */
  function mdMaxLengthConfig($provide) {
    $provide.decorator('mdMaxlengthDirective', decorator);
  }

  /* @ngInject */
  function decorator($delegate, $animate) {
    var mdMaxlength = $delegate[0];
    var link = mdMaxlength.link;
    mdMaxlength.compile = function () {
      return function (scope, element, attr, ctrls) {
        var maxlength;
        var ngModelCtrl = ctrls[0];
        var containerCtrl = ctrls[1];
        var charCountEl = angular.element('<div class="md-char-counter">');

        attr.$set('ngTrim', 'false');
        containerCtrl.element.append(charCountEl);

        ngModelCtrl.$formatters.push(renderCharCount);
        ngModelCtrl.$viewChangeListeners.push(renderCharCount);
        element.on(
          'input keydown',
          function () {
            renderCharCount();
          }
        );

        scope.$watch(attr.mdMaxlength, function (value) {
          maxlength = value;
          if (angular.isNumber(value) && value > 0) {
            if (!charCountEl.parent().length) {
              $animate.enter(
                charCountEl,
                containerCtrl.element,
                angular.element(containerCtrl.element[0].lastElementChild)
              );
            }
            renderCharCount();
          } else {
            $animate.leave(charCountEl);
          }
        });

        var auxModelValue = '';

        ngModelCtrl.$validators['md-maxlength'] = function (modelValue, viewValue) {
          auxModelValue = modelValue;
          if (!angular.isNumber(maxlength) || maxlength < 0) {
            return true;
          }
          return (modelValue || element.val() || viewValue || '').length <= maxlength;
        };

        function renderCharCount(value) {
          auxModelValue = '' + auxModelValue;
          var minlength = (auxModelValue || '').length;
          charCountEl.text((minlength ? minlength : 0) + '/' + maxlength);
          return value;
        }
      };
    };
    return $delegate;
  }
})();
