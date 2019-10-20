describe('GmmCardController', function () {

  beforeEach(module('gmm'));

  var cardController;

  beforeEach(inject(function (_$controller_) {
    cardController = _$controller_('GmmCardController');
  }));

  it('should be created successfully', function () {
    expect(cardController).toBeDefined();
  });

  it('Verify cardCtrl attributes initial values', function () {
    expect(cardController.selectedCard).toEqual(true);
    expect(typeof(cardController.onClickCard)).toEqual('function');
  });

  it('must reverse the variable selectedCard', function () {
    cardController.onClickCard();
    expect(cardController.selectedCard).toEqual(false);
    cardController.onClickCard();
    expect(cardController.selectedCard).toEqual(true);
  });

});
