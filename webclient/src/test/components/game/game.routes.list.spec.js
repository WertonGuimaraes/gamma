describe('GameRoutesList', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil, page = 1,
    homeGameState = 'home.game.list';

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

      $templateCache.put('app/components/game/game.list.html', '');

    });
  });

  beforeEach(function () {
    gameUtil.mockGetGames($httpBackend, urlUtil, 1, '');
  });

  describe('should set gamePrepService and enter the route home.game.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeGameState);
      $rootScope.$digest();
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to home.game.list', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeGameState);
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homeGameState);
      expect($state.current.url).toEqual('/');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeGameState)).toEqual('#/home/game/');
    });

    it('renders the view', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/game/game.list.html');
    });

    it('uses in view the GameControllerList controller', function () {
      expect($state.current.views[''].controller).toEqual('GameControllerList');
    });

    it('renders the view toolbar', function () {
      expect($state.current.views.toolbar.templateUrl).toEqual('app/components/home/home.list.toolbar.search.html');
    });

  });

  describe('should not set gamePrepService and should not enter the route home.game.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeGameState);
      $rootScope.$digest();
    });

    it('should not transition to home.game.list', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homeGameState);
      $rootScope.$apply();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('renders the home.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/home/home.html');
      expect($state.current.views[''].templateUrl).not.toEqual('app/components/game/game.list.html');
    });

    it('should have undefined controller', function () {
      expect($state.current.controller).toBeUndefined();
    });
  });
});
