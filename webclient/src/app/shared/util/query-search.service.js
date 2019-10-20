(function () {
  'use strict';

  angular.module('gmm')
    .factory('querySearchService', querySearchService);

  /* @ngInject */
  function querySearchService(regionService, gameService, campaignService, bannerService) {

    var service = {
      getIds: getIds,
      getRegionsId: getRegionsId,
      querySearchBanner: querySearchBanner,
      querySearchRegion: querySearchRegion,
      querySearchGame: querySearchGame,
      querySearchCampaign: querySearchCampaign,
      remove: remove
    };

    return service;

    function querySearchRegion(query) {
      return regionService.list(query, true, 'name', 1, true).then(success);
    }

    function querySearchGame(query) {
      return gameService.list(query, true, 'name', 1).then(success);
    }

    function querySearchCampaign(query) {
      return campaignService.list('', '', '', query, false, 'name', 1).then(success);
    }

    function querySearchBanner(query) {
      return bannerService.list('', '', '', '', query, false, 'name', 1).then(success);
    }

    function success(data) {
      return data.results;
    }

    function remove(list, item) {
      for (var i = list.length; i--;) {
        if (list[i].id === item.id) {
          return i;
        }
      }
    }

    function getIds(array) {
      return array.map(function (object) {
        return object.id;
      });
    }

    function getRegionsId(regions) {
      /*jshint -W106*/
      return regions.map(function (region) {
        return region.countries.map(function (country) {
          return country.country_code;
        });
      });
    }

  }
})();

