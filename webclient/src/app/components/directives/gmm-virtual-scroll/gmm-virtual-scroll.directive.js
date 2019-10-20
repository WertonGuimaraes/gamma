(function () {
  'use strict';

  angular.module('gmm').directive('gmmVirtualScroll', gmmVirtualScroll);

  function gmmVirtualScroll() {
    return {
      restrict: 'E',
      scope: {
        scrollList: '=',
        maxCount: '=',
        scrollAction: '=',
        transcludeObject: '=transclude'
      },
      template: function (element, attr) {

        var contentTemplate = injectTemplate('gmm-virtual-scroll-content');

        return '<md-content ng-controller="gmmVirtualScrollController as virtualScrollCtrl"  layout="column">' +
          ' <md-virtual-repeat-container id="vertical-container">' +
          '   <md-card class="card-list">' +
          '     <md-card-content>' +
          '       <div md-virtual-repeat="item in virtualScrollCtrl.infiniteItems" md-on-demand' +
          '         class="repeated-item" flex>' +
          '         <md-item-content>' +
          '           <md-toolbar>  ' + contentTemplate + '  </md-toolbar>        ' +
          '         </md-item-content>' +
          '       </div>' +
          '     </md-card-content>' +
          '   </md-card>' +
          ' </md-virtual-repeat-container>' +
          '</md-content>';

        function injectTemplate(tag) {
          var templateTag = element.find(tag).detach(),
            html = templateTag.length ? templateTag.html() : element.html();
          if (!templateTag.length) {
            element.empty();
          }
          return html;
        }

      }
    };
  }

})();
