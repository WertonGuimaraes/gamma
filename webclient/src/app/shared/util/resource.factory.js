(function () {
  'use strict';

  angular.module('gmm').factory('resourceFactory', resourceFactory);

  /* @ngInject */
  function resourceFactory($resource, $q, dialogService, urlUtil) {

    var factory = {
      bannerResource: bannerResource(),
      campaignResource: campaignResource(),
      gameResource: gameResource(),
      participantResource: participantResource(),
      playerResource: playerResource(),
      pushResource: pushResource(),
      pushResourceDetails: pushResourceDetails(),
      pushesResource: pushesResource(),
      regionResource: regionResource(),
      groupResource: groupResource(),
      generalResource: generalResource(),
      userResource: userResource(),
    };

    return factory;

    function bannerResource() {
      return getResource(urlUtil.BANNER);
    }

    function campaignResource() {
      return getResource(urlUtil.CAMPAIGN);
    }

    function gameResource() {
      return getResource(urlUtil.GAME);
    }

    function groupResource() {
      return getResource(urlUtil.GROUP);
    }

    function participantResource() {
      return getResource(urlUtil.PARTICIPANT);
    }

    function playerResource() {
      return getResource(urlUtil.PLAYER);
    }

    function pushResource() {
      return getResource(urlUtil.PUSH);
    }

    function pushResourceDetails() {
      return getResource(urlUtil.PUSH_DETAILS);
    }

    function pushesResource() {
      return getResource(urlUtil.PUSHES);
    }

    function regionResource() {
      return getResource(urlUtil.REGION);
    }

    function generalResource() {
      return getResource(urlUtil.GENERAL);
    }

    function userResource() {
      return getResource(urlUtil.USER);
    }

    function getResource(url) {
      return $resource(url, {id: '@_id'}, getConfigResource());
    }

    function getConfigResource() {
      return {
        save: {
          method: 'POST',
          interceptor: {
            responseError: interceptorError
          }
        },
        update: {
          method: 'PUT',
          interceptor: {
            responseError: interceptorError
          }
        },
        patch: {
          method: 'PATCH',
          interceptor: {
            responseError: interceptorError
          }
        },
        list: {
          method: 'GET',
          interceptor: {
            responseError: interceptorError
          }
        },
        get: {
          method: 'GET',
          interceptor: {
            responseError: interceptorError
          }
        }
      };
    }

    function interceptorError(response) {
      if (response.status !== 403 && response.status !== 401) {
        var message = 'Server connection failed';
        if(response.status !== 500) {
          try {
            message = getFirstElement(response.data);
          } catch (ex) {
          }
        }
        dialogService.show(null, 'Gamma Dialog', message, 'Gamma Dialog', false, 'Close', null);
      }
      return $q.reject(response);
    }

    function getFirstElement(data) {
      if (isString(data)) {
        return data;
      }
      var firstElement = data[Object.keys(data)[0]];
      if (angular.isArray(firstElement)) {
        return getFirstElement(firstElement[0]);
      } else {
        if (isString(firstElement)) {
          return firstElement;
        }
        return firstElement[Object.keys(data)[0]];
      }

      function isString(object){
        if (angular.isString(object)) {
          return true;
        }
        return false;
      }
    }
  }
})();
