(function () {
  'use strict';

  angular.module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider

      .state('home.settings.group', {
        url: '/group',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.settings.group.list', {
        url: '/',
        data: {
          title: 'GROUPS_ID'
        },
        views: {
          '': {
            controller: 'GroupControllerList',
            controllerAs: 'groupCtrlList',
            templateUrl: 'app/components/group/group.list.html',
            resolve: {
              groupPrepService: groupPrepService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        }
      })

      .state('home.settings.group.edit', {
        url: '/edit/{groupId:[0-9]*}',
        data: {
          title: 'GROUP_EDIT_ID',
          save: editSave
        },
        views: {
          '': {
            controller: 'GroupController',
            controllerAs: 'groupCtrl',
            templateUrl: 'app/components/group/group.html',
            resolve: {
              groupPrepService: groupPrepServiceEdit,
              groupPrepTranslateService: groupPrepTranslateService
            }
          }
        }
      })

      .state('home.settings.group.create', {
        url: '/create',
        data: {
          title: 'GROUP_CREATE_ID',
          save: createSave
        },
        views: {
          '': {
            controller: 'GroupController',
            controllerAs: 'groupCtrl',
            templateUrl: 'app/components/group/group.html',
            resolve: {
              groupPrepService: groupPrepServiceCreate,
              groupPrepTranslateService: groupPrepTranslateService
            }
          }
        }
      });
  }

  function createSave(groupService, group, success, error) {
    groupService.create(group, success, error);
  }

  function editSave(groupService, group, success, error) {
    groupService.update(group, success, error);
  }

  /* @ngInject */
  function groupPrepServiceCreate() {
    /*jshint -W106*/
    return {
      name: '',
      permissions: []
    };
  }

  /* @ngInject */
  function groupPrepServiceEdit($stateParams, groupService) {
    return groupService.get($stateParams.groupId);
  }

  /* @ngInject */
  function groupPrepService(groupService) {
    return groupService.list('', true, 'name', 1);
  }

  /* @ngInject */
  function groupPrepTranslateService(groupTranslateService){
    return groupTranslateService.translation();
  }
})();
