(function () {
  'use strict';

  angular
    .module('gmm')
    .service('userTranslateService', userTranslateService);

  function userTranslateService($translate) {

    return {
      translation: translation
    };

    function translation() {
      return $translate([
        'CONFIRM_CANCEL_ID',
        'SAVE_ID',
        'CONFIRM_SAVE_USER_ID',
        'SAVING_ID',
        'SUCCESS_SAVE_ID',
        'USER_FIRST_NAME_ID',
        'USER_LAST_NAME_ID',
        'USER_USERNAME_ID',
        'EMAIL_ID',
        'GROUP_ID',
        'ENABLED_ID',
        'DISABLED_ID',
        'CONFIRM_ACTIVATE_USER_ID',
        'SUCCESS_USER_CHANGE_ENABLED_STATUS_ID'
      ]).then(resolve);

      function resolve(translations) {
        var translate = {};
        translate['CONFIRM_CANCEL_ID'] = translations.CONFIRM_CANCEL_ID;
        translate['SAVE_ID'] = translations.SAVE_ID;
        translate['CONFIRM_SAVE_USER_ID'] = translations.CONFIRM_SAVE_USER_ID;
        translate['SAVING_ID'] = translations.SAVING_ID;
        translate['SUCCESS_SAVE_ID'] = translations.SUCCESS_SAVE_ID;

        translate['USER_FIRST_NAME_ID'] = translations.USER_FIRST_NAME_ID;
        translate['USER_LAST_NAME_ID'] = translations.USER_LAST_NAME_ID;
        translate['USER_USERNAME_ID'] = translations.USER_USERNAME_ID;
        translate['EMAIL_ID'] = translations.EMAIL_ID;
        translate['GROUP_ID'] = translations.GROUP_ID;

        translate['ENABLED_ID'] = translations.ENABLED_ID;
        translate['DISABLED_ID'] = translations.DISABLED_ID;
        translate['CONFIRM_ACTIVATE_USER_ID'] = translations.CONFIRM_ACTIVATE_USER_ID;
        translate['SUCCESS_USER_CHANGE_ENABLED_STATUS_ID'] = translations.SUCCESS_USER_CHANGE_ENABLED_STATUS_ID;
        return translate;
      }
    }
  }

})();

