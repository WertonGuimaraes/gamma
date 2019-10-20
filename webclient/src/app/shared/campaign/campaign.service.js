(function () {
  'use strict';

  angular.module('gmm')
    .service('campaignService', campaignService);

  /* @ngInject */
  function campaignService(resourceFactory) {

    var service = {
      activatedCampaign: activatedCampaign,
      create: create,
      get: get,
      list: list,
      update: update,
      getParticipants: getParticipants
    };

    return service;

    function activatedCampaign(campaign, active){
      var params = {'id': campaign.id};
      var actived = {'active': active};
      return resourceFactory.campaignResource.patch(params, actived).$promise;
    }

    function create(campaign, success, error) {
      resourceFactory.campaignResource.save(campaign, success, error);
    }

    function get(campaignId) {
      var params;

      if(angular.isArray(campaignId)) {
        params = {'campaigns': campaignId.toString()};
      } else {
        params = {'id': campaignId};
      }
      return resourceFactory.campaignResource.get(params).$promise.finally(success);
    }

    function list(games, regions, campaigns, searchText, asc, field, page, status) {

      if (asc) {
        field = '-'+ field;
      }

      var params = {'query': searchText, 'ordering': field, 'page': page};

      if (regions !== '') {
        /*jshint -W106*/
        params.regions = regions;
      }

      if (games !== '') {
        params.games = games;
      }

      if (campaigns !== '') {
        params.campaigns = campaigns;
      }

      if (status !== '' && status !== 'all') {
        params.status = status;
      }

      return resourceFactory.campaignResource.list(params).$promise;
    }

    function success(results) {
      return results;
    }

    function update(campaign, success, error) {

      var campaignUp = campaignUpdated();
      var params = {'id': campaign.id};

      resourceFactory.campaignResource.update(params, campaignUp, success, error);

      /*jshint -W106*/
      function campaignUpdated() {
        return {
          'active': campaign.active,
          'name': campaign.name,
          'begin_date': campaign.begin_date,
          'end_date': campaign.end_date,
          'regions': campaign.regions,
          'games': campaign.games,
          'gmt_timezone': campaign.gmt_timezone,
          'participant_limit': campaign.participant_limit,
          'forms': campaign.forms
        };
      }
    }

    function getParticipants(campaigns) {
      var params = {};

      if (campaigns.length > 0) {
        params.campaigns = campaigns.toString();
      }

      return resourceFactory.campaignResource.get(params, true).$promise;
    }
  }

})();
