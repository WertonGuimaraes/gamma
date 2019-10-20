(function () {
  'use strict';

  angular.module('gmm').directive('input', inputUrl);

  function inputUrl() {

    return {
      require: ['?ngModel'],
      link: link
    };

    function link(scope, element, attrs, ngModel) {

      if (ngModel && attrs.type === 'url') {
        allowSchemelessUrls();
      }

      function allowSchemelessUrls() {
        var URL_DJANGO_REGEXP = /^((?:http|ftp)s?:\/\/)(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[\/?]\S+)$/i;

        ngModel[0].$parsers.unshift(function (value) {
          if (!URL_DJANGO_REGEXP.test(value) && URL_DJANGO_REGEXP.test('http://' + value)) {
            return 'http://' + value;
          } else {
            return value;
          }
        });

        ngModel[0].$validators.url = function (value) {
          return ngModel[0].$isEmpty(value) || URL_DJANGO_REGEXP.test(value);
        };
      }
    }
  }
})();
