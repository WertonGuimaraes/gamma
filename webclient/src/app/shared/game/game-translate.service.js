(function () {
  'use strict';

  angular
    .module('gmm')
    .service('gameTranslateService', gameTranslateService);

  function gameTranslateService($translate) {

    return {
      translation: translation
    };

    function translation() {
      return $translate([
        'CONFIRM_SAVE_GAME_ID',
        'SAVE_ID',
        'SAVING_ID',
        'CONFIRM_CANCEL_ID',
        'UPLOAD_ID',
        'ERROR_UPLOAD_IMAGE_ID',
        'GAME_DIALOG_ID',
        'CLOSE_ID',
        'SUCCESS_SAVE_ID',
        'FEATURE_MUST_CONTAIN_ATTRIBUTE_ID',
        'ATTRIBUTE_CANNOT_HAVE_SAME_NAME_ID',
        'NEW_ACTION_ID',
        'NEW_ATTRIBUTE_ID',
        'NEW_FEATURE_ID',
        'NEW_VALUE_ID'
      ]).then(resolve);

      function resolve(translations) {
        var translate = {};
        translate['CONFIRM_SAVE_GAME_ID'] = translations.CONFIRM_SAVE_GAME_ID;
        translate['SAVE_ID'] = translations.SAVE_ID;
        translate['SAVING_ID'] = translations.SAVING_ID;
        translate['CONFIRM_CANCEL_ID'] = translations.CONFIRM_CANCEL_ID;
        translate['UPLOAD_ID'] = translations.UPLOAD_ID;
        translate['ERROR_UPLOAD_IMAGE_ID'] = translations.ERROR_UPLOAD_IMAGE_ID;
        translate['GAME_DIALOG_ID'] = translations.GAME_DIALOG_ID;
        translate['CLOSE_ID'] = translations.CLOSE_ID;
        translate['SUCCESS_SAVE_ID'] = translations.SUCCESS_SAVE_ID;
        translate['FEATURE_MUST_CONTAIN_ATTRIBUTE_ID'] = translations.FEATURE_MUST_CONTAIN_ATTRIBUTE_ID;
        translate['ATTRIBUTE_CANNOT_HAVE_SAME_NAME_ID'] = translations.ATTRIBUTE_CANNOT_HAVE_SAME_NAME_ID;
        translate['NEW_ACTION_ID'] = translations.NEW_ACTION_ID;
        translate['NEW_ATTRIBUTE_ID'] = translations.NEW_ATTRIBUTE_ID;
        translate['NEW_FEATURE_ID'] = translations.NEW_FEATURE_ID;
        translate['NEW_VALUE_ID'] = translations.NEW_VALUE_ID;
        return translate;
      }
    }
  }

})();

