(function () {
  'use strict';

  angular.module('gmm').config(configTranslate);

  /* @ngInject */
  function configTranslate($translateProvider) {

    var configStaticFiles = {prefix: '/app/shared/i18n/', suffix: '.json'};

    $translateProvider
      .registerAvailableLanguageKeys(['en', 'pt'], {'pt-*':'pt', 'es-*':'es', '*': 'en'})
      .preferredLanguage(navigator.language)
      .useStaticFilesLoader(configStaticFiles)
      .useSanitizeValueStrategy('sanitizeParameters');
  }
})();
