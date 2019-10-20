describe('BannerRoutesList', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil,
    homeBannerState = 'home.banner.list';

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

      $templateCache.put('app/components/banner/banner.list.html', '');

    });
  });

  beforeEach(function () {
    bannerUtil.mockGetBanners($httpBackend, urlUtil, 1);
  });

  describe('should set bannerPrepService and enter the route home.banner.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeBannerState);
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
      expect($state.href(homeBannerState)).toEqual('#/home/banner/');
    });

    it('renders the view', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.list.html');
    });

    it('uses in view the BannerControllerList controller', function () {
      expect($state.current.views[''].controller).toEqual('BannerControllerList');
    });

    it('renders the view toolbar', function () {
      expect($state.current.views.toolbar.templateUrl).toEqual('app/components/home/home.list.toolbar.search.html');
    });
  });

  describe('should not set bannerPrepService and should not enter the route banner.region.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeBannerState);
      $rootScope.$digest();
    });

    it('should not transition to home.banner.list', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homeBannerState);
      $rootScope.$apply();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('renders the home.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/home/home.html');
      expect($state.current.views[''].templateUrl).not.toEqual('app/components/banner/banner.list.html');
    });

    it('should have undefined controller', function () {
      expect($state.current.controller).toBeUndefined();
    });
  });

});
