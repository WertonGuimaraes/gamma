describe('CampaignRoutesCreate', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil,
    homeCampaignState = 'home.campaign.create';

  beforeEach(function () {

    module('gmm');

    inject(function (_$rootScope_, _$state_, _$injector_, $templateCache, _$window_, _$httpBackend_, _urlUtil_) {

      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
      urlUtil = _urlUtil_;
      mockI18n.mockI18nEnglish(_$httpBackend_);
      _$window_.localStorage['jwtToken'] = 'JWT token';

      $templateCache.put('app/components/campaign/campaign.create.html', '');

    });
  });

  describe('should enter the route home.campaign.create', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeCampaignState);
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should transition to campaign.create', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeCampaignState);
      $rootScope.$apply();
      expect($state.current.name).toBe(homeCampaignState);
      expect($state.current.url).toEqual('/create');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeCampaignState)).toEqual('#/home/campaign/create');
    });

    it('renders the campaign.create.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/campaign/campaign.html');
    });

    it('uses the RegionController controller', function () {
      expect($state.current.views[''].controller).toEqual('CampaignController');
    });

  });


});

