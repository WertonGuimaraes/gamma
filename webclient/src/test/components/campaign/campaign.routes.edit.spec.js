describe('CampaignRoutesEdit', function () {

  var $scope, $rootScope, $state, $injector, urlUtil, $httpBackend, campaignId = 1,
    homeCampaignState = 'home.campaign.edit';

  beforeEach(function () {

    module('gmm');

    inject(function (_$rootScope_, _$state_, _$injector_, $templateCache, _$window_, _urlUtil_, _$httpBackend_) {

      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
      urlUtil = _urlUtil_;
      mockI18n.mockI18nEnglish($httpBackend);
      _$window_.localStorage['jwtToken'] = 'JWT token';

      $templateCache.put('app/components/campaign/campaign.html', '');

    });
  });

  beforeEach(function () {
    campaignUtil.mockGetCampaign($httpBackend, urlUtil);
  });

  describe('should set campaignPrepServiceEdit and enter the route home.campaign.edit', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeCampaignState, {campaignId: campaignId});
      $rootScope.$digest();
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to campaign.edit', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeCampaignState, {campaignId: campaignId});
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homeCampaignState);
      expect($state.current.url).toEqual('/edit/{campaignId:[0-9]*}');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeCampaignState)).toEqual('#/home/campaign/edit/1');
    });

    it('uses the CampaignController controller', function () {
      expect($state.current.views[''].controller).toEqual('CampaignController');
    });

  });

  describe('should not set campaignPrepServiceEdit and should not enter the route home.campaign.edit', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeCampaignState, {campaignId: campaignId});
      $rootScope.$digest();
    });

    it('should not transition to home.campaign.edit', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homeCampaignState, {campaignId: campaignId});
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

