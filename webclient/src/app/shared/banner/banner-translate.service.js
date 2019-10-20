(function () {
  'use strict';

  angular
    .module('gmm')
    .service('bannerTranslateService', bannerTranslateService);

  /* @ngInject */
  function bannerTranslateService($translate) {

    return {
      translation: translation
    };

    function translation() {
      return $translate([
        'INFO_END_DATE_MAJOR_CAMPAIGN_ID',
        'CAMPAIGN_ID',
        'VALIDATE_CHECKBOX_CAMPAIGN_DATES_ID',
        'OK_ID',
        'REGION_ID',
        'OTHER_REGION_ADDED_ALREADY_ID',
        'SUCCESS_SAVE_ID',
        'CONFIRM_BANNER_SAVE_ID',
        'SAVING_ID',
        'SAVE_ID',
        'UPLOAD_ID',
        'ERROR_UPLOAD_IMAGE_ID',
        'BANNER_DIALOG_ID',
        'CLOSE_ID',
        'CONFIRM_CANCEL_ID'
      ]).then(resolve);

      function resolve(translations) {
        var translate = {};
        translate['INFO_END_DATE_MAJOR_CAMPAIGN_ID'] = translations.INFO_END_DATE_MAJOR_CAMPAIGN_ID;
        translate['CAMPAIGN_ID'] = translations.CAMPAIGN_ID;
        translate['VALIDATE_CHECKBOX_CAMPAIGN_DATES_ID'] = translations.VALIDATE_CHECKBOX_CAMPAIGN_DATES_ID;
        translate['OK_ID'] = translations.OK_ID;
        translate['REGION_ID'] = translations.REGION_ID;
        translate['OTHER_REGION_ADDED_ALREADY_ID'] = translations.OTHER_REGION_ADDED_ALREADY_ID;
        translate['SUCCESS_SAVE_ID'] = translations.SUCCESS_SAVE_ID;
        translate['CONFIRM_BANNER_SAVE_ID'] = translations.CONFIRM_BANNER_SAVE_ID;
        translate['SAVING_ID'] = translations.SAVING_ID;
        translate['SAVE_ID'] = translations.SAVE_ID;
        translate['UPLOAD_ID'] = translations.UPLOAD_ID;
        translate['ERROR_UPLOAD_IMAGE_ID'] = translations.ERROR_UPLOAD_IMAGE_ID;
        translate['BANNER_DIALOG_ID'] = translations.BANNER_DIALOG_ID;
        translate['CLOSE_ID'] = translations.CLOSE_ID;
        translate['CONFIRM_CANCEL_ID'] = translations.CONFIRM_CANCEL_ID;
        return translate;
      }
    }
  }

})();
