describe('BannerController.create', function () {

  var controller, urlUtil, $rootScope, $httpBackend, $state, dialogService, fileUploadService;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('bannerPrepService', function () {
        return {
          regions: [],
          banners: [],
          games: []
        };
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
                     _$window_, _fileUploadService_, bannerPrepService, _bannerPrepTranslateService_) {

      urlUtil = _urlUtil_;
      $httpBackend = _$httpBackend_;
      fileUploadService = _fileUploadService_;
      $state = _$state_;
      dialogService = _dialogService_;
      $rootScope = _$rootScope_;
      mockI18n.mockI18nEnglish($httpBackend);
      controller = _$controller_('BannerController', {
        bannerPrepService: bannerPrepService(),
        bannerPrepTranslateService: _bannerPrepTranslateService_
      });
      $httpBackend.flush();
      _$window_.localStorage['jwtToken'] = 'JWT token';
    }));

  describe('should be created successfully', function () {
    it('should be created controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be defined games', function () {
      expect(controller.games).toBeDefined();
      expect(controller.games.length).toBe(0);
    });

    it('should be defined regions', function () {
      expect(controller.regions).toBeDefined();
      expect(controller.regions.length).toBe(0);
    });
  });

  describe('image fields', function () {

    describe('should success in upload a image', function () {

      beforeEach(function () {
        controller.banner.banners = [];
        sinon.stub(fileUploadService, 'uploadFileToUrl', function (folder, imageLink, file, uploadUrl,
                                                                   success, error, progress) {

          var response = {data: 'http://asus.com/zenny.jpeg'};
          var evt = {loaded: 1, total: 1};

          success(response);
          progress(evt);
        });
      });

      /*jshint -W106*/
      it('should call verifyImageType function', function () {
        controller.image_url = 'www.asus.com/image.jpg';
        controller.target_url = 'www.asus.com';
        controller.verifyImageType();
        expect(controller.banner.banners.length).toBe(1);
        expect(controller.banner.banners[0].image_url).toBe('www.asus.com/image.jpg');
        expect(controller.banner.banners[0].target_url).toBe('www.asus.com');
        expect(controller.image_url).toBe('');
        expect(controller.target_url).toBe('');
      });

      it('should upload a image and return URL', function () {

        controller.target_url = 'www.asus.com';
        controller.image = {name: '20182943235768.jpg', size: 92071, type: 'image/jpeg'};
        controller.verifyImageType();
        expect(controller.banner.banners.length).toBe(1);
        expect(controller.banner.banners[0].image_url).toBe('http://asus.com/zenny.jpeg');
        expect(controller.banner.banners[0].target_url).toBe('www.asus.com');
        expect(controller.image_url).toBe('');
        expect(controller.target_url).toBe('');

        controller.image = {name: '20182943235768', size: 92071, type: 'image/jpeg'};
        controller.verifyImageType();
        expect(controller.banner.banners.length).toBe(2);
        expect(controller.banner.banners[0].image_url).toBe('http://asus.com/zenny.jpeg');
        expect(controller.banner.banners[0].target_url).toBe('www.asus.com');
        expect(controller.image_url).toBe('');
        expect(controller.target_url).toBe('');
      });
    });

    describe('should fail in upload a image', function () {

      beforeEach(function () {
        sinon.stub(fileUploadService, 'uploadFileToUrl', function (folder, imageLink, file, uploadUrl,
                                                                   success, error, progress) {

          var evt = {loaded: 1, total: 1};
          error();
          progress(evt);
        });
      });

      it('should fail in upload a image', function () {
        controller.image = {name: '20182943235768.jpg', size: 92071, type: 'image/jpeg'};
        controller.verifyImageType();
        expect(controller.loadingImage).toBeFalsy();
      });
    });

  });

  /*jshint -W106*/
  describe('should add and remove urls', function () {
    it('should add', function () {
      expect(controller.banner.banners).toBeDefined();
      expect(controller.banner.banners.length).toBe(0);
      controller.image_url = 'http://asus.com/zenny.png';
      controller.target_url = 'http://asus.com';
      controller.addUrls();
      expect(controller.banner.banners.length).toBe(1);
    });

    it('should remove', function () {
      expect(controller.banner.banners).toBeDefined();
      var url = {
        image_url: 'http://asus.com/zenny.png',
        target_url: 'http://asus.com'
      };
      controller.banner.banners = [url];
      expect(controller.banner.banners.length).toBe(1);
      controller.removeUrl(url);
      expect(controller.banner.banners.length).toBe(0);
    });
  });

  describe('banner fields', function () {
    var validBanner, validGames, validUrls, validRegions, validCampaigns;

    beforeEach(function () {
      validBanner = bannerUtil.getMockValidBanner();
      validGames = bannerUtil.getMockValidGames();
      validUrls = bannerUtil.getMockValidUrls();
      validRegions = bannerUtil.getMockValidRegions();
      validCampaigns = bannerUtil.getMockValidCampaigns();
    });

    describe('should be able and disable', function () {
      it('should be disabled', function () {
        expect(controller.banner).toBeDefined();
        expect(controller.disable()).toBeTruthy();
      });

      it('should not be disabled', function () {
        controller.banner = validBanner;
        controller.banner.regions = validRegions;
        controller.banner.games = validGames;
        controller.banner.banners = validUrls;
        controller.banner.campaigns = validCampaigns;
        expect(controller.disable()).toBeFalsy();
      });

      it('should be disabled urls add', function () {
        expect(controller.disableUrls()).toBeTruthy();
      });

      /*jshint -W106*/
      it('should not be disabled urls', function () {
        controller.image_url = 'http://asus.com/zenny.png';
        controller.target_url = 'http://asus.com';
        controller.name = 'default name';
        expect(controller.disableUrls()).toBeFalsy();
      });
    });

    describe('should create a banner', function () {

      beforeEach(function () {
        sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
          funcCallBack();
        });
        $state.go('home');
        $rootScope.$digest();
        $state.go('home.banner.create');
        $rootScope.$digest();
      });

      afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      describe('should call save method with success', function () {
        it('should saved banner and redirect page', function () {
          bannerUtil.mockGetBannerCreate($httpBackend, urlUtil);
          bannerUtil.mockGetBanners($httpBackend, urlUtil, 1);
          controller.save();
          $rootScope.$digest();
          $httpBackend.flush();
          expect($state.current.name).toEqual('home.banner.list');
          expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.list.html');
        });
      });

      describe('should call save method with success', function () {
        it('should saved banner and redirect page', function () {
          bannerUtil.mockGetBannerCreateFail($httpBackend, urlUtil);
          controller.save();
          $rootScope.$digest();
          $httpBackend.flush();
          expect($state.current.name).toEqual('home.banner.create');
          expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.html');
        });
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
  });


  describe('querySearch campaigns', function () {
    it('should call search campaigns', function () {
      bannerUtil.mockQueryCampaign($httpBackend, urlUtil, 'Campaign');
      var campaignResult = controller.querySearchCampaign('Campaign');

      campaignResult.then(function (data) {
        controller.campaigns = data;
      });

      $httpBackend.flush();
      $rootScope.$apply();
    });
  });

  describe('cancel', function () {
    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.banner.create');
      $rootScope.$digest();
    });
    it('should call the redirectState callback function', function () {
      bannerUtil.mockGetBanners($httpBackend, urlUtil, 1);
      controller.cancel(null);
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.banner.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/banner/banner.list.html');
    });
  });

  describe('hasDuplicatesCountriesInRegions', function () {
    it('should call hasDuplicatesCountriesInRegions function without regions', function () {
      expect(controller.hasDuplicatesCountriesInRegions(0)).toBeFalsy();
    });

    it('should call hasDuplicatesCountriesInRegions function with regions', function () {
      controller.banner.regions = bannerUtil.getMockValidRegions();
      expect(controller.hasDuplicatesCountriesInRegions(0)).toBeFalsy();
    });

    it('should call hasDuplicatesCountriesInRegions function with regions and regions duplicate', function () {
      controller.banner.regions = bannerUtil.getMockDuplicateRegions();
      expect(controller.hasDuplicatesCountriesInRegions(0)).toBeTruthy();
    });
  });

  describe('countryNamesFromRegions', function () {
    it('shorld call countryNamesFromRegions function and return empty', function () {
      controller.country_names = [];
      expect(controller.countryNamesFromRegions([])).toBe(controller.country_names);
    });
  });

  describe('imageNotFound', function () {

    it('should call imageNotFound function', function () {
      spyOn(controller, 'imageNotFound').and.callThrough();
      controller.imageNotFound();
      expect(controller.imageNotFound).toHaveBeenCalled();
    });

  });

  describe('changeImageUrl', function () {

    it('should call changeImageUrl function', function () {
      spyOn(controller, 'changeImageUrl').and.callThrough();
      controller.image_url = 'http://asus.com/zenny.png';
      controller.changeImageUrl();
      expect(controller.changeImageUrl).toHaveBeenCalled();
      expect(controller.viewImage).toBe(controller.image_url);
    });

  });

  describe('changeUpload', function () {

    it('should call changeUpload function', function () {
      spyOn(controller, 'changeUpload').and.callThrough();
      controller.image = {name: '20182943235768.jpg', size: 92071, type: 'image/jpeg'};
      controller.changeUpload();
      expect(controller.changeUpload).toHaveBeenCalled();
      expect(controller.viewImage).toBe(controller.image);
      expect(controller.image_url).toBe(controller.image.name);
    });

  });

});
