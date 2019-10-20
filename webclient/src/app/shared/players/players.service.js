(function () {
  'use strict';

  angular.module('gmm')
    .service('playerService', playerService);

  /* @ngInject */
  function playerService(resourceFactory, moment) {
    /*jshint -W106*/

    var FORMAT = 'YYYY-MM-DDTHH:mm:00Z';

    var service = {
      countSearch: countSearch,
      list: list
    };

    return service;

    function countSearch(regions, games, page, beginDate, endDate) {
      var params = {'query': '', 'page': page};

      if (regions !== '') {
        params.location_country_codes = regions;
      }

      if (games !== '') {
        params.games = games;
      }

      if (validateDate(beginDate)) {
        params.begin_date = moment(beginDate).format(FORMAT);
      }

      if (validateDate(endDate)) {
        params.end_date = moment(endDate).format(FORMAT);
      }

      return resourceFactory.playerResource.list(params).$promise;
    }

    function list(games, regions, asc, field, page, query, beginDate, endDate) {
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

      if (validateDate(beginDate)) {
        params.begin_date = moment(beginDate).format(FORMAT);
      }

      if (validateDate(endDate)) {
        params.end_date = moment(endDate).format(FORMAT);
      }

      return resourceFactory.playerResource.list(params).$promise;
    }

    function validateDate(date) {
      return angular.isDefined(date) && moment(date).isValid();
    }

  }
})();
