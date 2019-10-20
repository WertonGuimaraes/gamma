(function () {
  'use strict';

  angular.module('gmm')
    .service('userService', userService);

  function userService(resourceFactory) {

    var service = {
      activatedUser: activatedUser,
      create: create,
      get: get,
      list: list,
      update: update
    };

    return service;

    function activatedUser(user, active) {
      var params = {'id': user.id};
      var actived = {'is_active': active};

      return resourceFactory.userResource.patch(params, actived).$promise;
    }

    function create(user, success, error) {
      resourceFactory.userResource.save(user, success, error);
    }

    function get(userId) {
      var params = {'id': userId};
      return resourceFactory.userResource.get(params).$promise.finally(success);
    }

    function list(name, username, email, group, active, asc, field, searchText, page) {

      if (!asc) {
        field = '-' + field;
      }

      var params = {'is_active': active, 'ordering': field, 'query': searchText, 'page': page};

      if (name !== '') {
        params.name = name;
      }

      if (username !== '') {
        params.username = username;
      }

      if (group !== '') {
        params.groups = group;
      }

      if (email !== '') {
        params.email = email;
      }

      return resourceFactory.userResource.list(params).$promise;
    }

    function update(user, success, error) {
      var params = {'id': user.id};
      var auxUser = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        password: user.password,
        email: user.email,
        is_active: user.is_active,
        user_permissions: user.user_permissions,
        groups: user.groups
      };
      resourceFactory.userResource.update(params, auxUser, success, error);
    }

    function success(results) {
      return results;
    }
  }
})();
