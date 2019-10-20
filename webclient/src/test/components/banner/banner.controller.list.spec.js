/*jshint -W106 */
describe('BannerListController', function () {

  var controller, urlUtil, $mdDialog, $rootScope, $httpBackend, service, $state, dialogService, languageService;
  var page = 1;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('bannerPrepService', function () {
        bannerUtil.mockGetBanners($httpBackend, urlUtil, page);
        var result;
        service.list('', '', '', '', '', false, 'status', page).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;
      });
      $provide.value('bannerListPrepTranslateService', function () {
        return [
          'BEGIN_DATE_ID',
          'END_DATE_ID',
          'CREATED_ID',
          'NAME_ID',
          'STATUS_ID',
          'UPDATE_ID',
          'ALL_ID',
          'STARTED_ID',
          'ABOUT_TO_START_ID',
          'PAUSED_ID',
          'FINISHED_ID',
          'CONFIRM_ACTIVATE_BANNER_ID',
          'SUCCESS_BANNER_CHANGE_ENABLED_STATUS_ID'
        ];
      });
    });
  });

  /*jshint -W072*/
  beforeEach(inject(function (_$state_, _$rootScope_, _$controller_, _$httpBackend_, _$mdDialog_, _$window_, _urlUtil_,
                              bannerPrepService, bannerService, _dialogService_, _languageService_,
                              _bannerListPrepTranslateService_) {

    _$window_.gapi = {};
    _$window_.g = {};
    _$window_.g.load = jasmine.createSpy('load');
    _$window_.gapi.analytics = {};
    _$window_.gapi.analytics.ready = jasmine.createSpy('ready');

    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $mdDialog = _$mdDialog_;
    languageService = _languageService_;
    urlUtil = _urlUtil_;
    dialogService = _dialogService_;
    mockI18n.mockI18nEnglish($httpBackend);
    var $scope = $rootScope.$new();
    var homeCtrl = _$controller_('HomeController');
    $scope.$parent.homeCtrl = homeCtrl;
    service = bannerService;
    controller = _$controller_('BannerControllerList', {$scope: $scope, bannerPrepService: bannerPrepService(),
      bannerListPrepTranslateService: _bannerListPrepTranslateService_()});
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('should be created successfully', function () {

    it('should be divided controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be divided infinityList', function () {
      expect(controller.infinityList).toBeDefined();
      expect(controller.infinityList).toEqual(1);
    });

    it('should be divided list', function () {
      expect(controller.list).toBeDefined();
      expect(controller.list.length).toEqual(3);
    });

    it('should be divided ascendant', function () {
      expect(controller.ascendant).toBeDefined();
      expect(controller.ascendant).toBeFalsy();
    });

    it('should be divided lastQuery', function () {
      expect(controller.lastQuery).toBeDefined();
      expect(controller.lastQuery).toEqual('');
    });

  });

  describe('getCsvExport', function () {
    var expectHeader = ['ID', 'NAME', 'GAMES', 'REGIONS', 'IMAGE URL', 'TARGET URL', 'LANGUAGE', 'ACTIVE', 'CAMPAIGN'];
    it('should call getCsvExport', function () {
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.bannerHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
    it('should call getCsvExport same null object', function () {
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.bannerHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
  });

  describe('getGameNames', function () {
    var banner = {};
    var games = [];
    beforeEach(function () {
      var game01 = {name: 'game01'};
      var game02 = {name: 'game02'};
      games[0] = game01;
      games[1] = game02;
      games[2] = null;
      banner.games = games;
    });

    it('should return name to game', function () {
      expect(controller.getGamesNames(banner)).toEqual('game01, game02');
    });
  });

  describe('lowercaseCountryCode', function () {
    it('should return lowercase', function () {
      expect(controller.lowercaseCountryCode('BR')).toEqual('br');
    });
  });

  describe('nextList', function () {
    beforeEach(function () {
      page = 2;
    });

    it('should responce empty', function () {
      bannerUtil.mockGetBanners($httpBackend, urlUtil, page);
      controller.nextList();
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(2);
      expect(controller.list.length).toEqual(6);
    });

    it('should call the server, refresh the list and infinityList update', function () {
      bannerUtil.mockGetBanners($httpBackend, urlUtil, page);
      controller.nextList();
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(2);
      expect(controller.list.length).toEqual(6);
    });

    it('should not call the server and not refresh the list', function () {
      controller.list.push.apply(controller.list, bannerUtil.getBanners().results);
      controller.nextList();
      expect(controller.infinityList).toEqual(1);
      expect(controller.list.length).toEqual(6);
    });
  });

  describe('change', function () {
    it('should call the server, refresh the query list', function () {
      var text = 'ban';
      bannerUtil.mockQuerySearch($httpBackend, urlUtil, text);
      controller.controllerToolbar.change(text);
      controller.nextList();
      $httpBackend.flush();
      expect(controller.list.length).toEqual(2);
    });
  });

  describe('showFilter', function () {
    it('should call the server', function () {
      expect(controller.showFilter()).toBeFalsy();
    });
  });

  describe('closeSidenavFilter', function () {
    it('should call closeSidenavFilter function', function () {
      spyOn(controller, 'closeSidenavFilter').and.callThrough();
      controller.closeSidenavFilter();
      expect(controller.closeSidenavFilter).toHaveBeenCalled();
    });
  });

  describe('filter', function () {
    it('should call the server', function () {
      bannerUtil.mockGetBanners($httpBackend, urlUtil, 1);
      controller.filter();
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(1);
    });
  });

  describe('clearFilter', function () {
    it('should call the server', function () {
      bannerUtil.mockGetBanners($httpBackend, urlUtil, 1);
      controller.lastField = 'name';
      controller.ascendant = true;
      controller.status = 'started';
      controller.clearFilter();
      $httpBackend.flush();
      expect(controller.lastField).toEqual('status');
      expect(controller.ascendant).toBeFalsy();
      expect(controller.status).toEqual('all');
      expect(controller.games.length).toBe(0);
      expect(controller.regions.length).toBe(0);
      expect(controller.campaigns.length).toBe(0);
    });
  });

  describe('getStatus', function () {
    it('should return message', function () {
      var banner = bannerUtil.getMockValidBanner();
      banner.is_expired = true;
      expect(controller.getStatus(banner)).toEqual('IT_HAS_BEEN_EXPIRED_ID');
    });
    it('should no return message', function () {
      var banner = bannerUtil.getMockValidBanner();
      banner.is_expired = false;
      expect(controller.getStatus(banner)).toBeUndefined();
    });
  });

  describe('removeGame', function () {
    beforeEach(function () {
      controller.games = mockDataGame.getGames().results;
    });

    it('should remove the second game', function () {
      bannerUtil.mockRemoveGame($httpBackend, urlUtil);
      controller.removeGame(controller.games[1]);
      $httpBackend.flush();
    });

  });

  describe('removeBanner', function () {
    beforeEach(function () {
      controller.banners = bannerUtil.getBanners().results;
    });

    it('should remove the second banners', function () {
      bannerUtil.mockRemoveBanner($httpBackend, urlUtil);
      controller.removeBanner(controller.banners[1]);
      $httpBackend.flush();
    });

  });

  describe('removeCampaign', function () {
    beforeEach(function () {
      controller.campaigns = campaignUtil.getCampaigns().results;
    });

    it('should remove the second campaign', function () {
      bannerUtil.mockRemoveCampaign($httpBackend, urlUtil);
      controller.removeCampaign(controller.campaigns[1]);
      $httpBackend.flush();
    });

  });

  describe('removeRegion', function () {
    beforeEach(function () {
      controller.regions = regionUtil.getRegions().results;
    });

    it('should remove the second game', function () {
      bannerUtil.mockRemoveRegion($httpBackend, urlUtil);
      controller.removeRegion(controller.regions[1]);
      $httpBackend.flush();
    });

  });

  describe('showDialog', function () {

    var dialogCtrl;

    beforeEach(function () {
      dialogCtrl = controller.showDialog({}, bannerUtil.getMockValidBanner());
      dialogCtrl = dialogCtrl.dialogController($mdDialog, languageService);
    });

    it('should call cancel function by dialogCtrl', function () {
      spyOn(dialogCtrl, 'cancel').and.callThrough();
      dialogCtrl.cancel();
      expect(dialogCtrl.cancel).toHaveBeenCalled();
    });

    it('should call getLanguageName function', function () {
      expect(dialogCtrl.getLanguageName('PT')).toEqual('Portuguese');
    });

    it('should call activate function by dialogCtrl', function () {

      var deferred = new $.Deferred();
      var stub = sinon.stub(controller, 'translate').returns(deferred.promise());
      deferred.resolve({});

      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });

      spyOn(dialogCtrl, 'activate').and.callThrough();
      bannerUtil.mockPatchBannerActivate($httpBackend, urlUtil, true);
      bannerUtil.mockGetBanners($httpBackend, urlUtil, 1);
      dialogCtrl.activate(null, true);
      $httpBackend.flush();
      expect(dialogCtrl.activate).toHaveBeenCalledWith(null, true);
    });

    it('should call activate function by dialogCtrl', function () {

      var deferred = new $.Deferred();
      var stub = sinon.stub(controller, 'translate').returns(deferred.promise());
      deferred.resolve({});

      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      spyOn(dialogCtrl, 'activate').and.callThrough();
      bannerUtil.mockPatchBannerActivate($httpBackend, urlUtil, false);
      bannerUtil.mockGetBanners($httpBackend, urlUtil, 1);
      dialogCtrl.activate(null, false);
      $httpBackend.flush();
      expect(dialogCtrl.activate).toHaveBeenCalledWith(null, false);
    });
  });

  describe('methods of routes', function () {
    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      bannerUtil.mockGetBanners($httpBackend, urlUtil, 1);
      $state.go('home.banner.list');
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should call viewAll', function () {
      controller.controllerToolbar.viewAll();
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.banner.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.list.html');
    });

    it('should call newBanner', function () {
      controller.controllerToolbar.new();
      $rootScope.$digest();
      expect($state.current.name).toEqual('home.banner.create');
    });
  });
});
