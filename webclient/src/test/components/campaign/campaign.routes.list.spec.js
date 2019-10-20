describe('CampaignRoutesList', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil, page = 1,
    homeCampaignState = 'home.campaign.list';

  beforeEach(function () {

    module('gmm');

    inject(function (_$rootScope_, _$state_, _$injector_, $templateCache, _$window_, _$httpBackend_, _urlUtil_) {

      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
      urlUtil = _urlUtil_;
      mockI18n.mockI18nEnglish($httpBackend);
      _$window_.localStorage['jwtToken'] = 'JWT token';

      $templateCache.put('app/components/campaign/campaign.list.html', '');

    });
  });

  beforeEach(function () {
    campaignUtil.mockGetCampaignsGeneral($httpBackend, urlUtil, page, '', 'status');
  });


  describe('should set campaignPrepService and enter the route home.campaign.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeCampaignState);
      $rootScope.$digest();
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeCampaignState)).toEqual('#/home/campaign/');
    });

    it('uses the CampaignControllerList controller', function () {
      expect($state.current.views[''].controller).toEqual('CampaignControllerList');
    });

    it('renders the view', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/campaign/campaign.list.html');
    });

    it('renders the view toolbar', function () {
      expect($state.current.views.toolbar.templateUrl).toEqual('app/components/home/home.list.toolbar.search.html');
    });

  });

  describe('should not set campaignPrepService and should not enter the route campaign.region.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeCampaignState);
      $rootScope.$digest();
    });

    it('should not transition to home.campaign.list', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homeCampaignState);
      $rootScope.$apply();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('renders the home.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/home/home.html');
      expect($state.current.views[''].templateUrl).not.toEqual('app/components/campaign/campaign.list.html');
    });

    it('should have undefined controller', function () {
      expect($state.current.controller).toBeUndefined();
    });
  });

});
