(function () {
  'use strict';

  angular
    .module('gmm')
    .directive('gmmCardList', gmmCardList);

  function gmmCardList() {
    return {
      restrict: 'E',
      scope: {
        list: '=',
        nextList: '=',
        gmmCardController: '='
      },
      template: function (element, attr) {

        var itemTemplate = injectTemplate('gmm-card-item');
        var contentTemplate = injectTemplate('gmm-card-item-show');

        return '<md-card>' +
          '          <md-card-content>' +
          '           <md-list infinite-scroll="nextList()">' +
          '             <md-item ng-repeat="$item in list">' +
          '              <md-item-content ng-controller="GmmCardController as cardCtrl">' +
          '               <div ng-click="cardCtrl.onClickCard()" ng-show="cardCtrl.selectedCard">' + itemTemplate +
          '               </div>' +
          '               <md-content ng-click="cardCtrl.onClickCard()" flex layout-padding ng-hide="cardCtrl.selectedCard">' + contentTemplate +
          '               </md-content>' +
          '             </md-item-content>' +
          '           </md-item>' +
          '           <md-divider></md-divider>' +
          '             </md-list>' +
          '              </md-card-content>' +
          '           </md-card>';

        function injectTemplate(tag) {
          var templateTag = element.find(tag).detach(),
            html = templateTag.length ? templateTag.html() : element.html();
          if (!templateTag.length) {
            element.empty();
          }
          return '<div>' + html + '</div>';
        }

      }
    };
  }

})();
