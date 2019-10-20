(function () {
  'use strict';

  angular.module('gmm')
    .service('participantService', participantService);

  /* @ngInject */
  function participantService(resourceFactory, moment) {
    /*jshint -W106*/
    var service = {
      list: list,
      countSearch: countSearch
    };

    var format = 'YYYY-MM-DDTHH:mm:00Z';

    return service;

    function countSearch(regions, games, campaigns, page, beginDate, endDate) {
      var params = {'query': '', 'page': page};

      if (regions !== '') {
        params.location_country_codes = regions;
      }

      if (games !== '') {
        params.games = games;
      }

      if (campaigns !== '') {
        params.campaigns = campaigns;
      }

      if (angular.isDefined(beginDate) ) {
        params.begin_date = formatToTimezone(beginDate);
      }

      if (angular.isDefined(endDate)) {
        params.end_date = formatToTimezone(endDate);
      }

      return resourceFactory.participantResource.list(params).$promise;
    }

    function list(games, regions, campaigns, asc, field, page, query, beginDate, endDate) {

      if (!asc) {
        field = '-' + field;
      }

      var params = {'ordering': field, 'page': page, 'query': query};

      if (regions !== '') {
        params.location_country_codes = regions;
      }

      if (games !== '') {
        params.games = games;
      }

      if (campaigns !== '') {
        params.campaigns = campaigns;
      }

      if (angular.isDefined(beginDate) ) {
        params.begin_date = formatToTimezone(beginDate);
      }

      if (angular.isDefined(endDate)) {
        params.end_date = formatToTimezone(endDate);
      }

      return resourceFactory.participantResource.list(params).$promise;
    }

    function formatToTimezone(date) {
      return angular.isDefined(date) ? moment.utc(date).format(format) :  moment.utc().format(format);
    }
  }
})();
