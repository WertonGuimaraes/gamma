/*jshint -W106 */
describe('RegionCreateController', function () {

  var $state, service, controller, urlUtil, $rootScope, $httpBackend, dialogService, countryService, translate;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('regionPrepService', function () {
        return {
          color: '#FF6E40',
          countries: []
        };
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

  beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$state_, _urlUtil_, _regionService_,
                              _dialogService_, _countryService_, regionPrepTranslateService) {
    urlUtil = _urlUtil_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    dialogService = _dialogService_;
    countryService = _countryService_;
    service = _regionService_;
    translate = regionPrepTranslateService;
    mockI18n.mockI18nEnglish($httpBackend);

    var countries = {
      AF: {code: 'AF', name: 'Afghanistan'},
      AX: {code: 'AX', name: 'Åland Islands'},
      AL: {code: 'AL', name: 'Albania'},
      DZ: {code: 'DZ', name: 'Algeria'},
      CA: {code: 'CA', name: 'Canada'},
      BA: {code: 'BA', name: 'Bosnia and Herzegovina'},
      BR: null
    };
    spyOn(countryService, 'getAll').and.returnValue(countries);


    controller = _$controller_('RegionController');

  }));

  it('should be created successfully', function () {
    expect(controller).toBeDefined();
  });

  describe('countries', function () {

    it('must contain 249 countries', function () {
      expect(controller.countries.length).toEqual(6);
    });

    it('must not contain 10 countries', function () {
      expect(controller.countries.length).not.toEqual(10);
    });

  });

  describe('querySearch', function () {

    it('should filter with lowercase letters', function () {
      expect(controller.querySearch(null)).toEqual([]);
    });

    it('should filter with lowercase letters', function () {
      expect(controller.querySearch('bo').length).toEqual(1);
    });

    it('should filter with capital letters', function () {
      expect(controller.querySearch('BO').length).toEqual(1);
    });

    it('should filter with capital letters', function () {
      var country = {country_name: 'Canada', country_code: 'CA'};
      expect(controller.querySearch('Canada')[0]).toEqual(country);
    });

  });

  describe('cancel', function () {
    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.go('home.settings.region.create');
      $rootScope.$digest();
    });
    it('should call the redirectState callback function', function () {
      regionUtil.mockGetRegions($httpBackend, urlUtil, 1);
      controller.cancel(null);
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.settings.region.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.list.html');
    });
  });

  describe('should be able and disable', function () {
    it('should be disabled', function () {
      controller.region = {};
      expect(controller.disabled()).toBeTruthy();
    });
    it('should not be disabled', function () {
      controller.regions = regionUtil.getRegions();
      controller.region = {
        id: 1, name: 'Name 0', color: '#FFFFF', countries: [{country_name: 'Brazil', country_code: 'BR'}]
      };
      expect(controller.disabled()).toBeFalsy();
    });
  });

  describe('save', function () {

    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.settings');
      $rootScope.$digest();
      $state.go('home.settings.region.create');
      $rootScope.$digest();
    });

    describe('should call saveRegion function', function () {
      it('should call saveRegion function with success', function () {
        regionUtil.mockGetRegionCreate($httpBackend, urlUtil);
        controller.save();
        $httpBackend.flush();
      });
    });

    describe('should call save method with success', function () {
      beforeEach(function () {
        sinon.stub($state.current.data, 'save', function (regionService, region, saveSuccess, saveError) {
          saveSuccess({});
        });
      });

      it('should saved region and redirect page', function () {
        regionUtil.mockGetRegions($httpBackend, urlUtil, 1);
        controller.save();
        $httpBackend.flush();
        expect($state.current.name).toEqual('home.settings.region.list');
        expect($state.current.views[''].templateUrl).toEqual('app/components/region/region.list.html');
      });
    });

    describe('should call save method with fail', function () {
      beforeEach(function () {
        sinon.stub($state.current.data, 'save', function (regionService, region, saveSuccess, saveError) {
          saveError();
        });
      });
      it('should call saveError function', function () {
        controller.save();
        expect(controller.buttonSave).toBeFalsy();
        expect(controller.buttonText).toBe(translate.SAVE_ID);
      });
    });
  });
});
