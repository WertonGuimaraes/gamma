describe('Directive gmmForceLowerCase', function () {
  var compile, scope, gmmForceLowerCase;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.model = 'Zix';
      mockI18n.mockI18nEnglish($httpBackend);
    });

    gmmForceLowerCase = getCompiledElement();

  });

  it('should no applied template', function () {
    expect(gmmForceLowerCase.html()).toEqual('');
  });

  it('isolated scope', function () {
    scope.model = undefined;
    getCompiledElement();
  });

  function getCompiledElement() {
    var element = '<input force-lower-case type="text" ng-model="model"/>';
    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});

