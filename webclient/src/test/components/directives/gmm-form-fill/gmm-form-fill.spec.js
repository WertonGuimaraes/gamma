describe('Directive gmmFormFill', function () {
  var compile, scope, gmmFormFill;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      /*jshint -W106*/
      scope.model = mockDataGame.mockGetValidGame().form_template.dropzones;
      mockI18n.mockI18nEnglish($httpBackend);
    });

    gmmFormFill = getCompiledElement();

  });

  it('should applied template', function () {
    expect(gmmFormFill.html()).not.toEqual('');
  });

  it('isolated scope', function () {
    var isolatedScope = gmmFormFill.isolateScope();
    expect(isolatedScope.model).toBeDefined();
  });

  it('getDescription', function () {
    var isolatedScope = gmmFormFill.isolateScope();
    expect(isolatedScope.getDescription(2)).toEqual('description');
    expect(isolatedScope.getDescription(1)).toBeNull();
  });

  it('getKeyName', function () {
    var object = {name: 'zenny'};
    var isolatedScope = gmmFormFill.isolateScope();
    expect(isolatedScope.getKeyName(object)).toEqual('name');
    expect(isolatedScope.getKeyName(undefined)).toBe('');
  });

  it('getModelInput', function () {
    var object = {zix: [{score: '1'}]};
    var isolatedScope = gmmFormFill.isolateScope();
    expect(isolatedScope.getModelInput(object)).toEqual('score');
  });

  it('isolated scope', function () {
    scope.model = mockDataGame.mockStructureFeatureWithIdUndefined().dropzones;
    gmmFormFill = getCompiledElement();
    var isolatedScope = gmmFormFill.isolateScope();
    expect(isolatedScope.formJson.root.length).toBe(0);
  });

  it('isolated scope attribute without id', function () {
    scope.model = attributeWithoutID();
    gmmFormFill = getCompiledElement();
    var isolatedScope = gmmFormFill.isolateScope();
    expect(isolatedScope.formJson.root.length).toBe(1);
  });

  it('isolated scope Feature Without Attribute', function () {
    scope.model = mockDataGame.mockStructureFeatureWithoutAttribute().dropzones;
    gmmFormFill = getCompiledElement();
    var isolatedScope = gmmFormFill.isolateScope();
    expect(isolatedScope.formJson.root.length).toBe(0);
  });

  function attributeWithoutID() {
    return {
      'root': [{
        'type': 'container',
        'id': 'zix',
        'columns': [[{'type': 'item', 'id': 'name', 'name': 'attribute'}]],
        'name': 'feature'
      }, {'type': 'item', 'name': 'attribute'}, undefined]
    };
  }

  function getCompiledElement() {
    var element = '<gmm-form-fill ng-model="model" form-disable="false" form-json="{}"></gmm-form-fill>';
    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});

