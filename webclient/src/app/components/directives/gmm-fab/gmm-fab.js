(function () {
  'use strict';

  angular.module('gmm').directive('gmmFab', gmmFab);

  function gmmFab() {
    return {
      restrict: 'E',
      scope: {
        tooltip: '=',
        stageGo: '=?',
        clickGo: '=?',
        gmmFabController: '=',
        firstIcon: '=?'
      },
      controller: GmmFabController,
      template: template,
    };

    /* @ngInject */
    function template(element, attr) {
      var content = injectTemplate('gmm-fab-actions');
      return '<md-fab-speed-dial md-direction="up" md-open="isOpen" ' +
        'class="md-fab-bottom-right md-fab-option" ng-class="isOpen ? \'md-fling\' : \'md-scale\'" ' +
        'ng-mouseenter="mouseenter()" ng-mouseleave="mouseleave()"> ' +
        ' <md-fab-trigger>' +

        '   <md-button ng-if="stageGo != undefined" aria-label="menu" class="md-fab md-primary-gmm" ui-sref="{{stageGo}}">' +
        '     <md-tooltip md-direction="left" md-visible="tooltipVisible">{{tooltip}}</md-tooltip>' +
        '     <ng-md-icon icon="{{icon}}" style="fill: white"></ng-md-icon>' +
        '   </md-button>' +

        '   <md-button ng-if="stageGo == undefined" aria-label="menu" class="md-fab md-primary-gmm ng-scope" ng-click="mouseclick()">' +
        '     <md-tooltip md-direction="left" md-visible="tooltipVisible">{{tooltip}}</md-tooltip>' +
        '     <ng-md-icon icon="{{icon}}" style="fill: white"></ng-md-icon>' +
        '   </md-button>' +

        ' </md-fab-trigger>' +
        ' <md-fab-actions>' + content + '</md-fab-actions>' +
        '</md-fab-speed-dial>';
      function injectTemplate(tag) {
        var templateTag = element.find(tag).detach(),
          html = templateTag.length ? templateTag.html() : element.html();
        if (!templateTag.length) {
          element.empty();
        }
        return html;
      }
    }

    /* @ngInject */
    function GmmFabController($scope, $timeout) {

      if ($scope.firstIcon == undefined) {
        $scope.firstIcon = 'add';
      }

      $scope.stageGo;
      $scope.isOpen = false;
      $scope.icon = 'view_headline';
      $scope.mouseclick = mouseclick;
      $scope.mouseenter = mouseenter;
      $scope.mouseleave = mouseleave;

      $scope.$watch('isOpen', watch);

      function watch(isOpen) {
        if (isOpen) {
          $timeout(function () {
            $scope.tooltipVisible = $scope.isOpen;
          }, 600);
        } else {
          $scope.tooltipVisible = $scope.isOpen;
        }
      }

      function mouseclick() {
        $scope.clickGo();
      }

      function mouseenter() {
        $scope.isOpen = true;
        $scope.icon = $scope.firstIcon;
      }

      function mouseleave() {
        $scope.isOpen = false;
        $scope.icon = 'view_headline';
      }
    }

  }
})();
