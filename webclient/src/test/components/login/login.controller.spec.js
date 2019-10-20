describe('LoginController', function () {

  beforeEach(module('gmm'));

  var $rootScope, $window, $state, $mdDialog, controller, loginService, urlUtil;
  var stateLogin = 'login';

  beforeEach(inject(function (_$rootScope_, _$window_, _$controller_, _$state_, _$mdDialog_, _$httpBackend_,
                              _loginService_, _urlUtil_) {
    $window = _$window_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    $mdDialog = _$mdDialog_;
    loginService = _loginService_;
    urlUtil = _urlUtil_;

    mockI18n.mockI18nEnglish(_$httpBackend_);

    $window.localStorage['jwtToken'] = '';
    controller = _$controller_('LoginController');
    $state.go('login');
    $rootScope.$digest();
    controller = _$controller_('LoginController');

  }));

  afterEach(function () {
    $window.localStorage['jwtToken'] = 'JWT token';
  });

  describe('should be created successfully', function () {
    it('should be created controller', function () {
      expect(controller).toBeDefined();
    });
  });

  describe('login', function () {

    var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';

    describe('should test login with state equal login', function () {

      beforeEach(function (){
        $state.go(stateLogin);
        $rootScope.$digest();
        controller.account.login = 'admin';
        controller.account.password = 'admin';
        $window.localStorage['userName'] = '';
        spyOn($mdDialog, 'show').and.callThrough();
      });

      it('should call login function', function () {
        controller.login();
      });

      it('should call login function and call success function', function () {
        sinon.stub(loginService, 'login', function (username, password, onSuccess, onFail) {
          onSuccess({'token': token});
        });
        controller.login();
        $rootScope.$digest();
        expect($state.current.name).toBe('home');
        expect($window.localStorage['userName']).toBe('admin');
      });

      it('should call login function and call error function', function () {
        sinon.stub(loginService, 'login', function (username, password, onSuccess, onFail) {
          onFail();
        });
        controller.login();
        $rootScope.$digest();
        expect($state.current.name).toBe(stateLogin);
        expect(controller.invalidLogin).toBeFalsy();
        expect($window.localStorage['userName']).toBe('');
        expect($mdDialog.show).toHaveBeenCalled();
      });

    });

    describe('should test login with state equal home', function () {

      beforeEach(function (){
        $window.localStorage['jwtToken'] = 'JWT token';
        $window.localStorage['userName'] = '';
        $state.go('home');
        $rootScope.$digest();
        controller.account.login = 'admin2';
        controller.account.password = 'admin2';
      });

      it('should call login function and call success function', function () {

        expect($state.current.name).toBe('home');
        sinon.stub(loginService, 'login', function (username, password, onSuccess, onFail) {
          onSuccess({'token': token});
        });
        controller.login();
        $rootScope.$digest();
        expect($state.current.name).toBe('home');
        expect($window.localStorage['userName']).toBe('admin2');
      });

      it('should call login function and call error function', function () {
        sinon.stub(loginService, 'login', function (username, password, onSuccess, onFail) {
          onFail();
        });
        controller.login();
        $rootScope.$digest();
        expect($state.current.name).toBe('home');
        expect(controller.invalidLogin).toBeTruthy();
        expect($window.localStorage['userName']).toBe('');
      });
    });
  });
});
