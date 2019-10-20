/*jshint -W106 */
describe('Controller gmmVirtualScroll', function () {

  var controller, scope;

  beforeEach(function () {
    module('gmm');
    inject(function ($rootScope, _$controller_) {
      scope = $rootScope.$new();
      scope.scrollList = [{'email': 'email01@email.com'}, {'email': 'email02@email.com'}];
      scope.maxCount = 2;
      scope.transcludeObject = {};
      scope.scrollAction = jasmine.createSpy('scrollAction');
      controller = _$controller_('gmmVirtualScrollController', {'$scope': scope});
    });
  });

  it('should be created successfully', function () {
    expect(controller).toBeDefined();
    expect(controller.page).toBeDefined();
    expect(controller.transclude).toBeDefined();
    expect(controller.infiniteItems).toBeDefined();
  });

  describe('should be infiniteItems.getLength', function () {

    it('should contain 2 item', function () {
      expect(controller.infiniteItems.getLength()).toEqual(2);
    });

  });

  describe('should be infiniteItems.getItemAtIndex', function () {

    it('should return one item', function () {
      var item = controller.infiniteItems.getItemAtIndex(0);
      expect(item.email).toEqual('email01@email.com');
    });

    it('should does not call nextlist', function () {
      controller.infiniteItems.getItemAtIndex(2);
      expect(scope.scrollAction).not.toHaveBeenCalled();
    });
    describe('should call scrollAction', function () {

      beforeEach(function () {
        inject(function (_$controller_) {
          scope.maxCount = 3;
          controller = _$controller_('gmmVirtualScrollController', {'$scope': scope});
        });
      });

      it('should call nextlist', function () {
        controller.infiniteItems.getItemAtIndex(2);
        expect(scope.scrollAction).toHaveBeenCalled();
      });
    });

  });

});
