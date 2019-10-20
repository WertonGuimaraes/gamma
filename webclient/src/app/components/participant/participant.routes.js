(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider
      .state('home.campaign.participants', {
        url: '/{campaignId:[0-9]*}/participants/',
        data: {
          title: 'PARTICIPANTS_ID'
        },
        views: {
          '': {
            templateUrl: 'app/components/participant/participant.list.html',
            controller: 'ParticipantsController',
            controllerAs: 'participantsCtrl',
            resolve: {
              participantPrepService: participantCampaignPrepService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        }
      });
  }

  /* @ngInject */
  function participantCampaignPrepService($stateParams, participantService) {
    return participantService.list('', '', $stateParams.campaignId, true, 'game__name', 1, '');
  }

})();
