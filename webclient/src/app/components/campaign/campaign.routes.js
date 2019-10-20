(function () {
  'use strict';

  angular
    .module('gmm')
    .config(configRoutes);

  function configRoutes($stateProvider) {

    $stateProvider

      .state('home.campaign', {
        url: '/campaign',
        views: {
          '': {
            template: '<ui-view/>'
          },
          'toolbar': {
            template: '<div ui-view="toolbar"></div>'
          }
        }
      })

      .state('home.campaign.list', {
        url: '/',
        data: {
          title: 'CAMPAIGN_ID'
        },
        views: {
          '': {
            templateUrl: 'app/components/campaign/campaign.list.html',
            controller: 'CampaignControllerList',
            controllerAs: 'campaignCtlList',
            resolve: {
              campaignPrepService: campaignPrepService,
              generalPrepService: generalSettingsService
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.search.html'
          }
        }
      })

      .state('home.campaign.edit', {
        url: '/edit/{campaignId:[0-9]*}',
        data: {
          title: 'EDIT_CAMPAIGN_ID',
          save: editSave
        },
        views: {
          '': {
            templateUrl: 'app/components/campaign/campaign.html',
            controller: 'CampaignController',
            controllerAs: 'campaignCtrl',
            resolve: {
              campaignPrepService: campaignPrepServiceEdit,
              campaignPrepServiceTranslate: serviceTranslate
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }

      })

      .state('home.campaign.create', {
        url: '/create',
        data: {
          title: 'CAMPAIGN_CREATE_ID',
          save: createSave
        },
        views: {
          '': {
            templateUrl: 'app/components/campaign/campaign.html',
            controller: 'CampaignController',
            controllerAs: 'campaignCtrl',
            resolve: {
              campaignPrepService: campaignPrepServiceCreate,
              campaignPrepServiceTranslate: serviceTranslate
            }
          },
          'toolbar': {
            templateUrl: 'app/components/home/home.list.toolbar.html'
          }
        }
      });
  }

  function campaignPrepServiceCreate() {
    /*jshint -W106*/
    return {
      active: false,
      regions: [],
      begin_date: new Date(),
      end_date: new Date()
    };
  }

  function createSave(campaignService, campaign, success, error) {
    campaignService.create(campaign, success, error);
  }

  function editSave(campaignService, campaign, success, error) {
    campaignService.update(campaign, success, error);
  }

  /* @ngInject */

  function campaignPrepService(campaignService) {
    return campaignService.list('', '', '', '', false, 'status', 1);
  }
  /* @ngInject */

  function campaignPrepServiceEdit($stateParams, campaignService) {
    return campaignService.get($stateParams.campaignId);
  }

  /* @ngInject */
  function serviceTranslate(campaignTranslateService){
    return campaignTranslateService.translation();
  }

  /* @ngInject */
  function generalSettingsService(generalService) {
    return generalService.get();
  }

})();
