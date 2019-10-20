(function () {
  'use strict';

  angular.module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider

      .state('home.settings.user', {
        url: '/user',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.settings.user.list', {
        url: '/',
        data: {
          title: 'USERS_ID'
        },
        views: {
          '': {
            controller: 'UserControllerList',
            controllerAs: 'userCtrlList',
            templateUrl: 'app/components/user/user.list.html',
            resolve: {
              userPrepService: userPrepService,
              groupPrepService: groupPrepService,
              userPrepSearch: userPrepSearch,
              userPrepTranslateService: userPrepTranslateService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        }
      })

      .state('home.settings.user.create', {
        url: '/create',
        data: {
          title: 'NEW_USER_ID',
          save: createSave
        },
        views: {
          '': {
            controller: 'UserController',
            controllerAs: 'userCtrl',
            templateUrl: 'app/components/user/user.html',
            resolve: {
              userPrepService: userPrepServiceCreate,
              userPrepTranslateService: userPrepTranslateService,
              groupPrepService: groupPrepService
            }
          }
        }
      })

      .state('home.settings.user.edit', {
        url: '/edit/{userId:[0-9]*}',
        data: {
          title: 'USER_EDIT_ID',
          save: editSave
        },
        views: {
          '': {
            controller: 'UserController',
            controllerAs: 'userCtrl',
            templateUrl: 'app/components/user/user.html',
            resolve: {
              userPrepService: userPrepServiceEdit,
              userPrepTranslateService: userPrepTranslateService,
              groupPrepService: groupPrepService
            }
          }
        }
      });
  }

  function createSave(userService, user, success, error) {
    userService.create(user, success, error);
  }

  function editSave(userService, user, success, error) {
    userService.update(user, success, error);
  }

  /* @ngInject */
  function userPrepService(userService) {
    return userService.list('', '', '', '', 'True', true, 'first_name', '', 1);
  }

  function userPrepSearch() {
    return {
      name: '',
      username: '',
      email: '',
      group: '',
      active: true
    };
  }

  /* @ngInject */
  function userPrepServiceCreate() {
    /*jshint -W106*/
    return {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      is_active: true,
      groups: [],
      user_permissions: []
    };
  }

  /* @ngInject */
  function userPrepServiceEdit($stateParams, userService) {
    return userService.get($stateParams.userId);
  }

  /* @ngInject */
  function userPrepTranslateService(userTranslateService){
    return userTranslateService.translation();
  }

  /* @ngInject */
  function groupPrepService(groupService) {
    return groupService.list('', true, 'name', 1);
  }
})();
