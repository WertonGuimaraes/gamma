/*jshint -W106 */
describe('CampaignController.create', function () {

  var controller, urlUtil, $rootScope, $mdDialog, $httpBackend, $state, dialogService, generalService;
  var formJson = {root: [{zix: [{time: '60'}, {score: '100'}]}]};

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('campaignPrepService', function () {
        return {
          active: false,
          regions: [],
          begin_date: new Date(),
          end_date: new Date()
        };
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

      $provide.value('generalPrepService', function () {
        campaignUtil.mockGetGeneral($httpBackend, urlUtil);
        var result;
        generalService.get().then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;
      });
    });
  });

  beforeEach(inject(function (_$state_, _$rootScope_, _$controller_, _$httpBackend_, _urlUtil_, _dialogService_,
                              _$mdDialog_, campaignPrepService, _campaignPrepServiceTranslate_, _generalService_) {
    urlUtil = _urlUtil_;
    $mdDialog = _$mdDialog_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    dialogService = _dialogService_;
    generalService = _generalService_;
    mockI18n.mockI18nEnglish($httpBackend);
    controller = _$controller_('CampaignController', {
      campaignPrepService: campaignPrepService(),
      campaignPrepServiceTranslate: _campaignPrepServiceTranslate_()
    });
    $httpBackend.flush();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('should be created successfully', function () {
    it('should be created controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be defined', function () {
      expect(controller.campaign).toBeDefined();
      expect(controller.campaign.active).toBeFalsy();
      expect(controller.regions).toBeDefined();
      expect(controller.games).toBeDefined();
      expect(controller.campaign).toBeDefined();
      expect(controller.disabled).toBeDefined();
      expect(controller.disableTemplate).toBeDefined();
      expect(controller.querySearchRegion).toBeDefined();
      expect(controller.addAllTemplates).toBeDefined();
      expect(controller.save).toBeDefined();
      expect(controller.removeGameConfig).toBeDefined();
      expect(controller.cancel).toBeDefined();
      expect(controller.hasDuplicatesCountriesInRegions).toBeDefined();
      expect(controller.querySearchGame).toBeDefined();
      expect(controller.changeGame).toBeDefined();
      expect(controller.removeGame).toBeDefined();
    });
  });

  describe('querySearch regions', function () {
    it('should call search region', function () {
      bannerUtil.mockQueryRegion($httpBackend, urlUtil, 'Brazil');
      var regionResult = controller.querySearchRegion('Brazil');

      regionResult.then(function (data) {
        controller.regions = data;
      });

      $httpBackend.flush();
      $rootScope.$apply();
    });
  });

  describe('querySearch games', function () {
    it('should call search game', function () {
      gameUtil.mockGetGames($httpBackend, urlUtil, 1, 'Zenny');
      var gameResult = controller.querySearchGame('Zenny');

      gameResult.then(function (data) {
        controller.games = data;
      });

      $httpBackend.flush();
      $rootScope.$apply();
    });
  });

  describe('changeGame function', function () {
    it('should call changeGame function', function () {
      var game = mockDataGame.mockGetValidGame();
      controller.games.push(game);
      controller.changeGame(game);
      expect(game.structure).toBeDefined();
    });
  });

  describe('removeGame function', function () {
    it('should call removeGame function', function () {
      var game = mockDataGame.mockGetValidGame();
      game.formJson = formJson;
      controller.changeGame(game);
      controller.games.push(game);
      controller.addAllTemplates(game);
      controller.removeGame(game);
      expect(controller.allTemplates.length).toEqual(0);
      expect(controller.games.length).toEqual(1);
    });
  });

  describe('addAllTemplates function', function () {

    var game = {};

    beforeEach(function () {
      game = mockDataGame.mockGetValidGame();
      game.formJson = formJson;
      controller.games.push(game);
      game.id = 2;
      controller.changeGame(game);
      controller.games.push(game);
      controller.addAllTemplates(game);
    });

    it('should call addAllTemplates function with success', function () {
      expect(controller.allTemplates.length).toBe(1);
      expect(controller.games.length).toBe(2);
    });

    it('should call addAllTemplates but not should add template because some game id', function () {
      controller.changeGame(game);
      controller.games.push(game);
      controller.addAllTemplates(game);
      expect(controller.games.length).toEqual(2);
    });

    it('should call addAllTemplates but not should add template because allTemplates some undefined', function () {
      controller.allTemplates = undefined;
      expect(controller.addAllTemplates(game)).toBeFalsy();
    });
  });

  describe('hasDuplicatesCountriesInRegions', function () {
    it('should call hasDuplicatesCountriesInRegions function without regions', function () {
      expect(controller.hasDuplicatesCountriesInRegions(0)).toBeFalsy();
    });

    it('should call hasDuplicatesCountriesInRegions function with regions', function () {
      controller.campaign.regions = bannerUtil.getMockValidRegions();
      expect(controller.hasDuplicatesCountriesInRegions(0)).toBeFalsy();
    });

    it('should call hasDuplicatesCountriesInRegions function with regions and regions duplicate', function () {
      controller.campaign.regions = bannerUtil.getMockDuplicateRegions();
      expect(controller.hasDuplicatesCountriesInRegions(0)).toBeTruthy();
    });
  });

  describe('disableTemplate', function () {
    it('should call disableTemplate', function () {
      var game = mockDataGame.mockGetValidGame();
      game.formJson = formJson;
      expect(controller.disableTemplate(game)).toBeFalsy();
    });
  });

  describe('validateStructure', function () {
    it('should call validateStructure function with formJson undefinded', function () {
      var formJsonAux = {root: undefined};
      controller.games.push(mockDataGame.mockGetValidGame());
      controller.formJson = formJsonAux;
      expect(controller.disableTemplate()).toBeTruthy();
    });

    it('should call validateStructure function with formJson empty', function () {
      var formJsonAux = {root: []};
      controller.games.push(mockDataGame.mockGetValidGame());
      controller.formJson = formJsonAux;
      expect(controller.disableTemplate()).toBeTruthy();
    });

    it('should call validateStructure function with child formJson empty', function () {
      controller.games.push(mockDataGame.mockGetValidGame());
      controller.formJson = formJson;
      expect(controller.disableTemplate()).toBeTruthy();
    });
  });

  describe('countryNamesFromRegions', function () {
    it('shorld call countryNamesFromRegions function and return empty', function () {
      controller.country_names = [];
      expect(controller.countryNamesFromRegions([])).toBe(controller.country_names);
    });

    it('shorld call countryNamesFromRegions function and return empty', function () {
      controller.country_names = [];
      expect(controller.countryNamesFromRegions([])).toBe(controller.country_names);
    });
  });

  describe('disabled', function () {

    beforeEach(function () {
      var game = mockDataGame.mockGetValidGame();
      game.formJson = formJson;
      controller.beginDateTime = new Date('October 13, 2014 11:13:00');
      controller.endDateTime = new Date('October 13, 2014 11:15:00');
      controller.campaign.name = 'campaign test create';
      controller.campaign.begin_date = controller.beginDateTime;
      controller.campaign.end_date = controller.endDateTime;
      controller.campaign.participant_limit = 100;
      controller.campaign.gmt_timezone = 'Europe/Tirane';
      controller.regions = regionUtil.getRegions().results;
      controller.changeGame(game);
      controller.games.push(game);
      controller.addAllTemplates(game);
    });

    it('should call disable with return false', function () {
      expect(controller.disabled()).toBeFalsy();
    });

    it('should call disable with return true because beginDateTime is greater than the endDateTime', function () {
      controller.beginDateTime = new Date('October 14, 2014 11:15:00');
      controller.endDateTime = new Date('October 13, 2014 11:15:00');
      expect(controller.disabled()).toBeTruthy();
    });

    describe('should call disable with return true because beginDateTime is greater than the endDateTime', function () {
      it('day', function () {
        controller.beginDateTime = new Date('October 14, 2014 11:15:00');
        controller.endDateTime = new Date('October 13, 2014 11:15:00');
        expect(controller.disabled()).toBeTruthy();
      });

      it('minute', function () {
        controller.beginDateTime = new Date('October 14, 2014 11:15:00');
        controller.endDateTime = new Date('October 14, 2014 11:15:00');
        expect(controller.disabled()).toBeTruthy();
      });
    });
  });

  describe('showCampaignConfigDialog', function () {
    var game = {};

    beforeEach(function () {
      game = mockDataGame.mockGetValidGame();
      game.formJson = formJson;
      controller.changeGame(game);
    });

    describe('Controller showCampaignConfigDialog', function () {

      var dialogCtrl;

      beforeEach(function () {
        var game = mockDataGame.mockGetValidGame();
        game.formJson = formJson;
        game.id = 10;
        controller.changeGame(game);
        controller.games.push(game);
        dialogCtrl = controller.showCampaignConfigDialog({}, game);
        dialogCtrl = dialogCtrl.dialogController($rootScope.$new(), $mdDialog);
      });

      it('should call cancel function by dialogCtrl', function () {
        spyOn(dialogCtrl, 'cancel').and.callThrough();
        dialogCtrl.cancel();
        expect(dialogCtrl.cancel).toHaveBeenCalled();
      });

      it('should call addAllTemplates function by dialogCtrl', function () {
        spyOn(dialogCtrl, 'addAllTemplates').and.callThrough();
        dialogCtrl.addAllTemplates();
        expect(dialogCtrl.addAllTemplates).toHaveBeenCalled();
      });

    });

  });

  describe('should create a campaign', function () {

    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.campaign.create');
      $rootScope.$digest();
      var game = mockDataGame.mockGetValidGame();
      game.formJson = formJson;
      controller.games.push(game);
      controller.changeGame(game);
      controller.addAllTemplates(game);
    });

    describe('should call save method with success', function () {
      it('should saved campaign and redirect page', function () {
        campaignUtil.mockGetCampaignCreate($httpBackend, urlUtil);
        campaignUtil.mockGetCampaignsGeneral($httpBackend, urlUtil, 1, '', 'status');
        controller.save();
        $rootScope.$digest();
        $httpBackend.flush();
        expect($state.current.name).toEqual('home.campaign.list');
        expect($state.current.views[''].templateUrl).toEqual('app/components/campaign/campaign.list.html');
      });
    });

    describe('should call save method with success', function () {
      it('should saved campaign and redirect page', function () {
        campaignUtil.mockGetCampaignCreateFail($httpBackend, urlUtil);
        controller.save();
        $rootScope.$digest();
        $httpBackend.flush();
        expect($state.current.name).toEqual('home.campaign.create');
        expect($state.current.views[''].templateUrl).toEqual('app/components/campaign/campaign.html');
      });
    });
  });

  describe('cancel', function () {
    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.campaign.create');
      $rootScope.$digest();
    });
    it('should call the redirectState callback function', function () {
      campaignUtil.mockGetCampaignsGeneral($httpBackend, urlUtil, 1, '', 'status');
      controller.cancel(null);
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.campaign.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/campaign/campaign.list.html');
    });
  });

});
