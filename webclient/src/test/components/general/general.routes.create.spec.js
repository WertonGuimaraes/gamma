describe('GeneralRoutesCreate', function () {

  var $scope, $rootScope, $state, $injector, urlUtil, $httpBackend,
    homeGeneralState = 'home.settings.general.update';

  beforeEach(function () {

    module('gmm');

    inject(function (_$rootScope_, _$state_, _$injector_, $templateCache, _$window_, _$httpBackend_, _urlUtil_) {

      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
      urlUtil = _urlUtil_;
      $httpBackend = _$httpBackend_;
      mockI18n.mockI18nEnglish(_$httpBackend_);
      _$window_.localStorage['jwtToken'] = 'JWT token';

      $templateCache.put('app/components/general/general.html', '');

    });
  });

  beforeEach(function () {
    /*jshint -W117*/
    generalUtil.mockGetGeneral($httpBackend, urlUtil);
  });

  describe('should enter the route home.settings.general.create', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.go(homeGeneralState);
      $rootScope.$digest();
    });

    it('should transition to general.create', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      $state.transitionTo(homeGeneralState);
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homeGeneralState);
      expect($state.current.url).toEqual('/edit');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homeGeneralState)).toEqual('#/home/settings/general/edit');
    });

  });
});
