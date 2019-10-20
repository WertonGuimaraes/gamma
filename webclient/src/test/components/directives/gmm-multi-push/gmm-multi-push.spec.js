describe('Directive gmmMultiPush', function () {
  var $timeout, compile, scope, gmmMultiPush;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.game = {};
      scope.onAdd = jasmine.createSpy('onAdd');
      scope.onRemove = jasmine.createSpy('onRemove');
      scope.disabledAdd = jasmine.createSpy('disabledAdd');
      mockI18n.mockI18nEnglish($httpBackend);
    });

    gmmMultiPush = getCompiledElement();

  });

  it('should applied template', function () {
    expect(gmmMultiPush.html()).not.toEqual('');
  });

  it('isolated scope should have the five properties assigned', function () {
    var isolatedScope = gmmMultiPush.isolateScope();
    expect(isolatedScope.onAdd).toBeDefined();
    expect(isolatedScope.onRemove).toBeDefined();
    expect(isolatedScope.game).toBeDefined();
    expect(isolatedScope.disabledAdd).toBeDefined();
  });

  it('config on isolated scope should be two-way bound', function () {
    var isolatedScope = gmmMultiPush.isolateScope();
    isolatedScope.onAdd();
    isolatedScope.onRemove();
    isolatedScope.disabledAdd();
    expect(isolatedScope.disabledAdd).toBeDefined();
    expect(isolatedScope.onRemove).toBeDefined();
    expect(scope.onAdd).toHaveBeenCalled();
  });

  function getCompiledElement() {

    var element = '<gmm-multi-push game="game" disabled-add="disabledAdd" on-add="onAdd" on-remove="onRemove">' +
      '</gmm-multi-push>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});

