describe('PlayersController', function () {

  var controller, service, urlUtil, $rootScope, $httpBackend, $state;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('playersPrepService', function () {
        playersUtil.mockGetPlayers($httpBackend, urlUtil, '', 1);
        var result;
        service.list('', '', true, 'game__name', 1, '').then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;
      });
    });
  });

  beforeEach(inject(function (_$state_, _$rootScope_, _$controller_, _$httpBackend_, _playerService_, _urlUtil_, playersPrepService) {

    service = _playerService_;
    urlUtil = _urlUtil_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    mockI18n.mockI18nEnglish($httpBackend);
    var homeCtrl = _$controller_('HomeController');
    var $scope = $rootScope.$new();
    $scope.$parent.homeCtrl = homeCtrl;
    controller = _$controller_('PlayersController', {$scope: $scope, playersPrepService: playersPrepService()});

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be created successfully', function () {
    expect(controller).toBeDefined();
  });

  it('should be divided page', function () {
    expect(controller.page).toBeDefined();
    expect(controller.page).toEqual(1);
  });

  it('should be divided list', function () {
    expect(controller.list).toBeDefined();
    expect(controller.list.length).toEqual(1);
  });


  it('should be divided ascendant', function () {
    expect(controller.ascendant).toBeDefined();
    expect(controller.ascendant).toBeTruthy();
  });


  it('should be divided lastQuery', function () {
    expect(controller.lastQuery).toBeDefined();
    expect(controller.lastQuery).toEqual('');
  });

  describe('getCsvExport', function () {
    var expectHeader = ['EMAIL', 'COUNTRY', 'GAME', 'GCM ID', 'GPG ID', 'DATE'];
    it('should call getCsvExport', function () {
      playersUtil.mockGetPlayers($httpBackend, urlUtil, '', 'all');
      controller.getListExport();
      $httpBackend.flush();
      expect(controller.export.playerHeader()).toEqual(expectHeader);
      expect(controller.export.playerFileName()).not.toBe('');
    });
    it('should call getCsvExport same null object', function () {
      playersUtil.mockGetPlayersWithNullElement($httpBackend, urlUtil, '', 'all');
      controller.getListExport();
      $httpBackend.flush();
      expect(controller.export.playerHeader()).toEqual(expectHeader);
      expect(controller.export.playerFileName()).not.toBe('');
    });
  });

  describe('checkLastField', function () {

    it('should return selected', function () {
      expect(controller.checkLastField('game__name')).toEqual('selected');
    });

    it('should return default', function () {
      expect(controller.checkLastField('email')).toEqual('default');
    });

  });

  describe('orderBy', function () {

    it('should call the server, refresh the list', function () {
      playersUtil.mockQuerySearchDesc($httpBackend, urlUtil, 'game__name');
      controller.orderBy('game__name');
      $httpBackend.flush();
      expect(controller.page).toEqual(1);
      expect(controller.ascendant).toBeFalsy();
    });

    it('should call the server, refresh the list', function () {
      playersUtil.mockQuerySearchDesc($httpBackend, urlUtil, 'email');
      controller.orderBy('email');
      $httpBackend.flush();
      expect(controller.page).toEqual(1);
      expect(controller.ascendant).toBeFalsy();
    });

  });

  describe('change', function () {

    it('should filter with lowercase letters', function () {
      var query = 'bra';
      playersUtil.mockGetPlayers($httpBackend, urlUtil, query, 1);
      controller.controllerToolbar.change(query);
      expect(controller.list.length).toEqual(1);
      $httpBackend.flush();
    });

    it('should filter with capital letters', function () {
      var query = 'BRA';
      playersUtil.mockGetPlayers($httpBackend, urlUtil, query, 1);
      controller.controllerToolbar.change(query);
      $httpBackend.flush();
      expect(controller.list.length).toEqual(1);
    });
  });

  describe('lowercaseCountryCode', function () {
    it('should return lowercase', function () {
      expect(controller.lowercaseCountryCode('BR')).toEqual('br');
    });
  });

  describe('filter', function () {
    it('should call server', function () {
      playersUtil.mockGetPlayers($httpBackend, urlUtil, '', 1);
      controller.filter();
      $httpBackend.flush();
      expect(controller.page).toEqual(1);
    });
  });

  describe('nextList', function () {

    it('should call the server, refresh the list and page update', function () {
      var page = 2;
      playersUtil.mockGetPlayers($httpBackend, urlUtil, '', page);
      controller.nextList();
      $httpBackend.flush();
      expect(controller.page).toEqual(2);
      expect(controller.list.length).toEqual(2);
    });

    it('should responce empty', function () {
      var page = 2;
      playersUtil.mockGetEmptyPlayers($httpBackend, urlUtil, '', page);
      controller.nextList();
      $httpBackend.flush();
      expect(controller.page).toEqual(2);
      expect(controller.list.length).toEqual(1);
    });

    it('should not call the server and not refresh the list', function () {
      var page = 2;
      controller.list.push.apply(controller.list, mockData.getMockPlayers().results);
      controller.nextList();
      expect(controller.page).toEqual(1);
      expect(controller.list.length).toEqual(2);
    });
  });

  describe('querySearch regions', function () {
    it('should call search region', function () {
      bannerUtil.mockQueryRegion($httpBackend, urlUtil, 'Brazil');
      var regionResult = controller.querySearchRegion('Brazil');

      regionResult.then(function (data) {
        controller.regions = data;
      });

      $httpBackend.flush();
      $rootScope.$apply();
    });
  });

  describe('querySearch games', function () {
    it('should call search game', function () {
      gameUtil.mockGetGames($httpBackend, urlUtil, 1, 'Zenny');
      var gameResult = controller.querySearchGame('Zenny');

      gameResult.then(function (data) {
        controller.games = data;
      });

      $httpBackend.flush();
      $rootScope.$apply();
    });
  });

  describe('removeGame', function () {
    beforeEach(function () {
      controller.games = mockDataGame.getGames().results;
    });

    it('should remove the second game', function () {
      playersUtil.mockRemoveGame($httpBackend, urlUtil);
      controller.removeGame(controller.games[1]);
      $httpBackend.flush();
    });

  });

  describe('removeRegion', function () {
    beforeEach(function () {
      controller.regions = regionUtil.getRegions().results;
    });

    it('should remove the second game', function () {
      playersUtil.mockRemoveRegion($httpBackend, urlUtil);
      controller.removeRegion(controller.regions[1]);
      $httpBackend.flush();
    });

  });

  describe('methods of routes', function () {

    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      playersUtil.mockGetPlayers($httpBackend, urlUtil, '', 1);
      $state.go('home.players.list');
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should call viewAll', function () {
      controller.controllerToolbar.viewAll();
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.players.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/players/players.list.html');
    });

  });

});