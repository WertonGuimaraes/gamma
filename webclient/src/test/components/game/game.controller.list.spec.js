/*jshint -W106 */
describe('GameListController', function () {

  var controller, urlUtil, $rootScope, $httpBackend, $state, service;
  var page = 1;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('gamePrepService', function () {
        gameUtil.mockGetGames($httpBackend, urlUtil, page, '');
        var result;
        service.list('', true, 'name', 1).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;
      });
    });
  });

  beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$state_, _urlUtil_, gamePrepService,
                              _gameService_) {
    urlUtil = _urlUtil_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    service = _gameService_;
    var homeCtrl = _$controller_('HomeController');
    var $scope = $rootScope.$new();
    $scope.lastQuery = 'Kart';
    $scope.$parent.homeCtrl = homeCtrl;
    mockI18n.mockI18nEnglish($httpBackend);
    controller = _$controller_('GameControllerList', {$scope: $scope, gamePrepService: gamePrepService()});
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('should be created successfully', function () {

    it('should be defined controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be defined ascendant', function () {
      expect(controller.ascendant).toBeDefined();
      expect(controller.ascendant).toBeTruthy();
    });

    it('should be defined list', function () {
      expect(controller.list).toBeDefined();
      expect(controller.list.length).toEqual(2);
    });

    it('should be name the first selected field', function () {
      expect(controller.checkLastField('name')).toBe('selected');
    });

    it('should be game_service_id not selected', function () {
      expect(controller.checkLastField('game_service_id')).toBe('default');
    });
  });

  describe('getCsvExport', function () {
    var expectHeader = ['ID', 'NAME', 'PACKAGE', 'SERVICE ID', 'API KEY', 'IMAGE'];
    it('should call getCsvExport', function () {
      gameUtil.mockGetGames($httpBackend, urlUtil, 'all', '');
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.gameHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
    it('should call getCsvExport same null object', function () {
      gameUtil.mockGetGamesWithNullElement($httpBackend, urlUtil, 'all', '');
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.gameHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
  });

  describe('orderBy', function () {
    var field = 'name';
    var value = '';
    var page = 1;
    it('should call the server, refresh the list', function () {
      gameUtil.mockOrderByDesc($httpBackend, urlUtil, value, field, page);
      controller.orderBy(field);
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(1);
      expect(controller.ascendant).toBeFalsy();
    });
    it('should call the server, refresh the list', function () {
      gameUtil.mockOrderByDesc($httpBackend, urlUtil, value, 'package_name', page);
      controller.orderBy('package_name');
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(1);
      expect(controller.ascendant).toBeFalsy();
    });
  });

  describe('change', function () {
    it('should call the server, refresh the query list', function () {
      var text = 'zenny';
      gameUtil.mockGetGames($httpBackend, urlUtil, 1, text);
      controller.controllerToolbar.change(text);
      $httpBackend.flush();
      expect(controller.lastQuery).toEqual(text);
      expect(controller.ascendant).toBeTruthy();
      expect(controller.infinityList).toEqual(1);
      expect(controller.list.length).toEqual(2);
    });
  });

  describe('nextList', function () {

    var page = 2;

    it('should responce empty', function () {
      gameUtil.mockGetEmptyGames($httpBackend, urlUtil);
      controller.nextList();
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(2);
      expect(controller.list.length).toEqual(2);
    });

    it('should call the server, refresh the list and infinityList update', function () {
      gameUtil.mockGetGames($httpBackend, urlUtil, page, '');
      controller.nextList();
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(2);
      expect(controller.list.length).toEqual(4);
    });

    it('should not call the server and not refresh the list', function () {
      controller.list.push.apply(controller.list, mockDataGame.getGames().results);
      controller.nextList();
      expect(controller.infinityList).toEqual(1);
      expect(controller.list.length).toEqual(4);
    });
  });

  describe('methods of routes', function () {
    beforeEach(function () {
      page = 1;
      $state.go('home');
      $rootScope.$digest();
      gameUtil.mockGetGames($httpBackend, urlUtil, page, '');
      $state.go('home.game.list');
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should call viewAll', function () {
      controller.controllerToolbar.viewAll();
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.game.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/game/game.list.html');
    });

    it('should call newGame', function () {
      controller.controllerToolbar.new();
      $rootScope.$digest();
      expect($state.current.name).toEqual('home.game.create');
    });
  });

});
