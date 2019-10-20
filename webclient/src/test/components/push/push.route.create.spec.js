describe('PushRouteCreate', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil,
    homePushState = 'home.push.create';

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

      $templateCache.put('app/components/push/push.html', '');

    });
  });

  describe('should enter the route home.push.create', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homePushState);
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should transition to push', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homePushState);
      $rootScope.$apply();
      expect($state.current.name).toBe(homePushState);
      expect($state.current.url).toEqual('/create');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homePushState)).toEqual('#/home/push/create');
    });

    it('renders the push.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/push/push.html');
    });

    it('uses the PushController controller', function () {
      expect($state.current.views[''].controller).toEqual('PushController');
    });

  });

});
