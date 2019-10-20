/*jshint -W106 */
describe('RegionEditController', function () {

  var $state, controller, urlUtil, $rootScope, $httpBackend, service, dialogService, regionId = 1, translate;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('regionPrepService', function () {
        regionUtil.mockGetRegion($httpBackend, urlUtil);
        var result;
        service.get(1).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;

      });

      $provide.value('regionPrepTranslateService', function () {
        return {
          SAVE_ID: 'SAVE_ID',
          SAVING_ID: 'SAVING_ID',
          CONFIRM_CANCEL_ID: 'CONFIRM_CANCEL_ID',
          CONFIRM_SAVE_REGION_ID: 'CONFIRM_SAVE_REGION_ID',
          SUCCESS_SAVE_ID: 'SUCCESS_SAVE_ID'
        };
      });
    });
  });

  beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$state_, _urlUtil_, regionPrepService,
                              _regionService_, _dialogService_, regionPrepTranslateService) {
    urlUtil = _urlUtil_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    dialogService = _dialogService_;
    service = _regionService_;
    translate = regionPrepTranslateService;
    mockI18n.mockI18nEnglish($httpBackend);
    controller = _$controller_('RegionController', {regionPrepService: regionPrepService()});
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('should be created successfully', function () {

    it('should be divided controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be divided countries', function () {
      expect(controller.countries).toBeDefined();
    });

    it('should be divided region', function () {
      expect(controller.region).toBeDefined();
    });

    it('should be divided regions', function () {
      expect(controller.regions).toBeDefined();
    });

  });

  describe('countries', function () {

    it('must contain 249 countries', function () {
      expect(controller.countries.length).toEqual(249);
    });

    it('must not contain 10 countries', function () {
      expect(controller.countries.length).not.toEqual(10);
    });

  });

  describe('querySearch', function () {

    it('should filter with lowercase letters', function () {
      expect(controller.querySearch('ba').length).toEqual(4);
    });

    it('should filter with capital letters', function () {
      expect(controller.querySearch('BA').length).toEqual(4);
    });

    it('should filter with capital letters', function () {
      var country = {country_name: 'Canada', country_code: 'CA'};
      expect(controller.querySearch('Canada')[0]).toEqual(country);
    });

  });

  describe('should edit a region', function () {

    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      regionUtil.mockGetRegion($httpBackend, urlUtil);
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.go('home.settings.region.edit', {regionId: regionId});
      $rootScope.$digest();
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('should call save method with success', function () {
      it('should saved region and redirect page', function () {
        regionUtil.mockGetRegionEdit($httpBackend, urlUtil);
        regionUtil.mockGetRegions($httpBackend, urlUtil, 1);
        controller.save();
        $rootScope.$digest();
        $httpBackend.flush();
        expect($state.current.name).toEqual('home.settings.region.list');
        expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.list.html');
      });
    });

    describe('should call save method with success', function () {
      it('should saved region and redirect page', function () {
        regionUtil.mockGetRegionEditFail($httpBackend, urlUtil);
        controller.save();
        $rootScope.$digest();
        $httpBackend.flush();
        expect($state.current.name).toEqual('home.settings.region.edit');
        expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.html');
      });
    });
  });

});
