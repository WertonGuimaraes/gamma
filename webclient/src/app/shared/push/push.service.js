(function () {
  'use strict';

  angular.module('gmm')
    .service('pushService', pushService);

  /* @ngInject */
  function pushService(resourceFactory) {

    var service = {
      list: list,
      push: push,
      pushDetails: pushDetails
    };

    return service;

    function list(searchText, asc, field, page, includeCountries) {

      if (!asc) {
        field = '-' + field;
      }

      var params = {'query': searchText, 'ordering': field, 'page': page};

      return resourceFactory.pushResource.get(params).$promise;
    }

    function push(query, success, error) {
      return resourceFactory.pushesResource.save(query, success, error).$promise;
    }

    function pushDetails(id, page) {
      var params = {'id': id};
      return resourceFactory.pushResourceDetails.get(params).$promise;
    }

  }
})();
