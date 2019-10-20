/*jshint -W106 */
describe('CampaignController.edit', function () {

  var $controller, $state, controller, urlUtil, $rootScope, $httpBackend, service, validCampaign, validGames,
    validRegions, dialogService, campaignPrepService;
  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('campaignPrepService', function () {
        campaignUtil.mockGetCampaign($httpBackend, urlUtil);
        var result;
        service.get(1).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;

      });

      $provide.value('campaignPrepServiceTranslate', function () {
        return {
          CONFIRM_CANCEL_ID: 'CONFIRM_CANCEL_ID',
          CONFIRM_SAVE_CAMPAIGN_ID: 'CONFIRM_SAVE_CAMPAIGN_ID',
          SAVE_ID: 'SAVE_ID',
          SAVING_ID: 'SAVING_ID',
          SUCCESS_SAVE_ID: 'SUCCESS_SAVE_ID',
          ERROR_CREATE_CAMPAIGN_CONFIGURATION_FOR_GAME_ID: 'ERROR_CREATE_CAMPAIGN_CONFIGURATION_FOR_GAME_ID',
          CLOSE_ID: 'CLOSE_ID',
          CAMPAIGN_DIALOG_ID: 'CAMPAIGN_DIALOG_ID',
          INFO_GAME_TEMPLATE_DUPLICATED_ID: 'INFO_GAME_TEMPLATE_DUPLICATED_ID'
        };
      });
    });
  });

  beforeEach(inject(function (_$state_, _$rootScope_, _$controller_, _$httpBackend_, _urlUtil_, _campaignPrepService_,
                              _campaignService_, _dialogService_, _campaignPrepServiceTranslate_) {

    $controller = _$controller_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    service = _campaignService_;
    dialogService = _dialogService_;
    urlUtil = _urlUtil_;
    campaignPrepService = _campaignPrepService_;
    mockI18n.mockI18nEnglish($httpBackend);
    controller = _$controller_('CampaignController', {
      campaignPrepService: _campaignPrepService_(),
      campaignPrepServiceTranslate: _campaignPrepServiceTranslate_()
    });
  }));

  describe('should be created successfully', function () {

    it('should be defined controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be defined campaign', function () {
      expect(controller.campaign).toBeDefined();
    });

  });

  describe('verifyDisabledBeginDate', function () {
    it('shorld call verifyDisabledBeginDate', function () {
      controller.campaign.begin_date = new Date().setDate(new Date().getDate() + 1);
      controller.verifyDisabledBeginDate();
      expect(controller.verifyDisabledBeginDate()).toBeFalsy();
    });
  });

  describe('verifyDisabledEdit', function () {
    it('shorld call verifyDisabledEdit', function () {
      var preCampaign = campaignPrepService();
      preCampaign.total_registered_participants = preCampaign.participant_limit;
      controller = $controller('CampaignController', {campaignPrepService: preCampaign});
      expect(controller.verifyDisabledEdit).toBeTruthy();
    });
  });

  describe('should edit a campaign', function () {

    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      campaignUtil.mockGetCampaign($httpBackend, urlUtil);
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.campaign.edit', {campaignId: 1});
      $rootScope.$digest();
      $httpBackend.flush();
    });

    describe('should call save method with success', function () {
      it('should saved campaign and redirect page', function () {
        campaignUtil.mockGetCampaignEdit($httpBackend, urlUtil);
        campaignUtil.mockGetCampaignsGeneral($httpBackend, urlUtil, 1, '', 'status');
        controller.save();
        $rootScope.$digest();
        $httpBackend.flush();
        expect($state.current.name).toEqual('home.campaign.list');
        expect($state.current.views[''].templateUrl).toEqual('app/components/campaign/campaign.list.html');
      });
    });
  });

});
