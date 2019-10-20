(function () {
  'use strict';

  angular
    .module('gmm')
    .service('regionTranslateService', regionTranslateService);

  function regionTranslateService($translate) {

    return {
      translation: translation
    };

    function translation() {
      return $translate([
        'CONFIRM_CANCEL_ID',
        'SAVE_ID',
        'CONFIRM_SAVE_REGION_ID',
        'SAVING_ID',
        'SUCCESS_SAVE_ID'
      ]).then(resolve);

      function resolve(translations) {
        var translate = {};
        translate['CONFIRM_CANCEL_ID'] = translations.CONFIRM_CANCEL_ID;
        translate['SAVE_ID'] = translations.SAVE_ID;
        translate['CONFIRM_SAVE_REGION_ID'] = translations.CONFIRM_SAVE_REGION_ID;
        translate['SAVING_ID'] = translations.SAVING_ID;
        translate['SUCCESS_SAVE_ID'] = translations.SUCCESS_SAVE_ID;
        return translate;
      }
    }
  }

})();

