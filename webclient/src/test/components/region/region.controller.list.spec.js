/*jshint -W106 */
describe('RegionListController', function () {

  var $mdDialog, $state, controller, urlUtil, $rootScope, $httpBackend, service;
  var page = 1;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('regionPrepService', function () {
        regionUtil.mockGetRegions($httpBackend, urlUtil, page);
        var result;
        service.list('', true, 'name', 1, false).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;
      });
    });
  });

  beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$mdDialog_, _$state_, _urlUtil_,
                              regionPrepService, _regionService_) {

    $state = _$state_;
    $mdDialog = _$mdDialog_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    service = _regionService_;
    urlUtil = _urlUtil_;
    mockI18n.mockI18nEnglish($httpBackend);
    var homeCtrl = _$controller_('HomeController');
    var $scope = $rootScope.$new();
    $scope.$parent.homeCtrl = homeCtrl;

    controller = _$controller_('RegionControllerList', {
      $scope: $scope,
      regionPrepService: regionPrepService()
    });
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('should be created successfully', function () {

    it('should be divided controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be divided infinityList', function () {
      expect(controller.infinityList).toBeDefined();
      expect(controller.infinityList).toEqual(1);
    });

    it('should be divided list', function () {
      expect(controller.list).toBeDefined();
      expect(controller.list.length).toEqual(4);
    });

  });

  describe('getCsvExport', function () {
    var expectHeader = ['ID', 'NAME', 'COUNTRIES'];
    it('should call getCsvExport', function () {
      regionUtil.mockGetRegions($httpBackend, urlUtil, 'all');
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.regionHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
    it('should call getCsvExport same null object', function () {
      regionUtil.mockGetRegionsWithNullElement($httpBackend, urlUtil, 'all');
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.regionHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
  });

  describe('change', function () {

    it('should filter with lowercase letters', function () {
      var query = 'bra';
      regionUtil.mockChange($httpBackend, urlUtil, query, false);
      controller.controllerToolbar.change(query);
      expect(controller.list.length).toEqual(4);
      $httpBackend.flush();
    });

    it('should filter with capital letters', function () {
      var query = 'BRA';
      regionUtil.mockChange($httpBackend, urlUtil, query, false);
      controller.controllerToolbar.change(query);
      $httpBackend.flush();
      expect(controller.list.length).toEqual(4);
    });
  });

  describe('getCountriesNames', function () {
    var regions = [];
    beforeEach(function () {
      var region01 = {country_name: 'region01'};
      var region02 = {country_name: 'region02'};
      regions[0] = region01;
      regions[1] = region02;
      regions[2] = null;
    });

    it('should return name to game', function () {
      expect(controller.getCountriesNames(regions)).toEqual('region01, region02');
    });
  });

  describe('orderBy', function () {
    it('should call the server, refresh the list', function () {
      regionUtil.mockGetOrderRegions($httpBackend, urlUtil, 1, '-name');
      controller.orderBy('name');
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(1);
      expect(controller.ascendant).toBeFalsy();
    });
    it('should call the server, refresh the list', function () {
      regionUtil.mockGetOrderRegions($httpBackend, urlUtil, 1, '-modified_date');
      controller.orderBy('modified_date');
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(1);
      expect(controller.ascendant).toBeFalsy();
    });
  });

  describe('checkLastField', function () {
    it('should return selected', function () {
      expect(controller.checkLastField('name')).toEqual('selected');
    });
    it('should return default', function () {
      expect(controller.checkLastField('modified_date')).toEqual('default');
    });
  });

  describe('lowercaseCountryCode', function () {
    it('should return lowercase', function () {
      expect(controller.lowercaseCountryCode('BR')).toEqual('br');
    });
  });

  describe('showDialog', function () {

    var dialogCtrl;

    beforeEach(function () {
      var region = {id: 1, name: 'Name 0', countries: [{country_name: 'Brazil', country_code: 'BR'}]};
      dialogCtrl = controller.showDialog({}, region);
      dialogCtrl = dialogCtrl.dialogController($mdDialog);
    });

    it('should call cancel function by dialogCtrl', function () {
      spyOn(dialogCtrl, 'cancel').and.callThrough();
      dialogCtrl.cancel();
      expect(dialogCtrl.cancel).toHaveBeenCalled();
    });

  });

  describe('methods of routes', function () {
    beforeEach(function () {
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      regionUtil.mockGetRegions($httpBackend, urlUtil, 1);
      $state.go('home.settings.region.list');
      $rootScope.$digest();
      $httpBackend.flush();
    });

    it('should call viewAll', function () {
      controller.controllerToolbar.viewAll();
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.settings.region.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.list.html');
    });

    it('should call newRegion', function () {
      controller.controllerToolbar.new();
      $rootScope.$digest();
      expect($state.current.name).toEqual('home.settings.region.create');
    });
  });

  it('should not call the server and not refresh the list', function () {
    controller.list.push.apply(controller.list, regionUtil.getRegions().results);
    controller.nextList();
    expect(controller.infinityList).toEqual(1);
    expect(controller.list.length).toEqual(8);
  });

  describe('nextList', function () {
    beforeEach(function () {
      page = 2;
    });

    it('should call the server, refresh the list and infinityList update', function () {
      regionUtil.mockGetRegions($httpBackend, urlUtil, 2);
      controller.nextList();
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(2);
      expect(controller.list.length).toEqual(8);
    });

  });
});
