(function () {
  'use strict';

  angular
    .module('gmm')
    .directive('gmmFormFill', gmmFormFill);

  function gmmFormFill() {
    return {
      restrict: 'E',
      require: ['ngModel'],
      templateUrl: template,
      scope: {
        model: '=ngModel',
        formDisable: '=',
        formJson: '=',
        type: '=',
        disableOption: '=?'
      },
      controller: gmmFormFillController
    };

    function template(elem, attr) {
      if (attr.type === '\'push\'') {
        return 'app/components/directives/gmm-form-fill/gmm-form-fill-push.html';
      }
      return 'app/components/directives/gmm-form-fill/gmm-form-fill.html';
    }

    /* @ngInject */
    function gmmFormFillController($scope) {

      if ($scope.disableOption === undefined) {
        $scope.disableOption = true;
      }

      $scope.getDescription= getDescription;
      $scope.getFirstChild = getFirstChild;
      $scope.getKeyName = getKeyName;
      $scope.getModelInput = getModelInput;
      $scope.$watch('model', watch, true);

      function getDescription(id){
        /*jshint -W116*/
        var root = $scope.model.root;
        for(var i in root){
          if(root[i].id == id && root[i].desc !== ''){
            return root[i].desc;
          }
        }
        return null;
      }

      function watch(model) {
        var modelAsJson = JSON.parse(angular.toJson(model));
        var newObject = {};
        newObject['root'] = generateJsonObject(modelAsJson[Object.keys(modelAsJson)[0]], []);
        $scope.formJson = newObject;
      }

      function getModelInput(object) {
        var name = getKeyName(getFirstChild(object)[0]);
        if (name === undefined || name === null) {
          name = '';
        }
        return name;
      }

      function getFirstChild(object) {
        return object[Object.keys(object)[0]];
      }

      function getKeyName(object) {
        if (object !== undefined) {
          return Object.getOwnPropertyNames(object)[0];
        }
        return '';
      }

      function generateJsonObject(data, object) {
        for (var i = 0; i < data.length; i++) {
          if (angular.isArray(data[i])) {
            if (data[i].length <= 0) {
              if ($scope.type === 'push') {
                var newArray = {};
                newArray[data.id] = '';
                return '';
              }
              return null;
            }
            return generateJsonObject(data[i], object);
          } else {
            if (!isNullOrUndefined(data[i])) {
              var newObject = isObject(data[i]);
              if (!isNullOrUndefined(newObject)) {
                object.push(newObject);
              }
            }
          }
        }

        return object;
      }

      function isObject(data) {
        if (data.type === 'item') {
          return isItem(data);
        }
        return isContainer(data);
      }

      function isItem(data) {
        if (!isNullOrUndefined(data.id)) {
          var newObject = {};
          newObject[data.id] = '';
          return newObject;
        }
        return null;
      }

      function isContainer(data) {
        if (!isNullOrUndefined(data.id)) {
          var newObject = {};
          newObject[data.id] = [];
          var newArray = generateJsonObject(data.columns, newObject[data.id]);
          if (!isNullOrUndefined(newArray)) {
            newObject[data.id] = newArray;
            return newObject;
          }
        }
        return null;
      }

      function isNullOrUndefined(data) {
        if (data === null || data === undefined) {
          return true;
        }
        return false;
      }

    }
  }

})();

