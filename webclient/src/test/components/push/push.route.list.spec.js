describe('PushRouteList', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil,
    homePushState = 'home.push.list';

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

      $templateCache.put('app/components/push/push.list.html', '');

    });
  });

  beforeEach(function () {
    pushUtil.mockGetListPush($httpBackend, urlUtil, 'data', 1, '');
  });

  describe('should set pushPrepService and enter the route home.push.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homePushState);
      $rootScope.$digest();
      $httpBackend.flush(); //mock and set pushPrepService
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to push', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homePushState);
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homePushState);
      expect($state.current.url).toEqual('/');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homePushState)).toEqual('#/home/push/');
    });

    it('renders the push.list.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/push/push.list.html');
    });

    it('uses the PushController controller', function () {
      expect($state.current.views[''].controller).toEqual('PushControllerList');
    });

  });

  describe('should not set pushPrepService and should not enter the route home.push.list', function () {

    /* pushsPrepService does not set why not call $httpBackend.flush(); */
    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homePushState);
      $rootScope.$digest();
    });

    it('should not transition to push', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homePushState);
      $rootScope.$apply();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('renders the home.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/home/home.html');
      expect($state.current.views[''].templateUrl).not.toEqual('app/components/push/push.html');
    });

    it('should have undefined controller', function () {
      expect($state.current.controller).toBeUndefined();
    });
  });

});
