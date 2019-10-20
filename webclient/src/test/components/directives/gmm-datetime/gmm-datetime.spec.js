describe('Directive gmmDatetime', function () {
  var compile, scope, gmmDatetime;

  beforeEach(function () {
    module('gmm');

    inject(function ($compile, $rootScope, $httpBackend) {
      compile = $compile;
      scope = $rootScope.$new();
      scope.datetimeName = 'BeginDate';
      scope.dateTimeModel = new Date();
      scope.dateTimeMin = new Date();
      mockI18n.mockI18nEnglish($httpBackend);
    });

    gmmDatetime = getCompiledElement();

  });

  it('should applied template', function () {
    expect(gmmDatetime.html()).not.toEqual('');
  });

  it('isolated scope should have the five properties assigned', function () {
    var isolatedScope = gmmDatetime.isolateScope();
    expect(isolatedScope.datetimeName).toBeDefined();
    expect(isolatedScope.dateTimeMin).toBeDefined();
    expect(isolatedScope.dateTimeModel).toBeDefined();
  });

  it('config on isolated scope should be two-way bound', function () {
    var isolatedScope = gmmDatetime.isolateScope();
    isolatedScope.datetimeName = 'Begin Date';
    expect(scope.datetimeName).not.toEqual('Begin Date');
  });

  it('onChange should be a function', function () {
    var isolatedScope = gmmDatetime.isolateScope();
    expect(typeof(isolatedScope.openCalendar)).toEqual('function');
  });

  it('should call ngChangeUpload method of scope when invoked from isolated scope', function () {
    var isolatedScope = gmmDatetime.isolateScope();
    var mockEvent = {
      preventDefault: function () {
      },
      stopPropagation: function () {
      }
    };
    isolatedScope.openCalendar(mockEvent);
  });

  function getCompiledElement() {

    var element = '<gmm-datetime datetime-name="datetimeName" ng-model="dateTimeModel" ' +
      'min-date="dateTimeMin"></gmm-datetime>';

    var compiledDirective = compile(angular.element(element))(scope);
    scope.$digest();
    return compiledDirective;
  }

});

