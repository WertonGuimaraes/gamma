describe('HomeControllerList', function () {

  var $rootScope, controller, $state, dialogService, $window, loginService, loginController;

  beforeEach(function () {
    module('gmm');
  });

  beforeEach(inject(function (_$state_, _$controller_, _$rootScope_, _$window_, _$httpBackend_, _loginService_) {

    $window = _$window_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    loginService = _loginService_;
    mockI18n.mockI18nEnglish(_$httpBackend_);
    controller = _$controller_('HomeController');
    loginController = _$controller_('LoginController');
  }));

  it('should be created successfully', function () {
    expect(controller).toBeDefined();
  });

  it('should be divided currentTittle', function () {
    expect(controller.currentTittle).toBeDefined();
  });

  it('should be divided toggleList', function () {
    expect(controller.toggleList).toBeDefined();
  });

  it('should be divided logout', function () {
    expect(controller.logout).toBeDefined();
  });

  describe('login', function () {
    /*jshint -W101*/
    var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';


    beforeEach(function () {
      $state.go('login');
      $rootScope.$digest();
      loginController.account.login = 'admin';
      loginController.account.password = 'admin';
      $window.localStorage['userName'] = '';
    });


    it('should call login function and call success function', function () {
      sinon.stub(loginService, 'login', function (username, password, onSuccess, onFail) {
        onSuccess({'token': token});
      });
      loginController.login();
      $rootScope.$digest();
      expect($state.current.name).toBe('home');
      expect($window.localStorage['userName']).toBe('admin');
      expect($state.current.views[''].templateUrl).toEqual('app/components/home/home.html');
    });

    describe('currentTittle', function () {
      it('should currentTittle function', function () {
        expect(controller.currentTittle()).toBe('HOME_ID');
      });
    });

    describe('toggleUsersList', function () {
      it('should toggleUsersList function', function () {
        controller.toggleList();
      });
    });

    describe('logout', function () {
      it('should logout function', function () {
        controller.logout();
        $rootScope.$digest();
        expect($state.current.name).toBe('login');
        expect($window.localStorage['userName']).toBe('');
      });
    });

  });

});
