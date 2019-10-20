/*jshint -W106*/
describe('GameController.create', function () {

  var $state, controller, urlUtil, $rootScope, $httpBackend, validGame, fileUploadService, dialogService, translate;
  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('gamePrepServiceCreate', function () {
        /*jshint -W106*/
        return {
          form_template: {
            selected: null,
            templates: [
              {type: 'item', id: 2, name: 'attribute'},
              {type: 'container', id: 1, columns: [[]], name: 'feature'}
            ],
            dropzones: {
              'root': []
            }
          }
        };
      });

      $provide.value('gamePrepTranslateService', function () {
        return {
          CONFIRM_SAVE_GAME_ID: 'CONFIRM_SAVE_GAME_ID',
          SAVE_ID: 'SAVE_ID',
          SAVING_ID: 'SAVING_ID',
          CONFIRM_CANCEL_ID: 'CONFIRM_CANCEL_ID',
          UPLOAD_ID: 'UPLOAD_ID',
          ERROR_UPLOAD_IMAGE_ID: 'ERROR_UPLOAD_IMAGE_ID',
          GAME_DIALOG_ID: 'GAME_DIALOG_ID',
          CLOSE_ID: 'CLOSE_ID',
          SUCCESS_SAVE_ID: 'SUCCESS_SAVE_ID',
          FEATURE_MUST_CONTAIN_ATTRIBUTE_ID: 'FEATURE_MUST_CONTAIN_ATTRIBUTE_ID',
          ATTRIBUTE_CANNOT_HAVE_SAME_NAME_ID: 'ATTRIBUTE_CANNOT_HAVE_SAME_NAME_ID'
        };
      });
    });
  });

  beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$state_, _urlUtil_, gamePrepServiceCreate,
                              gamePrepTranslateService, _fileUploadService_, _dialogService_) {
    $state = _$state_;
    urlUtil = _urlUtil_;
    dialogService = _dialogService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    fileUploadService = _fileUploadService_;
    translate = gamePrepTranslateService;
    mockI18n.mockI18nEnglish($httpBackend);
    controller = _$controller_('GameController', {gamePrepService: gamePrepServiceCreate,
                                                  gamePrepServiceTranslate: gamePrepTranslateService});
    $httpBackend.flush();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('should be created successfully', function () {
    it('should be created controller', function () {
      expect(controller).toBeDefined();
    });
    it('should be defined game', function () {
      expect(controller.game).toBeDefined();
    });
  });

  describe('save', function () {

    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.game.create');
      $rootScope.$digest();
    });

    describe('should call saveGame function', function () {
      it('should call saveGame function with success', function () {
        gameUtil.mockGetGameCreate($httpBackend, urlUtil);
        controller.save();
        $httpBackend.flush();
      });
    });

    describe('should call save method with success', function () {
      beforeEach(function () {
        sinon.stub($state.current.data, 'save', function (gameService, game, saveSuccess, saveError) {
          saveSuccess({});
        });
      });

      it('should saved game and redirect page', function () {
        gameUtil.mockGetGames($httpBackend, urlUtil, 1, '');
        controller.save();
        $httpBackend.flush();
        expect($state.current.name).toEqual('home.game.list');
        expect($state.current.views[''].templateUrl).toEqual('app/components/game/game.list.html');
      });
    });

    describe('should call save method with fail', function () {
      beforeEach(function () {
        sinon.stub($state.current.data, 'save', function (gameService, game, saveSuccess, saveError) {
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

  describe('image fields', function () {

    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.game.create');
      $rootScope.$digest();
    });

    describe('should success in upload a image', function () {

      beforeEach(function () {
        sinon.stub(fileUploadService, 'uploadFileToUrl', function (folder, imageLink, file, uploadUrl,
                                                                   success, error, progress) {

          var response = {data: 'http://asus.com/zenny.jpeg'};
          var evt = {loaded: 1, total: 1};

          success(response);
          progress(evt);
        });
      });

      it('should upload a image and return URL', function () {

        controller.image = {name: '20182943235768.jpg', size: 92071, type: 'image/jpeg'};
        gameUtil.mockGetGameCreate($httpBackend, urlUtil);
        controller.save();
        $httpBackend.flush();
        expect(controller.game.game_image).toBe('http://asus.com/zenny.jpeg');

        controller.image = {name: '20182943235768', size: 92071, type: 'image/jpeg'};
        gameUtil.mockGetGameCreate($httpBackend, urlUtil);
        controller.save();
        $httpBackend.flush();
        expect(controller.game.game_image).toBe('http://asus.com/zenny.jpeg');
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
        controller.save();
      });
    });

  });

  describe('should be able and disable', function () {
    it('should be disabled', function () {
      expect(controller.game).toBeDefined();
      expect(controller.disabled()).toBeTruthy();
    });

    it('should not be disabled', function () {
      validGame = mockDataGame.mockGetValidGame();
      expect(controller.game).toBeDefined();
      controller.game = validGame;
      controller.structure = controller.game.form_template;
      controller.viewImage = [{lfFile: {name: '20182943235768.jpg', size: 92071, type: 'image/jpeg'}}];
      expect(controller.disabled()).toBeFalsy();
    });
  });

  describe('validateStructure', function () {
    /*jshint -W106*/
    beforeEach(function () {
      controller.game = mockDataGame.mockGetValidGame();
      controller.viewImage = [{lfFile: {name: '20182943235768.jpg', size: 92071, type: 'image/jpeg'}}];
      controller.validate = '';
    });
    it('should to validate structure with success', function () {
      controller.structure = controller.game.form_template;
      expect(controller.disabled()).toBeFalsy();
      expect(controller.validate).toBe('');
    });
    it('should return false because structure without attribute', function () {
      controller.structure = mockDataGame.mockStructureFeatureWithoutAttribute();
      expect(controller.disabled()).toBeTruthy();
      expect(controller.validate).toBe(translate.FEATURE_MUST_CONTAIN_ATTRIBUTE_ID);
    });
    it('should return false because structure with id undefined', function () {
      controller.structure = mockDataGame.mockStructureFeatureWithIdUndefined();
      expect(controller.disabled()).toBeTruthy();
    });
    it('should return false because structure with same name', function () {
      controller.structure = mockDataGame.mockStructureFeatureOrAttributeWithSameName();
      expect(controller.disabled()).toBeTruthy();
      expect(controller.validate).toBe(translate.ATTRIBUTE_CANNOT_HAVE_SAME_NAME_ID);
    });
  });

  describe('clearImage', function () {
    it('should call clearImage function', function () {
      /*jshint -W106*/
      spyOn(controller, 'clearImage').and.callThrough();
      controller.clearImage();
      expect(controller.clearImage).toHaveBeenCalled();
      expect(controller.viewImage).toBeNull();
      expect(controller.image).toBeNull();
      expect(controller.game.game_image).toBe('');
      expect(controller.showProgress).toBeFalsy();
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
    /*jshint -W106*/
    it('should call changeImageUrl function', function () {
      spyOn(controller, 'changeImageUrl').and.callThrough();
      controller.game.game_image = 'http://asus.com/zenny.png';
      controller.changeImageUrl();
      expect(controller.changeImageUrl).toHaveBeenCalled();
      expect(controller.viewImage).toBe(controller.game.game_image);
    });

  });

  describe('changeUpload', function () {
    /*jshint -W106*/
    it('should call changeUpload function', function () {
      spyOn(controller, 'changeUpload').and.callThrough();
      controller.image = {name: '20182943235768.jpg', size: 92071, type: 'image/jpeg'};
      controller.changeUpload();
      expect(controller.changeUpload).toHaveBeenCalled();
      expect(controller.viewImage).toBe(controller.image);
      expect(controller.game.game_image).toBe(controller.image.name);
    });
  });

  describe('cancel', function () {
    beforeEach(function () {
      sinon.stub(dialogService, 'showConfirm', function (ev, msn, funcCallBack) {
        funcCallBack();
      });
      $state.go('home');
      $rootScope.$digest();
      $state.go('home.game.create');
      $rootScope.$digest();
    });
    it('should call the redirectState callback function', function () {
      gameUtil.mockGetGames($httpBackend, urlUtil, 1, '');
      controller.cancel(null);
      $rootScope.$digest();
      $httpBackend.flush();
      expect($state.current.name).toEqual('home.game.list');
      expect($state.current.views[''].templateUrl).toEqual('app/components/game/game.list.html');
    });
  });

});
