describe('RegionRoutesEdit', function () {

  var $scope, $rootScope, $state, $injector, urlUtil, $httpBackend, regionId = 1,
    homeRegionState = 'home.settings.region.edit';

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

      $templateCache.put('app/components/region/region.html', '');

    });
  });

  beforeEach(function () {
    regionUtil.mockGetRegion($httpBackend, urlUtil);
  });

  describe('should set regionPrepServiceEdit and enter the route home.settings.region.edit', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.go(homeRegionState, {regionId: regionId});
      $rootScope.$digest();
      $httpBackend.flush(); //mock and set regionPrepServiceEdit
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to region.edit', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.go('home.settings');
      $rootScope.$digest();
      expect($state.current.name).toBe('home.settings');
      expect($state.current.url).toEqual('/settings');
      $state.transitionTo(homeRegionState, {regionId: regionId});
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homeRegionState);
      expect($state.current.url).toEqual('/edit/{regionId:[0-9]*}');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeRegionState)).toEqual('#/home/settings/region/edit/1');
    });

    it('renders the region.list.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.html');
    });

    it('uses the RegionController controller', function () {
      expect($state.current.views[''].controller).toEqual('RegionController');
    });

  });

  describe('should not set regionPrepServiceEdit and should not enter the route home.settings.region.edit', function () {

    /* regionPrepServiceEdit does not set why not call $httpBackend.flush(); */
    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeRegionState, {regionId: regionId});
      $rootScope.$digest();
    });

    it('should not transition to home.settings.region.edit', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homeRegionState, {regionId: regionId});
      $rootScope.$apply();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('renders the home.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/home/home.html');
      expect($state.current.views[''].templateUrl).not.toEqual('app/components/region/region.list.html');
    });

    it('should have undefined controller', function () {
      expect($state.current.controller).toBeUndefined();
    });
  });

});

