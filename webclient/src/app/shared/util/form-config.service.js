(function () {
  'use strict';

  angular.module('gmm').service('formConfigService', formConfigService);

  function formConfigService() {

    var service = {
      formTemplateFromJson: formTemplateFromJson,
      generateJsonValid: generateJsonValid,
      validateStructure: validateStructure
    };

    return service;

    function formTemplateFromJson(game) {
      /*jshint -W106*/
      var pushTemplates = [];
      for (var i in game.push_templates) {
        if (game.push_templates[i] !== null) {
          pushTemplates.push(angular.fromJson(game.push_templates[i].push_template));
        }
      }
      return pushTemplates;
    }

    function generateJsonValid(data, push) {
      var newObject = {};
      angular.forEach(data, function (value, key) {
        var newKey = Object.keys(value)[0];
        var newValue = value[Object.keys(value)[0]];
        if (angular.isArray(newValue)) {
          if (push) {
            newObject[newKey] = Object.getOwnPropertyNames(newValue[0])[0];
          } else {
            newObject[newKey] = generateJsonValid(newValue);
          }
        } else {
          newObject[newKey] = newValue;
        }
      });
      return newObject;
    }

    function validateStructure(data, pushStructure) {
      /*jshint -W116*/
      var firstElement = data[Object.keys(data)[0]];
      if (firstElement == undefined) {
        return false;
      } else if (firstElement.length <= 0) {
        return false;
      }

      for (var i = 0; i < firstElement.length; i++) {
        var firstChild = firstElement[i][Object.keys(firstElement[i])[0]];
        if (firstChild === '' || firstChild == undefined) {
          return false;
        } else if (angular.isArray(firstChild)) {
          if (!pushStructure && !validateStructure(firstElement[i])) {
            return false;
          }
        }
      }
      return true;
    }
  }
})();

