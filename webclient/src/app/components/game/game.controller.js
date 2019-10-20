(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('GameController', GameController);

  /*jshint -W071*/
  /* @ngInject */
  function GameController($document, $mdDialog, $state, gameService, dialogService, gamePrepService, fileUploadService,
                          urlUtil, gamePrepServiceTranslate) {

    /*jshint -W106*/
    var gameCtrl = this;
    var imageFound = true;
    var ableImageField = true;
    var folderName = 'game/';
    var translate = gamePrepServiceTranslate;
    gameCtrl.validate = '';
    gameCtrl.pushStructureName = '';
    gameCtrl.cancel = cancel;
    gameCtrl.disabled = disabled;
    gameCtrl.save = save;
    gameCtrl.game = gamePrepService;
    gameCtrl.pushStructures = fromJson();
    gameCtrl.submitImage = submitImage;
    gameCtrl.viewImage = gameCtrl.game.game_image;
    gameCtrl.clearImage = clearImage;
    gameCtrl.changeUpload = changeUpload;
    gameCtrl.changeImageUrl = changeImageUrl;
    gameCtrl.imageNotFound = imageNotFound;
    gameCtrl.structure = angular.fromJson(gameCtrl.game.form_template);
    gameCtrl.addPushStructure = addPushStructure;
    gameCtrl.removePushStructure = removePushStructure;
    gameCtrl.showDialog = showDialog;
    gameCtrl.verifyPushConfigurationName = verifyPushConfigurationName;
    gameCtrl.getIndex = getIndex;

    configSaveButton(false, translate.SAVE_ID);

    function addPushStructure(name) {
      var structure = {
        selected: null,
        name: name,
        max: 1,
        templates: [
          {
            id: translate.NEW_ACTION_ID,
            templateName: {count: 1, apply: false},
            type: 'container',
            name: 'ACTION_ID',
            columns: [[]],
            desc: '',
            tooltip: 'ACTION_TOOLTIP_ID',
            allowedTypes: ['item']
          },
          {
            id: translate.NEW_VALUE_ID,
            templateName: {count: 1, apply: false},
            name: 'VALUE_ID',
            type: 'item',
            tooltip: 'VALUE_TOOLTIP_ID'
          }
        ],
        dropzones: {
          root: []
        }
      };
      gameCtrl.pushStructures.push(structure);
      gameCtrl.pushStructureName = '';
    }

    function verifyPushConfigurationName() {
      for (var i in gameCtrl.pushStructures) {
        if (gameCtrl.pushStructures[i].name === gameCtrl.pushStructureName) {
          return false;
        }
      }
      return true;
    }

    function imageNotFound() {
      imageFound = false;
    }

    function clearImage(gameForm) {
      if (gameForm !== undefined) {
        resetInput(gameForm.imageUrl);
      }

      gameCtrl.viewImage = null;
      gameCtrl.image = null;
      gameCtrl.game.game_image = '';
      gameCtrl.showProgress = false;
    }

    function changeImageUrl() {
      imageFound = true;
      gameCtrl.viewImage = gameCtrl.game.game_image;
    }

    function changeUpload() {
      imageFound = true;
      gameCtrl.viewImage = gameCtrl.image;
      gameCtrl.game.game_image = gameCtrl.image.name;
    }

    function cancel(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_CANCEL_ID, redirectState);
    }

    function redirectState() {
      $state.go('home.game.list');
    }

    function saveGame() {
      configSaveButton(true, translate.SAVING_ID);
      gameCtrl.game.form_template = angular.toJson(gameCtrl.structure);
      gameCtrl.game.push_templates = toJson();
      $state.current.data.save(gameService, gameCtrl.game, saveSuccess, saveError);
    }

    function toJson() {
      var pushTemplates = [];
      for (var i in gameCtrl.pushStructures) {
        if (gameCtrl.pushStructures[i] !== null) {
          pushTemplates.push({'push_template': angular.toJson(gameCtrl.pushStructures[i])});
        }
      }
      return pushTemplates;
    }

    function fromJson() {
      var pushTemplates = [];
      for (var i in gameCtrl.game.push_templates) {
        if (gameCtrl.game.push_templates[i] !== null) {
          pushTemplates.push(angular.fromJson(gameCtrl.game.push_templates[i].push_template));
        }
      }
      return pushTemplates;
    }

    function submitImage() {
      gameCtrl.showProgress = true;
      ableImageField = false;
      fileUploadService.uploadFileToUrl(generateName(), '', gameCtrl.image, urlUtil.IMAGE, success, error,
        progress);
      gameCtrl.loadingImage = true;
    }

    function success(response) {
      gameCtrl.loadingImage = false;
      gameCtrl.game.game_image = response.data;
      saveGame();
    }

    function error() {
      ableImageField = true;
      gameCtrl.loadingImage = false;
      gameCtrl.showProgress = false;
      dialogService.show(null, translate.UPLOAD_ID, translate.ERROR_UPLOAD_IMAGE_ID, translate.GAME_DIALOG_ID,
        true, translate.CLOSE_ID, null);
    }

    function progress(evt) {
      gameCtrl.loadingImageProgress = parseInt(100.0 * evt.loaded / evt.total);
    }

    function disabled() {
      return !gameCtrl.game.name ||
        !gameCtrl.game.package_name ||
        !gameCtrl.game.game_service_id ||
        !gameCtrl.viewImage ||
        !gameCtrl.game.api_key ||
        (gameCtrl.game.analytics_view_id === undefined) ||
        !validateStructure(gameCtrl.structure.dropzones) ||
        !validatePushStructures();
    }

    function save(ev) {
      if (gameCtrl.image) {
        dialogService.showConfirm(ev, translate.CONFIRM_SAVE_GAME_ID, submitImage);
      } else {
        dialogService.showConfirm(ev, translate.CONFIRM_SAVE_GAME_ID, saveGame);
      }
    }

    function saveSuccess(response) {
      redirectState();
      dialogService.showToast(translate.SUCCESS_SAVE_ID);
    }

    function saveError() {
      gameCtrl.showProgress = false;
      configSaveButton(false, translate.SAVE_ID);
    }

    function generateName() {
      return folderName + 'game_icon_' + Date.now() + '.' + getExt(gameCtrl.image.name);
    }

    function getExt(filename) {
      var ext = filename.split('.').pop();
      if (ext === filename) {
        return '';
      }
      return ext;
    }

    function configSaveButton(buttonSave, buttonText) {
      gameCtrl.buttonSave = buttonSave;
      gameCtrl.buttonText = buttonText;
    }

    function validateStructure(data) {
      var firstElement = data[Object.keys(data)[0]];
      if (firstElement.length <= 0) {
        gameCtrl.validate = translate.FEATURE_MUST_CONTAIN_ATTRIBUTE_ID;
        return false;
      }

      var arrayIDs = [];
      for (var i = 0; i < firstElement.length; i++) {
        if (firstElement[i].id === undefined) {
          return false;
        } else if (idContainsEqual(arrayIDs, firstElement[i].id)) {
          gameCtrl.validate = translate.ATTRIBUTE_CANNOT_HAVE_SAME_NAME_ID;
          return false;
        } else if (firstElement[i].type === 'container') {
          if (!validateStructure(firstElement[i].columns)) {
            return false;
          }
        }
        arrayIDs.push(firstElement[i].id);
      }
      gameCtrl.validate = '';
      return true;
    }

    function validatePushStructures() {

      for (var structure in gameCtrl.pushStructures) {
        if (gameCtrl.pushStructures[structure] !== null) {
          var target = angular.element('#push-structure-' + structure);
          var data = gameCtrl.pushStructures[structure].dropzones;
          var firstElement = data[Object.keys(data)[0]];
          if (firstElement.length <= 0) {
            target.html(translate.FEATURE_MUST_CONTAIN_ATTRIBUTE_ID);
            return false;
          }
          var arrayIDs = [];
          for (var i = 0; i < firstElement.length; i++) {
            if (firstElement[i].id === undefined) {
              return false;
            } else if (idContainsEqual(arrayIDs, firstElement[i].id)) {
              target.html(translate.ATTRIBUTE_CANNOT_HAVE_SAME_NAME_ID);
              return false;
            }
            arrayIDs.push(firstElement[i].id);
          }
          target.html('');
        }
      }
      return true;
    }

    function idContainsEqual(data, id) {
      for (var i = 0; i < data.length; i++) {
        /*jshint -W116*/
        if (data[i] == id) {
          return true;
        }
      }
      return false;
    }

    function removePushStructure(object) {
      var index = gameCtrl.pushStructures.indexOf(object);
      gameCtrl.pushStructures.splice(index, 1);
    }

    function getIndex(object) {
      return gameCtrl.pushStructures.indexOf(object);
    }

    function showDialog(ev, structure) {
      dialogService.showRenameFormDialog(ev, DialogController);

      return {dialogController: DialogController};

      /* @ngInject */
      function DialogController($mdDialog) {

        var dialogCtrl = this;
        dialogCtrl.name = structure.name;
        dialogCtrl.cancel = cancelDialog;
        dialogCtrl.rename = rename;

        return dialogCtrl;

        function cancelDialog() {
          $mdDialog.cancel();
        }

        function rename() {
          structure.name = dialogCtrl.name;
          $mdDialog.cancel();
        }

      }
    }

    function resetInput(field) {
      if (field !== undefined) {
        field.$setUntouched();
        field.$setDirty();
        field.$setPristine();
        field.$setViewValue(undefined);
        field.$modelValue = undefined;
      }
    }

  }
})();
