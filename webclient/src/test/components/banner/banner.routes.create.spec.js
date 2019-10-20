describe('BannerRoutesCreate', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil,
    homeBannerState = 'home.banner.create';

  beforeEach(function () {

    module('gmm');

    inject(function (_$rootScope_, _$state_, _$injector_, $templateCache, _$window_, _$httpBackend_, _urlUtil_) {

      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
      $httpBackend = _$httpBackend_;
      urlUtil = _urlUtil_;
      mockI18n.mockI18nEnglish(_$httpBackend_);
      _$window_.localStorage['jwtToken'] = 'JWT token';

      $templateCache.put('app/components/banner/banner.html', '');

    });
  });

  describe('should enter the route home.banner.create', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeBannerState);
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should transition to banner.create', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeBannerState);
      $rootScope.$apply();
      expect($state.current.name).toBe(homeBannerState);
      expect($state.current.url).toEqual('/create');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeBannerState)).toEqual('#/home/banner/create');
    });

    it('renders the banner.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.html');
    });

    it('uses the RegionController controller', function () {
      expect($state.current.views[''].controller).toEqual('BannerController');
    });

  });


});
