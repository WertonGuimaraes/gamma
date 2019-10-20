(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('GmmCardController', GmmCardController);

  function GmmCardController() {
    var cardCtrl = this;
    cardCtrl.selectedCard = true;
    cardCtrl.onClickCard = onClickCard;

    function onClickCard() {
      cardCtrl.selectedCard = !cardCtrl.selectedCard;
    }
  }

})();
