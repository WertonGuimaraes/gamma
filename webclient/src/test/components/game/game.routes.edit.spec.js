describe('GameRoutesEdit', function () {

  var $scope, $rootScope, $state, $injector, urlUtil, $httpBackend, gameId = 1,
    homeGameState = 'home.game.edit';

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

      $templateCache.put('app/components/game/game.html', '');

    });
  });

  beforeEach(function () {
    gameUtil.mockGetGame($httpBackend, urlUtil);
  });

  describe('should set gamePrepServiceEdit and enter the route home.game.edit', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeGameState, {gameId: gameId});
      $rootScope.$digest();
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to game.edit', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeGameState, {gameId: gameId});
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homeGameState);
      expect($state.current.url).toEqual('/edit/{gameId:[0-9]*}');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeGameState)).toEqual('#/home/game/edit/1');
    });

    it('renders the game.list.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/game/game.html');
    });

    it('uses the GameController controller', function () {
      expect($state.current.views[''].controller).toEqual('GameController');
    });

  });

  describe('should not set gamePrepServiceEdit and should not enter the route home.game.edit', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeGameState, {gameId: gameId});
      $rootScope.$digest();
    });

    it('should not transition to home.game.edit', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homeGameState, {gameId: gameId});
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

