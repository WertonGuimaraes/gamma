(function () {
  'use strict';

  angular.module('gmm')
    .service('gameService', gameService);

  /* @ngInject */
  function gameService(resourceFactory) {

    var emptyText = '';

    var service = {
      create: create,
      get: get,
      list: list,
      update: update
    };

    return service;

    function create(game, success, error) {
      resourceFactory.gameResource.save(game, success, error);
    }

    function get(gameId) {
      var params = {'id': gameId};
      return resourceFactory.gameResource.get(params).$promise.finally(success);
    }

    function list(searchText, asc, field, page) {

      if (!asc) {
        field = '-' + field;
      }

      var params = {'query': searchText, 'ordering': field, 'page': page};

      return resourceFactory.gameResource.list(params).$promise;
    }

    function update(game, success, error) {
      /*jshint -W106*/
      var params = {'id': game.id};
      var auxGame = {
        form_template: game.form_template,
        name: game.name,
        analytics_view_id: game.analytics_view_id,
        package_name: game.package_name,
        game_service_id: game.game_service_id,
        game_image: game.game_image,
        api_key: game.api_key,
        push_templates: game.push_templates
      };
      resourceFactory.gameResource.update(params, auxGame, success, error);
    }

    function success(results) {
      return results;
    }

  }
})();
