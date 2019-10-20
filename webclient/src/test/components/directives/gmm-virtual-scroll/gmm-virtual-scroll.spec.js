describe('Directive gmmVirtualScroll', function () {
  var compile, scope, gmmVirtualScroll;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.scrollList = [{'email': 'email01@email.com'}];
      scope.maxCount = 1;
      scope.scrollAction = jasmine.createSpy('scrollAction');
      scope.transcludeObject = jasmine.createSpy('transclude');
      mockI18n.mockI18nEnglish($httpBackend);
    });

    gmmVirtualScroll = getCompiledElement();

  });

  it('should applied template', function () {
    expect(gmmVirtualScroll.html()).not.toEqual('');
  });

  it('should applied template', function () {
    expect(getCompiledElementWithout().html()).not.toEqual('');
  });

  it('isolated scope should have the four properties assigned', function () {
    var isolatedScope = gmmVirtualScroll.isolateScope();
    expect(isolatedScope.scrollList).toBeDefined();
    expect(isolatedScope.maxCount).toBeDefined();
    expect(isolatedScope.scrollAction).toBeDefined();
    expect(isolatedScope.transcludeObject).toBeDefined();
  });

  it('config on isolated scope should be two-way bound for scrollList', function () {
    var isolatedScope = gmmVirtualScroll.isolateScope();
    isolatedScope.scrollList = [{'email': 'email01@email.com'}, {'email': 'email02@email.com'}];
    scope.$digest();
    expect(scope.scrollList.length).toBe(2);
  });

  it('config on isolated scope should be two-way bound for maxCount', function () {
    var isolatedScope = gmmVirtualScroll.isolateScope();
    isolatedScope.maxCount = 2;
    scope.$digest();
    expect(scope.maxCount).toBe(2);
  });

  it('scrollAction should be a function', function () {
    var isolatedScope = gmmVirtualScroll.isolateScope();
    expect(typeof(isolatedScope.scrollAction)).toEqual('function');
  });

  it('transcludeObject should be a function', function () {
    var isolatedScope = gmmVirtualScroll.isolateScope();
    expect(typeof(isolatedScope.transcludeObject)).toEqual('function');
  });

  function getCompiledElement() {
    var element = '<gmm-virtual-scroll scroll-list="scrollList" max-count="maxCount" scroll-action="scrollAction" ' +
      'transclude="transcludeObject"><gmm-virtual-scroll-content></gmm-virtual-scroll-content></gmm-virtual-scroll>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

  function getCompiledElementWithout() {
    var element = '<gmm-virtual-scroll scroll-list="scrollList" max-count="maxCount" scroll-action="scrollAction" ' +
      'transclude="transcludeObject"></gmm-virtual-scroll>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});
