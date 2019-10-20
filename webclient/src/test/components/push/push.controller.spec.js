describe('PushController', function () {

  var controller, $state, urlUtil, $rootScope, $httpBackend, dialogService, $mdDialog, playerService, campaignService;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('campaignsPrepService', function () {
        return [];
      });

      $provide.value('pushPrepTranslateService', function () {
        return [
          'SAVE_ID',
          'SAVING_ID',
          'INFO_NOT_PUSH_CONFIGURATION_ID',
          'CONFIRM_CANCEL_ID',
          'CONFIRM_SEND_PUSH_ID',
          'SUCCESS_SEND_ID'
        ];
      });
    });
  });

  /*jshint -W072*/
  beforeEach(inject(function (_$state_, _$rootScope_, _$controller_, _$httpBackend_, _$mdDialog_, _urlUtil_,
                              _dialogService_, _playerService_, _campaignService_, campaignsPrepService,
                              _pushPrepTranslateService_) {
    urlUtil = _urlUtil_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    dialogService = _dialogService_;
    $mdDialog = _$mdDialog_;
    playerService = _playerService_;
    campaignService = _campaignService_;
    mockI18n.mockI18nEnglish($httpBackend);

    var homeCtrl = _$controller_('HomeController');
    var $scope = $rootScope.$new();
    $scope.$parent.homeCtrl = homeCtrl;

    pushUtil.mockInitController($httpBackend, urlUtil);
    controller = _$controller_('PushController', {
      $scope: $scope,
      campaignsPrepService: campaignsPrepService(),
      pushPrepTranslateService: _pushPrepTranslateService_()
    });
    $httpBackend.flush();
  }));


  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be created successfully', function () {
    expect(controller).toBeDefined();
  });

  it('should be divided regions', function () {
    expect(controller.regions).toBeDefined();
    expect(controller.regions.length).toEqual(0);
  });

  it('should be divided campaigns', function () {
    expect(controller.campaigns).toBeDefined();
    expect(controller.campaigns.length).toEqual(0);
  });

  it('should be divided games', function () {
    expect(controller.games).toBeDefined();
    expect(controller.games.length).toEqual(0);
  });

  describe('querySearchGame', function () {
    it('should call server and return games', function () {
      setGameSearch();
      expect(controller.games.length).toEqual(2);
    });
  });

  describe('querySearchRegion', function () {
    it('should call server and return region', function () {
      setRegionSearch();
      expect(controller.regions.length).toEqual(4);
    });
  });

  describe('querySearchCampaign', function () {
    it('should call server and return campaign', function () {
      setCampaignSearch();
      expect(controller.campaigns.length).toEqual(3);
    });
  });

  describe('filterChange', function () {
    beforeEach(function () {
      controller.games = mockDataGame.getGames().results;
    });
    it('should call server and return total device', function () {
      pushUtil.mockFilter($httpBackend, urlUtil);
      controller.filterChange();
      $httpBackend.flush();
      expect(controller.total).toEqual(1);
    });

    it('should call server and return total device with participants', function () {
      controller.regions = regionUtil.getRegions().results;
      controller.campaigns = campaignUtil.getCampaigns().results;
      pushUtil.mockFilterWithParticipants($httpBackend, urlUtil);
      controller.filterChange();
      $httpBackend.flush();
      expect(controller.total).toEqual(1);
    });

    describe('should call with error server', function () {

      beforeEach(function () {
        var deferred = new $.Deferred();
        var stub = sinon.stub(playerService, 'countSearch').returns(deferred.promise());
        deferred.reject({});
      });

      it('should call with error server and total equal zero', function () {
        controller.filterChange();
        expect(controller.total).toEqual(0);
      });
    });
  });

  describe('disablePush', function () {
    it('should is enable', function () {
      setGameSearch();
      controller.total = 10;
      expect(controller.games.length).toEqual(2);
      expect(controller.disablePush()).toBeFalsy();
    });
    it('should disable when total is 0', function () {
      setGameSearch();
      expect(controller.games.length).toEqual(2);
      controller.total = 0;
      expect(controller.disablePush()).toBeTruthy();
    });
  });

  describe('showDialogPushDetails', function () {
    it('should call showDialog', function () {
      controller.showDialogPushDetails({});
    });

    describe('Controller showDialogPushDetails', function () {

      it('should cancel dialog', function () {
        controller.PushDetailsController($mdDialog).cancel();
      });

      it('should call lowercaseCountryCode function', function () {
        expect(controller.PushDetailsController($mdDialog).lowercaseCountryCode('BR')).toEqual('br');
      });

      it('should call scrollAction function and should call the service', function () {
        pushUtil.mockFilter($httpBackend, urlUtil);
        var controllerDetails = controller.PushDetailsController($mdDialog);
        controller.games = mockDataGame.getGames().results;
        controllerDetails.pushDetails.results = [];
        controllerDetails.scrollAction(1);
        $httpBackend.flush();
        expect(controllerDetails.pushDetails.results.length).toBe(1);
      });

    });

  });

  describe('push', function () {
    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
    });

    it('should call push wiht success', function () {
      pushUtil.mockPush($httpBackend, urlUtil);
      pushUtil.mockGetEmptyListPush($httpBackend, urlUtil, 1);
      controller.sendMessagePush({});
      $httpBackend.flush();
    });

    it('should call push wiht erro', function () {
      pushUtil.mockPushError($httpBackend, urlUtil);
      controller.sendMessagePush({});
      $httpBackend.flush();
    });

    it('should call push wiht game', function () {
      setGameSearch();
      pushUtil.mockPush($httpBackend, urlUtil);
      pushUtil.mockGetEmptyListPush($httpBackend, urlUtil, 1);
      controller.sendMessagePush({});
      $httpBackend.flush();
    });

    it('should call push wiht region', function () {
      setRegionSearch();
      pushUtil.mockPush($httpBackend, urlUtil);
      pushUtil.mockGetEmptyListPush($httpBackend, urlUtil, 1);
      controller.sendMessagePush({});
      $httpBackend.flush();
    });

    it('should call push wiht region', function () {
      setCampaignSearch();
      pushUtil.mockPush($httpBackend, urlUtil);
      pushUtil.mockGetEmptyListPush($httpBackend, urlUtil, 1);
      controller.sendMessagePush({});
      $httpBackend.flush();
    });

  });

  describe('removeGame', function () {
    beforeEach(function () {
      controller.games = mockDataGame.getGames().results;
    });

    it('should remove the second game', function () {
      pushUtil.mockRemoveGame($httpBackend, urlUtil);
      controller.removeGame(controller.games[1]);
      $httpBackend.flush();
    });

  });

  describe('removeCampaign', function () {
    beforeEach(function () {
      controller.campaigns = campaignUtil.getCampaigns().results;
    });

    it('should remove the second campaign', function () {
      pushUtil.mockRemoveCampaign($httpBackend, urlUtil);
      controller.removeCampaign(controller.campaigns[1]);
      $httpBackend.flush();
    });

  });

  describe('removeRegion', function () {
    beforeEach(function () {
      controller.regions = regionUtil.getRegions().results;
    });

    it('should remove the second game', function () {
      pushUtil.mockRemoveRegion($httpBackend, urlUtil);
      controller.removeRegion(controller.regions[1]);
      $httpBackend.flush();
    });

  });

  describe('cancel', function () {
    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.push.create');
      $rootScope.$digest();
    });
    it('should call the redirectState callback function', function () {
      pushUtil.mockGetEmptyListPush($httpBackend, urlUtil, 1);
      controller.cancel(null);
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.push.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/push/push.list.html');
    });
  });

  function setCampaignSearch() {
    campaignUtil.mockGetCampaigns($httpBackend, urlUtil, 1, 'Campaign', 'name');
    var campaignResult = controller.querySearchCampaign('Campaign');

    campaignResult.then(function (data) {
      controller.campaigns = data;
    });

    $httpBackend.flush();
    $rootScope.$apply();
  }

  function setRegionSearch() {
    regionUtil.mockChange($httpBackend, urlUtil, 'Brazil', true);
    var regionResult = controller.querySearchRegion('Brazil');

    regionResult.then(function (data) {
      controller.regions = data;
    });

    $httpBackend.flush();
    $rootScope.$apply();
  }

  function setGameSearch() {
    gameUtil.mockGetGames($httpBackend, urlUtil, 1, 'Zenny');
    var gameResult = controller.querySearchGame('Zenny');

    gameResult.then(function (data) {
      controller.games = data;
    });

    $httpBackend.flush();
    $rootScope.$apply();
  }

});
