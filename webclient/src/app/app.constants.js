(function () {
  'use strict';

  angular
    .module('gmm')
    .constant('urlUtil', urlUtil());

  function urlUtil() {
    var URL = 'http://localhost:8000/gmm/';

    return {
      API: URL,
      BANNER: URL + 'banner/:id/',
      CAMPAIGN: URL + 'campaign/:id/',
      GAME: URL + 'game/:id/',
      GROUP: URL + 'group/:id/',
      IMAGE: URL + 'image/',
      LOGIN: URL + 'login/',
      PLAYER: URL + 'player/',
      PARTICIPANT: URL + 'participant/',
      PUSH: URL + 'push/:id/',
      PUSH_DETAILS: URL + 'push/:id/details',
      PUSHES: URL + 'pushes/:id/',
      REFRESH_TOKEN: URL + 'refresh-token/',
      REGION: URL + 'region/:id/',
      GENERAL: URL + 'settings/:id/',
      USER: URL + 'user/:id/',
      EMAIL: URL + 'email/send/'
    };
  }
})();
