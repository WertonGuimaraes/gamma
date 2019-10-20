(function () {
  'use strict';

  angular
    .module('gmm')
    .directive('gmmUpload', gmmUpload);

  function gmmUpload() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        showProgress: '=',
        viewImage: '=viewImage',
        imageFound: '=imageFound',
        ngModel: '=ngModel',
        ngChangeUpload: '=ngChange',
        gmmUploadController: '=gmmUploadController'
      },
      template: function (element, attr) {

        var content = injectTemplate('gmm-upload-content');
        var actions = injectTemplate('gmm-upload-actions');

        return '<div flex="auto">          ' +
          '       <div ng-show="showProgress" class="gmm-upload-scroll-mask"></div>' +
          '       <div ng-show="showProgress" class="gmm-upload-progress" layout="row" layout-align="center center"> ' +
          '         <md-progress-circular md-mode="indeterminate" md-diameter="100"></md-progress-circular>' +
          '       </div>' +
          '       <div layout="column" class="md-whiteframe-z1" flex>             ' +
          '         <div flex="70" layout="row" layout-align="center center">' +
          '           <div class="md-button"' +
          '               ngf-drop=""' +
          '               ng-show="viewImage == null"' +
          '               ngf-change="ngChangeUpload()"' +
          '               ngf-select' +
          '               ng-model="ngModel"' +
          '               ngf-pattern="\'image/*\'"' +
          '               ngf-accept="\'image/*\'"' +
          '               ngf-max-size="20MB"' +
          '               ngf-min-height="100">' +
          '            <ng-md-icon icon="cloud_upload" size="20"></ng-md-icon>          ' +
          '             {{\'SELECT_FILE_DROP_FILE_ID\'| translate}}' +
          '           </div>' +
          '           <img fallback-src="../../../assets/img/no-image.png" image-found="imageFound"' +
          '           layout-padding ng-hide="viewImage == null" ngf-src="viewImage">' +
          '         </div>          ' +
          '         <div layout-padding layout="column" flex="20" ng-transclude>' + content +
          '         </div>' +
          '         <div class="gmm-upload-image-actions" layout="row" flex="10">' + actions +
          '         </div>' +
          '       </div>' +
          '     </div>';

        function injectTemplate(tag) {
          var templateTag = element.find(tag).detach(),
            html = templateTag.length ? templateTag.html() : element.html();
          if (!templateTag.length) {
            element.empty();
          }
          return  html;
        }

      }
    };
  }

})();
