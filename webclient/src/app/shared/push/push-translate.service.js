(function () {
  'use strict';

  angular
    .module('gmm')
    .service('pushTranslateService', pushTranslateService);

  /* @ngInject */
  function pushTranslateService($translate) {

    return {
      translation: translation
    };

    function translation() {
      return $translate([
        'SAVE_ID',
        'SAVING_ID',
        'INFO_NOT_PUSH_CONFIGURATION_ID',
        'CONFIRM_CANCEL_ID',
        'CONFIRM_SEND_PUSH_ID',
        'SUCCESS_SEND_ID'
      ]).then(resolve);

      function resolve(translations) {
        var translate = {};
        translate['SAVE_ID'] = translations.SAVE_ID;
        translate['SAVING_ID'] = translations.SAVING_ID;
        translate['INFO_NOT_PUSH_CONFIGURATION_ID'] = translations.INFO_NOT_PUSH_CONFIGURATION_ID;
        translate['CONFIRM_CANCEL_ID'] = translations.CONFIRM_CANCEL_ID;
        translate['CONFIRM_SEND_PUSH_ID'] = translations.CONFIRM_SEND_PUSH_ID;
        translate['SUCCESS_SEND_ID'] = translations.SUCCESS_SEND_ID;
        return translate;
      }
    }
  }

})();
