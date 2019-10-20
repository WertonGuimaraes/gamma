/*jshint -W106 */
describe('BannerController.edit', function () {

  var controller, urlUtil, $rootScope, $httpBackend, service, $state, fileUploadService, dialogService, bannerId = 1;
  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('bannerPrepService', function () {
        bannerUtil.mockGetBanner($httpBackend, urlUtil);
        var result;
        service.get(bannerId).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;

      });
      $provide.value('bannerPrepTranslateService', function () {
        return {
          INFO_END_DATE_MAJOR_CAMPAIGN_ID: 'INFO_END_DATE_MAJOR_CAMPAIGN_ID',
          CAMPAIGN_ID: 'CAMPAIGN_ID',
          VALIDATE_CHECKBOX_CAMPAIGN_DATES_ID: 'VALIDATE_CHECKBOX_CAMPAIGN_DATES_ID',
          OK_ID: 'OK_ID',
          REGION_ID: 'REGION_ID',
          OTHER_REGION_ADDED_ALREADY_ID: 'OTHER_REGION_ADDED_ALREADY_ID',
          SUCCESS_SAVE_ID: 'SUCCESS_SAVE_ID',
          CONFIRM_SAVE_ID: 'CONFIRM_SAVE_ID',
          SAVING_ID: 'SAVING_ID',
          SAVE_ID: 'SAVE_ID',
          UPLOAD_ID: 'UPLOAD_ID',
          ERROR_UPLOAD_IMAGE_ID: 'ERROR_UPLOAD_IMAGE_ID',
          BANNER_DIALOG_ID: 'BANNER_DIALOG_ID',
          CLOSE_ID: 'CLOSE_ID',
          CONFIRM_CANCEL_ID: 'CONFIRM_CANCEL_ID'
        };
      });
    });
  });

  beforeEach(
    inject(function (_$state_, _$rootScope_, _$controller_, _$httpBackend_, _urlUtil_, _dialogService_,
                     _$window_, _fileUploadService_, bannerPrepService, _bannerService_, _bannerPrepTranslateService_) {

      $httpBackend = _$httpBackend_;
      $state = _$state_;
      $rootScope = _$rootScope_;
      urlUtil = _urlUtil_;
      service = _bannerService_;
      fileUploadService = _fileUploadService_;
      dialogService = _dialogService_;
      mockI18n.mockI18nEnglish($httpBackend);
      controller = _$controller_('BannerController', {
        bannerPrepService: bannerPrepService(),
        bannerPrepTranslateService: _bannerPrepTranslateService_
      });
      _$window_.localStorage['jwtToken'] = 'JWT token';

    }));

  describe('should be created successfully', function () {
    it('should be created controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be defined games', function () {
      expect(controller.games).toBeDefined();
      expect(controller.games.length).toBe(1);
    });

    it('should be defined regions', function () {
      expect(controller.regions).toBeDefined();
      expect(controller.regions.length).toBe(1);
    });
  });

  describe('banner fields', function () {
    var validBanner, validGames, validUrls, validRegions;

    beforeEach(function () {
      validBanner = bannerUtil.getMockValidBanner();
      validGames = bannerUtil.getMockValidGames();
      validUrls = bannerUtil.getMockValidUrls();
      validRegions = bannerUtil.getMockValidRegions();
    });

    describe('should be able and disable', function () {
      it('should be disabled', function () {
        expect(controller.banner).toBeDefined();
        expect(controller.disable()).toBeFalsy();
      });
    });

    describe('should edit a banner', function () {

      beforeEach(function () {
        sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
          funcCallBack();
        });
        bannerUtil.mockGetBanner($httpBackend, urlUtil, bannerId);
        $state.go('home');
        $rootScope.$digest();
        $state.go('home.banner.edit', {bannerId: bannerId});
        $rootScope.$digest();
        $httpBackend.flush();
      });

      afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      describe('should call save method with success', function () {
        it('should saved banner and redirect page', function () {
          bannerUtil.mockGetBannerEdit($httpBackend, urlUtil);
          bannerUtil.mockGetBanners($httpBackend, urlUtil, bannerId);
          controller.save();
          $rootScope.$digest();
          $httpBackend.flush();
          expect($state.current.name).toEqual('home.banner.list');
          expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.list.html');
        });
      });

      describe('should call save method with success', function () {
        it('should saved banner and redirect page', function () {
          bannerUtil.mockGetBannerEditFail($httpBackend, urlUtil);
          controller.save();
          $rootScope.$digest();
          $httpBackend.flush();
          expect($state.current.name).toEqual('home.banner.edit');
          expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.html');
        });
      });
    });
  });
});
