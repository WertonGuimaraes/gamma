(function () {
  'use strict';

  angular.module('gmm')
    .service('groupService', groupService);

  function groupService(resourceFactory) {

    var service = {
      create: create,
      get: get,
      list: list,
      update: update
    };

    return service;

    function create(group, success, error) {
      resourceFactory.groupResource.save(group, success, error);
    }

    function get(groupId) {
      var params = {'id': groupId};
      return resourceFactory.groupResource.get(params).$promise.finally(success);
    }

    function list(searchText, asc, field, page) {

      /*jshint -W106*/
      if (!asc) {
        field = '-' + field;
      }

      var params = {'query': searchText, 'ordering': field, 'page': page};

      return resourceFactory.groupResource.list(params).$promise;
    }

    function update(group, success, error) {
      var params = {'id': group.id};
      var auxGroup = {
        id: group.id,
        name: group.name,
        permissions: group.permissions
      };
      resourceFactory.groupResource.update(params, auxGroup, success, error);

    }

    function success(results) {
      return results;
    }

  }
})();
