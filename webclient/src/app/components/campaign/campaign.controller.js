(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('CampaignController', CampaignController);

  /* @ngInject */
  /*jshint -W071*/
  function CampaignController($state, $translate, dialogService, campaignService, gameService, regionService,
                              campaignPrepService, moment, formConfigService, campaignPrepServiceTranslate) {


    var campaignCtrl = this;
    var FORMAT = 'YYYY-MM-DDTHH:mm';
    var dateNow = new Date();
    var translate = campaignPrepServiceTranslate;
    campaignCtrl.currentDate = new Date(moment().format(FORMAT));
    campaignCtrl.regions = [];
    campaignCtrl.games = [];
    campaignCtrl.timezoneRequired = false;
    campaignCtrl.campaign = getCampaign();
    campaignCtrl.allTemplates = forms();
    campaignCtrl.verifyDisabledEdit = verifyDisabledEdit();
    campaignCtrl.minEndDate = getMinEndDate();
    campaignCtrl.onBeginDateChange = onBeginDateChange;
    campaignCtrl.addAllTemplates = addAllTemplates;
    campaignCtrl.changeGame = changeGame;
    campaignCtrl.cancel = cancel;
    campaignCtrl.countryNamesFromRegions = countryNamesFromRegions;
    campaignCtrl.disabled = disabled;
    campaignCtrl.disableTemplate = disableTemplate;
    campaignCtrl.getGameConfigTemplate = getGameConfigTemplate;
    campaignCtrl.getNamePushTemplate = getNamePushTemplate;
    campaignCtrl.hasDuplicatesCountriesInRegions = hasDuplicatesCountriesInRegions;
    campaignCtrl.onSelect = onSelect;
    campaignCtrl.onDeselect = onDeselect;
    campaignCtrl.querySearchGame = querySearchGame;
    campaignCtrl.querySearchRegion = querySearchRegion;
    campaignCtrl.removeGame = removeGame;
    campaignCtrl.removeGameConfig = removeGameConfig;
    campaignCtrl.removeGamePushConfig = removeGamePushConfig;
    campaignCtrl.save = save;
    campaignCtrl.setTimezoneCampaign = setTimezoneCampaign;
    campaignCtrl.showCampaignConfigDialog = showCampaignConfigDialog;
    campaignCtrl.verifyDisabledBeginDate = verifyDisabledBeginDate;
    campaignCtrl.verifyEdit = verifyEdit;

    loadRegions();
    configSaveButton(false, translate.SAVE_ID);

    function removeGame(game) {
      removeGameConfig(campaignCtrl.getGameConfigTemplate(game));
    }

    function onSelect(index) {
      if (getGameConfigTemplate(campaignCtrl.games[index]) !== null) {
        angular.element('md-tab-item:nth-child(' + (index + 1) + ') span').css({'color': 'rgb(63,81,181)'});
      }
    }

    function onDeselect(index) {
      var tab = angular.element('md-tab-item:nth-child(' + (index + 1) + ') span');
      if (getGameConfigTemplate(campaignCtrl.games[index]) === null) {
        tab.css({'color': 'red'});
      } else {
        tab.css({'color': 'rgba(0,0,0,0.54)'});
      }
    }

    function showCampaignConfigDialog(ev, game) {

      dialogService.showCampaignConfigDialog(ev, DialogController);
      return {dialogController: DialogController};

      /* @ngInject */
      function DialogController($scope, $mdDialog) {
        var dialogCtrl = this;
        dialogCtrl.dropzones = game.structure.dropzones;
        dialogCtrl.formJson = {};
        dialogCtrl.addAllTemplates = addAllTemplates;
        dialogCtrl.cancel = cancel;
        dialogCtrl.disableTemplate = disableTemplate;
        $scope.$watch('dialogCtrl.formJson', watch);

        return dialogCtrl;

        function addAllTemplates() {
          cancel();
          campaignCtrl.addAllTemplates(game);
        }

        function disableTemplate() {
          return campaignCtrl.disableTemplate(game);
        }

        function watch() {
          game.formJson = dialogCtrl.formJson;
        }

        function cancel() {
          $mdDialog.cancel();
        }
      }
    }

    function clearGameSave() {
      campaignCtrl.gamesSaveError = angular.copy(campaignCtrl.games);
      for (var i in campaignCtrl.games) {
        if (campaignCtrl.games[i] !== null) {
          addPushValuesToForm(campaignCtrl.games[i]);
          delete campaignCtrl.games[i].formJsonPush;
          delete campaignCtrl.games[i].structure;
          delete campaignCtrl.games[i].formJson;
          delete campaignCtrl.games[i].pushTemplatesAux;
          delete campaignCtrl.games[i].formPushValues;
        }
      }

      function addPushValuesToForm(game) {
        /*jshint -W106*/
        var template = getGameConfigTemplate(game);
        if (template !== null) {
          template.form_push_values = game.formPushValues;
        }
      }
    }

    function revertFormJson(data) {
      var index = 0;
      var newArray = [];
      angular.forEach(data, function (value, key) {
        if (angular.isObject(value)) {
          var newObject = {};
          newObject[key] = revertFormJson(value);
          newArray[index] = newObject;
        } else {
          var newObjectItem = {};
          newObjectItem[key] = value;
          newArray[index] = newObjectItem;
        }
        index++;
      });
      return newArray;
    }

    function addAllTemplates(game) {
      var formTemplate = newFormTemplate(game);

      if (verifyIfGameAlreadyHasTemplate(game) || !formConfigService.validateStructure(game.formJson)) {
        return false;
      } else {
        campaignCtrl.allTemplates.push(formTemplate);
        onSelect(campaignCtrl.games.indexOf(game));
      }

      function newFormTemplate(game) {
        /*jshint -W106*/
        return {
          game: game,
          form_value: formConfigService.generateJsonValid(game.formJson.root)
        };
      }
    }

    function getNamePushTemplate(pushConfig) {
      return angular.fromJson(pushConfig).name;
    }

    function cancel(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_CANCEL_ID, redirectToListCampaign);
    }

    function changeGame(game) {
      /*jshint -W106*/
      if (sameGame()) {
        var index = campaignCtrl.games.indexOf(game);
        campaignCtrl.games.splice(index, 1);
        return;
      }

      game.structure = angular.fromJson(game.form_template);

      function sameGame() {
        var count = 0;
        for (var i in campaignCtrl.games) {
          if (campaignCtrl.games[i].id === game.id) {
            ++count;
            if (count >= 2) {
              return true;
            }
          }
        }
        return false;
      }
    }

    function configSaveButton(buttonSave, buttonText) {
      campaignCtrl.buttonSave = buttonSave;
      campaignCtrl.buttonText = buttonText;
    }

    function countryNamesFromRegions(regions) {
      /*jshint -W106*/
      campaignCtrl.country_names = [];
      if (regions.length > 0) {
        for (var i = 0; i < regions.length; i++) {
          for (var j = 0; j < regions[i].countries.length; j++) {
            campaignCtrl.country_names.push(regions[i].countries[j].country_name);
          }
        }
      }
      return campaignCtrl.country_names;
    }

    function dateCodition() {
      /*jshint -W106*/
      if (campaignCtrl.beginDateTime >= campaignCtrl.endDateTime) {
        return true;
      }
      return false;
    }

    function disabled() {
      /*jshint -W074*/
      /*jshint -W106*/
      return !campaignCtrl.campaign.begin_date ||
        !campaignCtrl.endDateTime ||
        !campaignCtrl.beginDateTime ||
        !campaignCtrl.campaign.end_date ||
        !campaignCtrl.campaign.name ||
        !campaignCtrl.campaign.participant_limit ||
        !campaignCtrl.campaign.gmt_timezone ||
        campaignCtrl.games.length !== campaignCtrl.allTemplates.length ||
        campaignCtrl.games.length <= 0 ||
        campaignCtrl.regions.length <= 0 ||
        campaignCtrl.verifyDisabledEdit ||
        dateCodition();
    }

    function disableTemplate(game) {
      return !game || !formConfigService.validateStructure(game.formJson);
    }

    function forms() {
      /*jshint -W106*/
      var json = [];
      if (campaignCtrl.campaign.forms !== undefined) {
        for (var i = 0; i < campaignCtrl.campaign.forms.length; i++) {
          var values = campaignCtrl.campaign.forms[i];
          values.form_value = angular.fromJson(angular.fromJson(values.form_value));

          for (var j in values.form_push_values) {
            if (values.form_push_values[j] !== null) {
              values.form_push_values[j].data = angular.fromJson(
                angular.fromJson(values.form_push_values[j].data));
            }
          }
          json.push(values);
          values.game.structure = angular.fromJson(values.game.form_template);
          values.game.pushTemplatesAux = formConfigService.formTemplateFromJson(values.game);
          values.game.formPushValues = values.form_push_values;
          campaignCtrl.games.push(values.game);
        }
      }
      return json;
    }

    function formValueConfig(fromJson) {
      angular.forEach(campaignCtrl.allTemplates, function (value, key) {
        /*jshint -W106*/
        if (!fromJson) {
          value.form_value = angular.toJson(value.form_value);
          for (var i in value.form_push_values) {
            if (value.form_push_values[i] !== null) {
              value.form_push_values[i].data = angular.toJson(value.form_push_values[i].data);
            }
          }
        } else {
          value.form_value = angular.fromJson(value.form_value);
          for (var j in value.form_push_values) {
            if (value.form_push_values[j] !== null) {
              value.form_push_values[j].data = angular.fromJson(value.form_push_values[j].data);
            }
          }
        }
      });
    }

    function getCampaign() {
      /*jshint -W106*/
      var oldCampaign = campaignPrepService;

      oldCampaign.begin_date = new Date(oldCampaign.begin_date);
      oldCampaign.end_date = new Date(oldCampaign.end_date);

      if (oldCampaign.gmt_timezone !== undefined) {
        campaignCtrl.beginDateTime = new Date(moment(oldCampaign.begin_date).tz(oldCampaign.gmt_timezone)
          .format('LLL'));
        campaignCtrl.endDateTime = new Date(moment(oldCampaign.end_date).tz(oldCampaign.gmt_timezone).format('LLL'));
      } else {
        campaignCtrl.beginDateTime = oldCampaign.begin_date;
        campaignCtrl.endDateTime = oldCampaign.end_date;
      }

      return oldCampaign;
    }

    function onBeginDateChange() {
      campaignCtrl.minEndDate = getMinEndDate();
    }

    function getMinEndDate() {
      /*jshint -W106*/
      var minEndDate = campaignCtrl.beginDateTime;
      var dNow = new Date(moment().format(FORMAT));
      return minEndDate < dNow ? dateNow : minEndDate;
    }

    function hasDuplicatesCountriesInRegions(regionIndex) {
      /*jshint -W106*/
      if (campaignCtrl.campaign.regions.length <= 0) {
        campaignCtrl.country_names = [];
        return false;
      }

      var names = countryNamesFromRegions(campaignCtrl.campaign.regions);
      var valuesSoFar = Object.create(null);
      for (var i = 0; i < names.length; ++i) {
        var value = names[i];
        if (value in valuesSoFar) {
          $translate(['REGION_ID', 'OTHER_REGION_ADDED_ALREADY_ID', 'OK_ID'], {country: value})
            .then(showToastInfoTranslateMessage);
          campaignCtrl.campaign.regions.splice(regionIndex - 1, 1);
          return true;
        }
        valuesSoFar[value] = true;
      }
      return false;

      function showToastInfoTranslateMessage(translations) {
        dialogService.show(null, translations.REGION_ID, translations.OTHER_REGION_ADDED_ALREADY_ID, null, null,
          translations.OK_ID, null);
      }
    }

    function loadRegions() {
      campaignCtrl.regions = campaignCtrl.campaign.regions;
    }

    function querySearchRegion(query) {
      return regionService.list(query, true, 'name', 1, true).then(function (data) {
        return data.results;
      });
    }

    function querySearchGame(query) {
      return gameService.list(query, true, 'name', 1).then(function (data) {
        return data.results;
      });
    }

    function redirectToListCampaign() {
      $state.go('home.campaign.list');
    }

    function getGameConfigTemplate(game) {
      for (var i in campaignCtrl.allTemplates) {
        if (campaignCtrl.allTemplates[i].game.id === game.id) {
          return campaignCtrl.allTemplates[i];
        }
      }
      return null;
    }

    function removeGameConfig(template) {
      var index = campaignCtrl.allTemplates.indexOf(template);
      campaignCtrl.allTemplates.splice(index, 1);
      delete template.game.formJson;
      onDeselect(campaignCtrl.games.indexOf(template.game));
    }

    function removeGamePushConfig(game, pushTemplate) {
      var index = game.formPushValues.indexOf(pushTemplate);
      game.formPushValues.splice(index, 1);
    }

    function save(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_SAVE_CAMPAIGN_ID, saveCampaign);
    }

    function saveCampaign() {
      clearGameSave();
      formValueConfig(false);
      configSaveButton(true, translate.SAVING_ID);
      campaignCtrl.campaign.regions = campaignCtrl.regions;
      campaignCtrl.campaign.forms = campaignCtrl.allTemplates;
      setTime();
      $state.current.data.save(campaignService, campaignCtrl.campaign, success, saveError);
    }

    function saveError(response) {
      campaignCtrl.games = campaignCtrl.gamesSaveError;
      configSaveButton(false, translate.SAVE_ID);
      formValueConfig(true);
    }

    function setTime() {
      /*jshint -W106*/
      campaignCtrl.campaign.begin_date = moment.tz(moment(campaignCtrl.beginDateTime).format(FORMAT),
        campaignCtrl.campaign.gmt_timezone).format();

      campaignCtrl.campaign.end_date = moment.tz(moment(campaignCtrl.endDateTime).format(FORMAT),
        campaignCtrl.campaign.gmt_timezone).format();
    }

    function success(response) {
      redirectToListCampaign();
      dialogService.showToast(translate.SUCCESS_SAVE_ID);
    }

    function verifyDisabledBeginDate() {
      if (verifyEdit()) {
        /*jshint -W106*/
        var dateNow = new Date(moment(new Date()).tz(campaignCtrl.campaign.gmt_timezone).format('LLL'));
        if (new Date(campaignCtrl.campaign.begin_date) < dateNow) {
          return true;
        }
        return false;
      }
      return false;
    }

    function verifyDisabledEdit() {
      if (verifyEdit()) {
        /*jshint -W106*/
        if (campaignCtrl.campaign.participant_limit <= campaignCtrl.campaign.total_registered_participants) {
          return true;
        }
        return false;
      }
      return false;
    }

    function verifyEdit() {
      /*jshint -W116*/
      if (campaignCtrl.campaign.id != undefined) {
        return true;
      }
      return false;
    }

    function verifyIfGameAlreadyHasTemplate(game) {
      if (campaignCtrl.allTemplates !== undefined) {
        for (var i = 0; i < campaignCtrl.allTemplates.length; i++) {
          if (campaignCtrl.allTemplates[i].game.id === game.id) {
            dialogService.show(null, translate.ERROR_CREATE_CAMPAIGN_CONFIGURATION_FOR_GAME_ID,
              translate.INFO_GAME_TEMPLATE_DUPLICATED_ID, translate.CAMPAIGN_DIALOG_ID, true, translate.CLOSE_ID, null);
            return true;
          }
        }
      } else {
        return true;
      }
      return false;
    }

    function setTimezoneCampaign() {
      campaignCtrl.timezoneRequired = true;
    }

  }

})
();
