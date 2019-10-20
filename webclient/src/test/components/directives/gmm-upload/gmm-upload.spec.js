describe('Directive gmmUpload', function () {
  var compile, scope, gmmUploadDirective;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.ngModel = 'value';
      scope.viewImage = 'value';
      scope.showProgress = false;
      scope.ngChangeUpload = jasmine.createSpy('ngChange');
      scope.imageFound = jasmine.createSpy('imageFound');
      mockI18n.mockI18nEnglish($httpBackend);
    });

    gmmUploadDirective = getCompiledElement();

  });

  it('should applied template', function () {
    expect(gmmUploadDirective.html()).not.toEqual('');
  });

  it('isolated scope should have the five properties assigned', function () {
    var isolatedScope = gmmUploadDirective.isolateScope();
    expect(isolatedScope.ngModel).toBeDefined();
    expect(isolatedScope.viewImage).toBeDefined();
    expect(isolatedScope.showProgress).toBeDefined();
    expect(isolatedScope.imageFound).toBeDefined();
    expect(isolatedScope.ngChangeUpload).toBeDefined();
  });

  it('config on isolated scope should be two-way bound', function () {
    var isolatedScope = gmmUploadDirective.isolateScope();
    isolatedScope.ngModel = 'value2';
    expect(scope.ngModel).not.toEqual('value2');
  });

  it('onChange should be a function', function () {
    var isolatedScope = gmmUploadDirective.isolateScope();
    expect(typeof(isolatedScope.ngChangeUpload)).toEqual('function');
  });

  it('should call ngChangeUpload method of scope when invoked from isolated scope', function () {
    var isolatedScope = gmmUploadDirective.isolateScope();
    isolatedScope.ngChangeUpload();
    expect(scope.ngChangeUpload).toHaveBeenCalled();
  });

  it('imageFound should be a function', function () {
    var isolatedScope = gmmUploadDirective.isolateScope();
    expect(typeof(isolatedScope.imageFound)).toEqual('function');
  });

  it('should call imageFound method of scope when invoked from isolated scope', function () {
    var isolatedScope = gmmUploadDirective.isolateScope();
    isolatedScope.imageFound();
    expect(scope.imageFound).toHaveBeenCalled();
  });

  describe('Compiled Element Without TemplateTag', function () {
    var gmmUploadDirectiveWithTempleteTag;
    beforeEach(function () {
      gmmUploadDirectiveWithTempleteTag = getCompiledElementWithoutTemplateTag();
    });

    it('should applied template', function () {
      expect(gmmUploadDirectiveWithTempleteTag.html()).not.toEqual('');
    });

  });

  function getCompiledElement() {

    var element = '<gmm-upload ng-model="ngModel" ' +
      'ng-change="ngChangeUpload" show-progress="showProgress" view-image="viewImage" ' +
      'image-found="imageFound"><gmm-upload-content></gmm-upload-content><gmm-upload-actions>' +
      '</gmm-upload-actions></gmm-upload>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

  function getCompiledElementWithoutTemplateTag() {

    var element = '<gmm-upload ng-model="ngModel" ' +
      'ng-change="ngChangeUpload" show-progress="showProgress" view-image="viewImage" ' +
      'image-found="imageFound"></gmm-upload>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});
