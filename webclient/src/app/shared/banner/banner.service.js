(function () {
  'use strict';

  angular.module('gmm')
    .service('bannerService', bannerService);

  /* @ngInject */
  function bannerService(resourceFactory) {


    var service = {
      activatedBanner: activatedBanner,
      create: create,
      list: list,
      update: update,
      get: get
    };

    return service;

    function activatedBanner(banner, active) {
      var params = {'id': banner.id};
      var actived = {'active': active};
      return resourceFactory.bannerResource.patch(params, actived).$promise;
    }

    function create(banner, success, error) {
      resourceFactory.bannerResource.save(banner, success, error);
    }

    function list(banners, games, regions, campaigns, searchText, asc, field, page, status) {

      if (!asc) {
        field = '-' + field;
      }

      var params = {'query': searchText, 'ordering': field, 'page': page};

      if (banners !== '') {
        params.banners = banners;
      }

      if (regions !== '') {
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

      return resourceFactory.bannerResource.list(params).$promise;
    }

    function get(bannerId) {
      var params = {'id': bannerId};
      return resourceFactory.bannerResource.get(params).$promise.finally(success);
    }

    function success(results) {
      return results;
    }

    function update(banner, success, error) {

      var bannerUp = bannerUpdated();
      var params = {'id': banner.id};

      resourceFactory.bannerResource.update(params, bannerUp, success, error);

      function bannerUpdated() {
        return {
          'banner_configuration_name': banner.banner_configuration_name,
          'banners': banner.banners,
          'regions': banner.regions,
          'campaigns': banner.campaigns,
          'games': banner.games,
          'language': banner.language,
          'gmt_timezone': banner.gmt_timezone,
          'begin_date': banner.begin_date,
          'end_date': banner.end_date,
          'is_using_campaign_date': banner.is_using_campaign_date
        };
      }
    }
  }
})();
