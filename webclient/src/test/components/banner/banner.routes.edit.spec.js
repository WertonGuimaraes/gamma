describe('BannerRoutesEdit', function () {

  var $scope, $rootScope, $state, $injector, urlUtil, $httpBackend, bannerId = 1,
    homeBannerState = 'home.banner.edit';

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

      $templateCache.put('app/components/banner/banner.html', '');

    });
  });

  beforeEach(function () {
    bannerUtil.mockGetBanner($httpBackend, urlUtil);
  });

  describe('should set bannerPrepServiceEdit and enter the route home.banner.edit', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeBannerState, {bannerId: bannerId});
      $rootScope.$digest();
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to banner.edit', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeBannerState, {bannerId: bannerId});
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homeBannerState);
      expect($state.current.url).toEqual('/edit/{bannerId:[1-9][0-9]*}');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeBannerState)).toEqual('#/home/banner/edit/1');
    });

    it('renders the banner.list.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.html');
    });

    it('uses the BannerController controller', function () {
      expect($state.current.views[''].controller).toEqual('BannerController');
    });

  });

  describe('should not set bannerPrepServiceEdit and should not enter the route home.banner.edit', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeBannerState, {bannerId: bannerId});
      $rootScope.$digest();
    });

    it('should not transition to home.banner.edit', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homeBannerState, {bannerId: bannerId});
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
