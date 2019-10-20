(function () {
  'use strict';

  angular.module('gmm')
    .service('generalService', generalService);

  /* @ngInject */
  function generalService(resourceFactory) {

    var service = {
      get: get,
      update: update
    };

    return service;

    function get() {
      return resourceFactory.generalResource.get().$promise.finally(success);
    }

    function update(general, success, error) {
      var params = {'id': general.id};
       /*jshint -W106*/
      var auxGeneral = {
        id: general.id,
        update_time_push: general.update_time_push,
        update_time_participant_number: general.update_time_participant_number,
        update_time_refresh_token: general.update_time_refresh_token,
        update_analytics_client_id: general.update_analytics_client_id
      };
      resourceFactory.generalResource.update(params, auxGeneral, success, error);
    }

    function success(results) {
      return results;
    }

  }
})();
