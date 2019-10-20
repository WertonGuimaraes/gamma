describe('RegionRoutesCreate', function () {

  var $scope, $rootScope, $state, $injector, urlUtil,
    homeRegionState = 'home.settings.region.create';

  beforeEach(function () {

    module('gmm');

    inject(function (_$rootScope_, _$state_, _$injector_, $templateCache, _$window_, _$httpBackend_, _urlUtil_) {

      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
      urlUtil = _urlUtil_;
      mockI18n.mockI18nEnglish(_$httpBackend_);
      _$window_.localStorage['jwtToken'] = 'JWT token';

      $templateCache.put('app/components/region/region.html', '');

    });
  });

  describe('should enter the route home.settings.region.create', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.go(homeRegionState);
      $rootScope.$digest();
    });

    it('should transition to region.create', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeRegionState);
      $rootScope.$apply();
      expect($state.current.name).toBe(homeRegionState);
      expect($state.current.url).toEqual('/create');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeRegionState)).toEqual('#/home/settings/region/create');
    });

    it('renders the region.list.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.html');
    });

    it('uses the RegionController controller', function () {
      expect($state.current.views[''].controller).toEqual('RegionController');
    });

  });

});

