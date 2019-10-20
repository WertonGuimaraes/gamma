describe('GameRoutesCreate', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil,
    homeGameState = 'home.game.create';

  beforeEach(function () {

    module('gmm');

    inject(function (_$rootScope_, _$state_, _$injector_, $templateCache, _$window_, _$httpBackend_, _urlUtil_) {

      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      $injector = _$injector_;
      urlUtil = _urlUtil_;
      mockI18n.mockI18nEnglish(_$httpBackend_);

      _$window_.localStorage['jwtToken'] = 'JWT token';

      $templateCache.put('app/components/game/game.html', '');

    });
  });

  describe('should enter the route home.game.create', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeGameState);
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should transition to game.create', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeGameState);
      $rootScope.$apply();
      expect($state.current.name).toBe(homeGameState);
      expect($state.current.url).toEqual('/create');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeGameState)).toEqual('#/home/game/create');
    });

    it('renders the game.create.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/game/game.html');
    });

    it('uses the RegionController controller', function () {
      expect($state.current.views[''].controller).toEqual('GameController');
    });

  });


});

