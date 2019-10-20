(function () {
  'use strict';
  angular.module('gmm').controller('gmmVirtualScrollController', gmmVirtualScrollController);

  /*jshint -W040*/
  function gmmVirtualScrollController($scope) {

    var virtualScrollCtrl = this;
    virtualScrollCtrl.page = 1;
    virtualScrollCtrl.transclude = $scope.transcludeObject;
    virtualScrollCtrl.infiniteItems = {
      getItemAtIndex: getItemAtIndex,
      getLength: getLength
    };

    function getLength() {
      return $scope.scrollList.length;
    }

    function getItemAtIndex(index) {
      if (index >= $scope.scrollList.length - 1) {
        nextList();
      }
      return $scope.scrollList[index];
    }

    function nextList() {
      if ($scope.maxCount > $scope.scrollList.length) {
        ++virtualScrollCtrl.page;
        $scope.scrollAction(virtualScrollCtrl.page);
      }
    }
  }
})();
