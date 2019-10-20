(function () {
  'use strict';

  angular.module('gmm')
    .service('languageService', languageService);

  /* @ngInject */
  function languageService() {
    /*jshint -W106*/

    var service = {
      getLanguages: getLanguages,
      getLanguageName: getLanguageName
    };

    return service;

    function getLanguages() {
      return [
        {key: 'English', value: 'EN'},
        {key: 'Portuguese', value: 'PT'},
        {key: 'Spanish', value: 'ES'},
        {key: 'All languages', value: 'ALL'}
      ];
    }

    function getLanguageName(languageCode) {
      var languages = getLanguages();
      for (var i in languages) {
        if (languageCode === languages[i].value) {
          return languages[i].key;
        }
      }
      return 'English';
    }
  }
})();
