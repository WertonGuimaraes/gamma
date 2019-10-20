describe('PlayersRoutes', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil,
    homePlayerState = 'home.players.list';

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

      $templateCache.put('app/components/players/players.list.html', '');

    });
  });

  beforeEach(function () {
    playersUtil.mockGetPlayers($httpBackend, urlUtil, '', 1);
  });

  describe('should set playersPrepService and enter the route home.players.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homePlayerState);
      $rootScope.$digest();
      $httpBackend.flush(); //mock and set playersPrepService
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to players', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homePlayerState);
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homePlayerState);
      expect($state.current.url).toEqual('/');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homePlayerState)).toEqual('#/home/players/');
    });

    it('renders the players.list.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/players/players.list.html');
    });

    it('uses the PlayersController controller', function () {
      expect($state.current.views[''].controller).toEqual('PlayersController');
    });

  });

  describe('should not set playersPrepService and should not enter the route home.players', function () {

    /* playersPrepService does not set why not call $httpBackend.flush(); */
    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homePlayerState);
      $rootScope.$digest();
    });

    it('should not transition to players', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homePlayerState);
      $rootScope.$apply();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('renders the home.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/home/home.html');
      expect($state.current.views[''].templateUrl).not.toEqual('app/components/players/players.list.html');
    });

    it('should have undefined controller', function () {
      expect($state.current.controller).toBeUndefined();
    });
  });

});
