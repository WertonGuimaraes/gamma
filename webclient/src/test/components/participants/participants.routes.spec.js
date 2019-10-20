describe('ParticipantsRoutes', function () {

  var $scope, $rootScope, $state, $injector, $httpBackend, urlUtil,
    homePaticipantsState = 'home.campaign.participants';

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

      $templateCache.put('app/components/participants/participants.list.html', '');

    });
  });

  beforeEach(function () {
    participantsUtil.mockGetParticipants($httpBackend, urlUtil, '', 1);
  });

  describe('should set participantsPrepService and enter the route home.participants.list', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homePaticipantsState);
      $rootScope.$digest();
      $httpBackend.flush(); //mock and set participantsPrepService
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should transition to participants', function () {
      $state.go('home');
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
      participantsUtil.mockGetCampaignParticipants($httpBackend, urlUtil, '', 1);
      $state.transitionTo(homePaticipantsState, {campaignId: 1});
      $rootScope.$apply();
      $httpBackend.flush();
      expect($state.current.name).toBe(homePaticipantsState);
      expect($state.current.url).toEqual('/{campaignId:[0-9]*}/participants/');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('should respond to URL', function () {
      expect($state.href(homePaticipantsState, {campaignId: 1})).toEqual('#/home/campaign/1/participants/');
    });

    it('renders the participants.list.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/participant/participant.list.html');
    });

    it('uses the ParticipantsController controller', function () {
      expect($state.current.views[''].controller).toEqual('ParticipantsController');
    });

  });

  describe('should not set participantsPrepService and should not enter the route home.participants', function () {

    /* participantsPrepService does not set why not call $httpBackend.flush(); */
    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go(homePaticipantsState);
      $rootScope.$digest();
    });

    it('should not transition to participants', function () {
      $state.go('home');
      $rootScope.$digest();
      $state.transitionTo(homePaticipantsState);
      $rootScope.$apply();
      expect($state.current.name).toBe('home');
      expect($state.current.url).toEqual('/home');
    });

    it('should be state toBeDefined', function () {
      expect($state.current).toBeDefined();
    });

    it('renders the home.html page', function () {
      expect($state.current.views[''].templateUrl).toEqual('app/components/home/home.html');
      expect($state.current.views[''].templateUrl).not.toEqual('app/components/participants/participants.list.html');
    });

    it('should have undefined controller', function () {
      expect($state.current.controller).toBeUndefined();
    });
  });

});
