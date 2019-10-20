describe('Directive cardList', function () {
  var compile, scope, cardListDirective;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.list = jasmine.createSpy('list');
      scope.nextList = jasmine.createSpy('nextList');
      mockI18n.mockI18nEnglish($httpBackend);
    });

    cardListDirective = getCompiledElement();
  });

  function getCompiledElement() {
    var element = '<gmm-card-list list="list" next-list="nextList">' +
      '<gmm-card-item></gmm-card-item><gmm-card-item-show></gmm-card-item-show></gmm-card-list>';
    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

  it('should have gmm-card-item element', function () {
    var spanElement = cardListDirective.find('gmm-card-item');
    expect(spanElement).toBeDefined();
  });

  it('should have gmm-card-item-show element', function () {
    var spanElement = cardListDirective.find('gmm-card-item-show');
    expect(spanElement).toBeDefined();
  });

  it('should applied template', function () {
    expect(cardListDirective.html()).not.toEqual('');
  });

  it('isolated scope should have the three properties assigned', function () {
    var isolatedScope = cardListDirective.isolateScope();
    expect(isolatedScope.list).toBeDefined();
    expect(isolatedScope.nextList).toBeDefined();
  });

  it('list should be a function', function () {
    var isolatedScope = cardListDirective.isolateScope();
    expect(typeof(isolatedScope.list)).toEqual('function');
  });

  it('should call list method of scope when invoked from isolated scope', function () {
    var isolatedScope = cardListDirective.isolateScope();
    isolatedScope.list();
    expect(scope.list).toHaveBeenCalled();
  });

  it('nextList should be a function', function () {
    var isolatedScope = cardListDirective.isolateScope();
    expect(typeof(isolatedScope.nextList)).toEqual('function');
  });

  it('should call nextList method of scope when invoked from isolated scope', function () {
    var isolatedScope = cardListDirective.isolateScope();
    isolatedScope.nextList();
    expect(scope.nextList).toHaveBeenCalled();
  });

  describe('Compiled Element Without TemplateTag', function () {
    var cardListDirectiveWithTempleteTag;
    beforeEach(function () {
      cardListDirectiveWithTempleteTag = getCompiledElementWithoutTemplateTag();
    });

    it('should applied template', function () {
      expect(cardListDirectiveWithTempleteTag.html()).not.toEqual('');
    });

  });

  function getCompiledElementWithoutTemplateTag() {
    var element = '<gmm-card-list list="list" next-list="nextList"></gmm-card-list>';
    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});
