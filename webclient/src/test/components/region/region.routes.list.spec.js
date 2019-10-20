describe('RegionRoutesList', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil, page = 1,
    homeRegionState = 'home.settings.region.list';

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

      $templateCache.put('app/components/region/region.list.html', '');

    });
  });

  beforeEach(function () {
    regionUtil.mockGetRegions($httpBackend, urlUtil, page);
  });

  describe('should set regionPrepService and enter the route home.settings.region.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.go(homeRegionState);
      $rootScope.$digest();
      $httpBackend.flush(); //mock and set regionPrepService
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to home.settings.region.list', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.go('home.settings');
      $rootScope.$digest();
      expect($state.current.name).toBe('home.settings');
      expect($state.current.url).toEqual('/settings');
      $state.transitionTo(homeRegionState);
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homeRegionState);
      expect($state.current.url).toEqual('/');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeRegionState)).toEqual('#/home/settings/region/');
    });

    it('renders the view', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.list.html');
    });

    it('uses in view the RegionControllerList controller', function () {
      expect($state.current.views[''].controller).toEqual('RegionControllerList');
    });

    it('renders the view toolbar', function () {
      expect($state.current.views.toolbar.templateUrl).toEqual('app/components/home/home.list.toolbar.search.html');
    });
  });

  describe('should not set playersPrepService and should not enter the route home.settings.region.list', function () {

    /* regionPrepService does not set why not call $httpBackend.flush(); */
    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.go(homeRegionState);
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should not transition to home.settings.region.list', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.transitionTo(homeRegionState);
      $rootScope.$apply();
      expect($state.current.name).toBe('home.settings');
      expect($state.current.url).toEqual('/settings');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('renders the home.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.list.html');
      expect($state.current.templateUrl).not.toEqual('app/components/region/region.list.html');
    });

    it('should have undefined controller', function () {
      expect($state.current.controller).toBeUndefined();
    });
  });

});
