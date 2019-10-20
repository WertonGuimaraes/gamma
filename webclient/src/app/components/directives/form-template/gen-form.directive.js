(function () {
  'use strict';

  angular.module('gmm').
  directive('formGenerator', formGenerator);

  function formGenerator(recursionHelper) {
    /*jshint -W109*/
    return {
      restrict: 'E',
      scope: {
        template: "=",
        child: '=child',
        model: '=model',
        disableOption: '=',
        index: '=',
      },
      templateUrl: 'app/components/directives/form-template/form-generator.html',
      compile: function (element) {
        return recursionHelper.compile(element);
      },
      controller: formGeneratorController
    };

    /* @ngInject */
    function formGeneratorController($scope) {
      $scope.getKeyName = getKeyName;
      $scope.getFirstChild = getFirstChild;
      $scope.isArray = isArray;
      $scope.getDescription = getDescription;

      function getDescription(id){
        /*jshint -W116*/
        var root = $scope.template.root;
        for(var i in root){
          if(root[i].id == id && root[i].desc !== ''){
            return root[i].desc;
          }
        }
        return null;
      }

      function isArray(object) {
        if (angular.isArray(object)) {
          return true;
        }
        return false;
      }

      function getFirstChild(object) {
        return object[Object.keys(object)[0]];
      }

      function getKeyName(object) {
        return Object.getOwnPropertyNames(object)[0];
      }

    }
  }
})();


