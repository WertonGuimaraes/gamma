(function () {
  'use strict';

  angular
    .module('gmm')
    .service('bannerListTranslateService', bannerListTranslateService);

  /* @ngInject */
  function bannerListTranslateService($translate) {

    return {
      translation: translation
    };

    function translation() {
      return $translate([
        'ENABLE_ID',
        'DISABLE_ID',
        'BEGIN_DATE_ID',
        'END_DATE_ID',
        'CREATED_ID',
        'NAME_ID',
        'STATUS_ID',
        'UPDATE_ID',
        'ALL_ID',
        'STARTED_ID',
        'ABOUT_TO_START_ID',
        'PAUSED_ID',
        'FINISHED_ID',
        'CONFIRM_ACTIVATE_BANNER_ID',
        'SUCCESS_BANNER_CHANGE_ENABLED_STATUS_ID',
        'INFO_ANALYTICS_SIGNED_IN_ID'
      ]).then(resolve);

      function resolve(translations) {
        var translate = {};
        translate['ENABLE_ID'] = translations.ENABLE_ID;
        translate['DISABLE_ID'] = translations.DISABLE_ID;
        translate['BEGIN_DATE_ID'] = translations.BEGIN_DATE_ID;
        translate['END_DATE_ID'] = translations.END_DATE_ID;
        translate['CREATED_ID'] = translations.CREATED_ID;
        translate['NAME_ID'] = translations.NAME_ID;
        translate['STATUS_ID'] = translations.STATUS_ID;
        translate['UPDATE_ID'] = translations.UPDATE_ID;
        translate['ALL_ID'] = translations.ALL_ID;
        translate['STARTED_ID'] = translations.STARTED_ID;
        translate['ABOUT_TO_START_ID'] = translations.ABOUT_TO_START_ID;
        translate['PAUSED_ID'] = translations.PAUSED_ID;
        translate['FINISHED_ID'] = translations.FINISHED_ID;
        translate['CONFIRM_ACTIVATE_BANNER_ID'] = translations.CONFIRM_ACTIVATE_BANNER_ID;
        translate['SUCCESS_BANNER_CHANGE_ENABLED_STATUS_ID'] = translations.SUCCESS_BANNER_CHANGE_ENABLED_STATUS_ID;
        translate['INFO_ANALYTICS_SIGNED_IN_ID'] = translations.INFO_ANALYTICS_SIGNED_IN_ID;
        return translate;
      }
    }
  }
})();
