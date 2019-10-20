/*jshint -W106 */
describe('GameController.edit', function () {

  var $state, controller, urlUtil, $rootScope, $httpBackend, service, fileUploadService, dialogService, gameId = 1,
    homeGameState = 'home.game.edit', translate;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('gamePrepServiceEdit', function () {
        gameUtil.mockGetGame($httpBackend, urlUtil);
        var result;
        service.get(1).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;

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
  /*jshint -W072 */
  beforeEach(inject(function (_$rootScope_, _$controller_, _$state_, _$httpBackend_, _$window_, _urlUtil_,
                              gamePrepServiceEdit, gamePrepTranslateService, _fileUploadService_, _gameService_,
                              _dialogService_) {

    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    dialogService = _dialogService_;
    urlUtil = _urlUtil_;
    service = _gameService_;
    fileUploadService = _fileUploadService_;
    translate = gamePrepTranslateService;
    mockI18n.mockI18nEnglish($httpBackend);
    controller = _$controller_('GameController', {gamePrepService: gamePrepServiceEdit(),
                                                  gamePrepServiceTranslate: gamePrepTranslateService});

    _$window_.localStorage['jwtToken'] = 'JWT token';
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('should be created successfully', function () {

    it('should be defined controller', function () {
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
      gameUtil.mockGetGame($httpBackend, urlUtil);
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeGameState, {gameId: gameId});
      $rootScope.$digest();
      $httpBackend.flush();
    });

    describe('should call saveGame function', function () {
      it('should call saveGame function with success', function () {
        gameUtil.mockGetGameEdit($httpBackend, urlUtil);
        gameUtil.mockGetGames($httpBackend, urlUtil, 1, '');
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
      gameUtil.mockGetGame($httpBackend, urlUtil);
      $state.go('home');
      $rootScope.$digest();
      $state.go(homeGameState, {gameId: gameId});
      $rootScope.$digest();
      $httpBackend.flush();
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
        gameUtil.mockGetGameEdit($httpBackend, urlUtil);
        gameUtil.mockGetGames($httpBackend, urlUtil, 1, '');
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

});
