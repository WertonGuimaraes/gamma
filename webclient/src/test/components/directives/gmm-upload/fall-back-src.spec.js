describe('Directive: fallBackSrc', function() {
  describe('if the image does not exist it', function() {

    var element, scope;

    beforeEach(module('gmm'));

    beforeEach(inject(function($rootScope, $compile, $httpBackend) {
      element = angular.element('<img fallback-src src="images/no-image.jpg" image-found="imageFound"/>');
      spyOn(element, 'bind').and.returnValue('error');
      scope = $rootScope;
      scope.imageFound = jasmine.createSpy('imageFound');
      mockI18n.mockI18nEnglish($httpBackend);
      $compile(element)(scope);
      scope.$digest();
    }));

    it('should contain the place holder img src', function(done) {
      setTimeout(function(){
        expect(element.attr('src')).toEqual('');
        done();
      }, 2000);
    });
  });

});
