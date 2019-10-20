(function () {
  'use strict';

  angular.module('gmm')
    .service('regionService', regionService);

  /* @ngInject */
  function regionService(resourceFactory) {

    var service = {
      create: create,
      get: get,
      list: list,
      update: update
    };

    return service;

    function create(region, success, error) {
      resourceFactory.regionResource.save(region, success, error);
    }

    function get(regionId) {
      var params = {'id': regionId};
      return resourceFactory.regionResource.get(params).$promise.finally(success);
    }

    function list(searchText, asc, field, page, includeCountries) {

      /*jshint -W106*/
      if (!asc) {
        field = '-' + field;
      }

      var params = {'query': searchText, 'ordering': field, 'page': page, include_countries: includeCountries};

      return resourceFactory.regionResource.list(params).$promise;
    }

    function update(region, success, error) {
      var params = {'id': region.id};
      var auxRegion = {
        id: region.id,
        name: region.name,
        countries: region.countries,
        color: region.color
      };
      resourceFactory.regionResource.update(params, auxRegion, success, error);

    }

    function success(results) {
      return results;
    }

  }
})();
