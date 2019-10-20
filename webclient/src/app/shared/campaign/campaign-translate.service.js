(function () {
  'use strict';

  angular
    .module('gmm')
    .service('campaignTranslateService', campaignTranslateService);

  /* @ngInject */
  function campaignTranslateService($translate) {

    return {
      translation: translation
    };

    function translation() {
      return $translate([
        'CONFIRM_CANCEL_ID',
        'CONFIRM_SAVE_CAMPAIGN_ID',
        'SAVE_ID',
        'SAVING_ID',
        'SUCCESS_SAVE_ID',
        'ERROR_CREATE_CAMPAIGN_CONFIGURATION_FOR_GAME_ID',
        'CLOSE_ID',
        'CAMPAIGN_DIALOG_ID',
        'INFO_GAME_TEMPLATE_DUPLICATED_ID'
      ]).then(resolve);

      function resolve(translations) {
        var translate = {};
        translate['CONFIRM_CANCEL_ID'] = translations.CONFIRM_CANCEL_ID;
        translate['CONFIRM_SAVE_CAMPAIGN_ID'] = translations.CONFIRM_SAVE_CAMPAIGN_ID;
        translate['SAVE_ID'] = translations.SAVE_ID;
        translate['SAVING_ID'] = translations.SAVING_ID;
        translate['SUCCESS_SAVE_ID'] = translations.SUCCESS_SAVE_ID;
        translate['ERROR_CREATE_CAMPAIGN_CONFIGURATION_FOR_GAME_ID'] =
          translations.ERROR_CREATE_CAMPAIGN_CONFIGURATION_FOR_GAME_ID;
        translate['CLOSE_ID'] = translations.CLOSE_ID;
        translate['CAMPAIGN_DIALOG_ID'] = translations.CAMPAIGN_DIALOG_ID;
        translate['INFO_GAME_TEMPLATE_DUPLICATED_ID'] = translations.INFO_GAME_TEMPLATE_DUPLICATED_ID;
        return translate;
      }
    }
  }

})();

