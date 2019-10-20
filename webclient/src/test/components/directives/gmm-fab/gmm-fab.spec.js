describe('Directive gmmFab', function () {
  var $timeout, compile, scope, gmmFab;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, _$timeout_, $httpBackend) {
      $timeout =_$timeout_;
      compile = $compile;
      scope = $rootScope.$new();
      scope.tooltip = 'New Banner';
      scope.stage = 'home.create.banner';
      scope.exportCtrl = {};
      mockI18n.mockI18nEnglish($httpBackend);
    });

    gmmFab = getCompiledElement();

  });

  it('should applied template', function () {
    expect(gmmFab.html()).not.toEqual('');
  });

  it('isolated scope should have the five properties assigned', function () {
    var isolatedScope = gmmFab.isolateScope();
    expect(isolatedScope.tooltip).toBeDefined();
    expect(isolatedScope.stageGo).toBeDefined();
    expect(isolatedScope.gmmFabController).toBeDefined();
  });

  it('config on isolated scope should be two-way bound', function () {
    var isolatedScope = gmmFab.isolateScope();
    isolatedScope.stageGo = 'Edit Banner';
    expect(scope.stageGo).not.toEqual('Edit Banner');
  });

  it('should call mouseenter', function () {
    var isolatedScope = gmmFab.isolateScope();
    isolatedScope.mouseenter();
    isolatedScope.$apply();
    $timeout.flush();
    expect(isolatedScope.isOpen).toBeTruthy();
    expect(isolatedScope.icon).toBe('add');
  });

  it('should call mouseleave', function () {
    var isolatedScope = gmmFab.isolateScope();
    isolatedScope.mouseleave();
    expect(isolatedScope.isOpen).toBeFalsy();
    expect(isolatedScope.icon).toBe('view_headline');
  });

  describe('Compiled Element Without TemplateTag', function () {
    var gmmFabDirectiveWithTempleteTag;
    beforeEach(function () {
      gmmFabDirectiveWithTempleteTag = getCompiledElementWithoutTemplateTag();
    });

    it('should applied template', function () {
      expect(gmmFabDirectiveWithTempleteTag.html()).not.toEqual('');
    });

  });

  function getCompiledElement() {

    var element = '<gmm-fab tooltip="tooltip" stage-go="stage" ' +
      'gmm-fab-controller="exportCtrl">' +
      ' <gmm-fab-actions>' +
      '   <md-button aria-label="export" class="md-fab md-raised md-mini" ng-csv="gmmFabController.getCsvExport()" ' +
      '   filename="{{gmmFabController.fileName}}" csv-header="gmmFabController.bannerHeader()">' +
      '     <md-tooltip md-direction="left" md-visible="tooltipVisible" md-autohide="false">Export csv</md-tooltip>' +
      '     <ng-md-icon icon="archive" aria-label="csv" style="fill: #0d47a1"></ng-md-icon>' +
      '   </md-button>' +
      ' </gmm-fab-actions>' +
      '</gmm-fab>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

  function getCompiledElementWithoutTemplateTag() {

    var element = '<gmm-fab tooltip="tooltip" stage-go="stage" ' +
      'gmm-fab-controller="exportCtrl">' +
      '</gmm-fab>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});

