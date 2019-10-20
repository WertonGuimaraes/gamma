describe('PushControllerList', function () {

  var controller, service, urlUtil, $rootScope, $httpBackend, $state, dialogService, $mdDialog, playerService;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('pushPrepService', function () {
        pushUtil.mockGetListPush($httpBackend, urlUtil, 'data', 1, '');
        var result;
        service.list('', true, 'data', 1).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;

      });
    });
  });

  beforeEach(inject(function (_$state_, _$rootScope_, _$controller_, _$httpBackend_, _$mdDialog_, _pushService_,
                              _urlUtil_, pushPrepService, _dialogService_, _playerService_) {

    service = _pushService_;
    urlUtil = _urlUtil_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    dialogService = _dialogService_;
    $mdDialog = _$mdDialog_;
    playerService = _playerService_;
    mockI18n.mockI18nEnglish($httpBackend);

    var homeCtrl = _$controller_('HomeController');
    var $scope = $rootScope.$new();
    $scope.$parent.homeCtrl = homeCtrl;

    controller = _$controller_('PushControllerList', {
      $scope: $scope,
      pushPrepService: pushPrepService()
    });

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

  describe('getCsvExport', function () {
    var expectHeader = ['ID', 'DATE', 'DATA', 'QUERY', 'SEND SUCCESS'];
    it('should call getCsvExport', function () {
      pushUtil.mockGetListPush($httpBackend, urlUtil, 'data', 'all', '');
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.pushHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
    it('should call getCsvExport same null object', function () {
      pushUtil.mockGetListPushWithNullElement($httpBackend, urlUtil, 'data', 'all', '');
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.pushHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
  });

  describe('change', function () {

    it('should filter with lowercase letters', function () {
      var query = 'zix';
      pushUtil.mockGetListPush($httpBackend, urlUtil, 'data', 1, query);
      controller.controllerToolbar.change(query);
      expect(controller.list.length).toEqual(1);
      $httpBackend.flush();
    });

    it('should filter with capital letters', function () {
      var query = 'ZIX';
      pushUtil.mockGetListPush($httpBackend, urlUtil, 'data', 1, query);
      controller.controllerToolbar.change(query);
      $httpBackend.flush();
      expect(controller.list.length).toEqual(1);
    });
  });

  describe('orderBy', function () {
    it('should call the server, refresh the list', function () {
      pushUtil.mockGetListPush($httpBackend, urlUtil, '-data', 1, '');
      controller.orderBy('data');
      $httpBackend.flush();
      expect(controller.page).toEqual(1);
      expect(controller.ascendant).toBeFalsy();
    });
    it('should call the server, refresh the list', function () {
      pushUtil.mockGetListPush($httpBackend, urlUtil, '-modified_date', 1, '');
      controller.orderBy('modified_date');
      $httpBackend.flush();
      expect(controller.page).toEqual(1);
      expect(controller.ascendant).toBeFalsy();
    });
  });

  describe('checkLastField', function () {
    it('should return selected', function () {
      expect(controller.checkLastField('data')).toEqual('selected');
    });
    it('should return default', function () {
      expect(controller.checkLastField('modified_date')).toEqual('default');
    });
  });

  describe('nextList', function () {

    var page = 2;

    it('should call the server, refresh the list and page update', function () {
      pushUtil.mockGetListPush($httpBackend, urlUtil, 'data', page, '');
      controller.nextList();
      $httpBackend.flush();
      expect(controller.page).toEqual(2);
      expect(controller.list.length).toEqual(2);
    });

    it('should not call the server', function () {
      var page = 2;
      controller.list = mockDataPush.getListPush();
      controller.nextList();
      expect(controller.page).toEqual(1);
      expect(controller.list.length).toEqual(5);
    });

    it('should responce empty', function () {
      pushUtil.mockGetEmptyListPush($httpBackend, urlUtil, page);
      controller.nextList();
      $httpBackend.flush();
      expect(controller.page).toEqual(2);
      expect(controller.list.length).toEqual(1);
    });

  });

  describe('methods of routes', function () {
    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      pushUtil.mockGetListPush($httpBackend, urlUtil, 'data', 1, '');
      $state.go('home.push.list');
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should call viewAll', function () {
      controller.controllerToolbar.viewAll();
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.push.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/push/push.list.html');
    });

    it('should call newPush', function () {
      controller.controllerToolbar.new();
      $rootScope.$digest();
      expect($state.current.name).toEqual('home.push.create');
    });
  });

});
