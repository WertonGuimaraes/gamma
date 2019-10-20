var mockI18n = (function () {

  return {
    mockI18nEnglish: mockI18nEnglish
  };

  function mockI18nEnglish($httpBackend) {
    var language = navigator.language;
    language = language.split('-');
    $httpBackend.whenGET('/app/shared/i18n/' + language[0] + '.json').respond(200, {});
    $httpBackend.expectGET('/app/shared/i18n/' + language[0] + '.json');
  }
})();
