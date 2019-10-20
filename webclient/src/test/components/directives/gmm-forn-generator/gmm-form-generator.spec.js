describe('Directive gmmFormGenerator', function () {
  var compile, scope, gmmFormTemplate;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      /*jshint -W106*/
      scope.models = mockDataGame.mockGetValidGame().form_template.dropzones;
      mockI18n.mockI18nEnglish($httpBackend);
    });

    gmmFormTemplate = getCompiledElement();

  });

  it('should applied template', function () {
    expect(gmmFormTemplate.html()).not.toEqual('');
  });

  it('isolated scope', function () {
    var isolatedScope = gmmFormTemplate.isolateScope();
    expect(isolatedScope.models).toBeDefined();
  });

  function getCompiledElement() {

    var element = '<gmm-form-generetor ng-model="models"></gmm-form-generetor>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});
