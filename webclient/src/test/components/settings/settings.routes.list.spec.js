describe('SettingsRoutesList', function () {

  var $scope, $rootScope, $state, $injector, homeSettingsState = 'home.settings.list';

  beforeEach(function () {

    module('gmm');

    inject(function (_$rootScope_, _$state_, _$injector_, _$httpBackend_, $templateCache, _$window_) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
      mockI18n.mockI18nEnglish(_$httpBackend_);
      _$window_.localStorage['jwtToken'] = 'JWT token';

      $templateCache.put('app/components/settings/settings.list.html', '');

    });
  });

  describe('Enter the route home.settings.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeSettingsState);
      $rootScope.$digest();
    });

    it('should transition to home.settings.list', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeSettingsState);
      $rootScope.$apply();
      expect($state.current.name).toBe(homeSettingsState);
      expect($state.current.url).toEqual('/');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeSettingsState)).toEqual('#/home/settings/');
    });

    it('renders the view', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/settings/settings.list.html');
    });
  });
});
