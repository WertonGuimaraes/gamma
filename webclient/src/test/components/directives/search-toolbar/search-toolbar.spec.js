describe('Directive searchToolbar', function () {
  var compile, scope, searchToolbarDirective;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.homeCtrl = {};
      mockI18n.mockI18nEnglish($httpBackend);
    });

    searchToolbarDirective = getCompiledElement();
  });

  function getCompiledElement() {
    var element = '<search-toolbar class="search-toolbar" home-ctrl="homeCtrl"></search-toolbar>';
    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

  it('onClickNew should be a object', function () {
    var isolatedScope = searchToolbarDirective.isolateScope();
    expect(typeof(isolatedScope.homeCtrl)).toEqual('object');
  });

});
