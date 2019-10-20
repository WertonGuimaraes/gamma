(function () {
  'use strict';

  angular.module('gmm').controller('BannerController', BannerController);

  /* @ngInject */
  /*jshint -W072*/
  function BannerController($state, bannerPrepService, dialogService, bannerService, regionService, campaignService,
                            gameService, fileUploadService, urlUtil, moment, languageService,
                            bannerPrepTranslateService, $translate) {

    /*jshint -W071*/
    /*jshint -W106*/
    var bannerCtrl = this;
    var imageFound = true;
    var format = 'YYYY-MM-DDTHH:mm';
    var translate = bannerPrepTranslateService;
    bannerCtrl.timezoneRequired = false;
    bannerCtrl.showProgress = false;
    bannerCtrl.banner = getBanners();
    bannerCtrl.games = bannerCtrl.banner.games;
    bannerCtrl.campaigns = bannerCtrl.banner.campaigns;
    bannerCtrl.regions = bannerCtrl.banner.regions;
    bannerCtrl.getMinEndDate = getMinEndDate();
    bannerCtrl.bannerForm = {};
    bannerCtrl.verifyEdit = verifyEdit;
    bannerCtrl.cancel = cancel;
    bannerCtrl.addUrls = addUrls;
    bannerCtrl.removeUrl = removeUrl;
    bannerCtrl.disable = disable;
    bannerCtrl.disableUrls = disableUrls;
    bannerCtrl.save = save;
    bannerCtrl.verifyImageType = verifyImageType;
    bannerCtrl.hasDuplicatesCountriesInRegions = hasDuplicatesCountriesInRegions;
    bannerCtrl.querySearchGame = querySearchGame;
    bannerCtrl.querySearchCampaign = querySearchCampaign;
    bannerCtrl.querySearchRegion = querySearchRegion;
    bannerCtrl.clearImage = clearImage;
    bannerCtrl.changeUpload = changeUpload;
    bannerCtrl.changeImageUrl = changeImageUrl;
    bannerCtrl.imageNotFound = imageNotFound;
    bannerCtrl.countryNamesFromRegions = countryNamesFromRegions;
    bannerCtrl.showCountryName = showCountryName;
    bannerCtrl.languages = languageService.getLanguages();
    bannerCtrl.language = bannerCtrl.banner.language;
    bannerCtrl.dateConfigurationBanner = false;
    bannerCtrl.validateCheckboxCampaignDates = validateCheckboxCampaignDates;
    bannerCtrl.checkboxDateCampaign = bannerCtrl.banner.is_using_campaign_date;
    bannerCtrl.removeCheckboxSelection = removeCheckboxSelection;
    bannerCtrl.setTimezoneBanner = setTimezoneBanner;
    bannerCtrl.removeTimestampFromBannerName = removeTimestampFromBannerName;

    function removeCheckboxSelection() {
      if (bannerCtrl.campaigns.length <= 0 && bannerCtrl.checkboxDateCampaign === true) {
        bannerCtrl.checkboxDateCampaign = false;
      }
    }

    function getBiggestbeginAndEndDateFromCampaign() {
      var endDateLists = [];
      var beginDateLists = [];
      if (bannerCtrl.checkboxDateCampaign === true) {
        var timezone = bannerCtrl.campaigns[0].gmt_timezone;
        var useTimezone = true;
        for (var date in bannerCtrl.campaigns) {
          if (bannerCtrl.campaigns[date] !== null) {
            endDateLists.push(new Date(bannerCtrl.campaigns[date].end_date));
            beginDateLists.push(new Date(bannerCtrl.campaigns[date].begin_date));
            if (bannerCtrl.campaigns[date].gmt_timezone !== timezone) {
              useTimezone = false;
            }
          }
        }
        var maior_data = Math.max.apply(null, endDateLists);
        var menor_date = Math.min.apply(null, beginDateLists);

        bannerCtrl.banner.begin_date = new Date(menor_date);
        bannerCtrl.banner.end_date = new Date(maior_data);
        if (useTimezone) {
          bannerCtrl.banner.gmt_timezone = timezone;
        }

        bannerCtrl.beginDateTime = new Date(menor_date);
        bannerCtrl.endDateTime = new Date(maior_data);

        dialogService.showToastInfo(translate.INFO_END_DATE_MAJOR_CAMPAIGN_ID, 5000);
      }
    }

    configSaveButton(false, translate.SAVE_ID);

    function isTimezoneNotNull(gmtTimezone) {
      return (gmtTimezone !== undefined && gmtTimezone !== null && gmtTimezone !== '');
    }

    function validateCheckboxCampaignDates() {
      if (bannerCtrl.campaigns.length <= 0 && bannerCtrl.checkboxDateCampaign === true) {
        dialogService.show(null, translate.CAMPAIGN_ID, translate.VALIDATE_CHECKBOX_CAMPAIGN_DATES_ID, null, null,
          translate.OK_ID, null);
        bannerCtrl.checkboxDateCampaign = false;
        return false;
      }

      getBiggestbeginAndEndDateFromCampaign();

    }

    function verifyEdit() {
      /*jshint -W116*/
      if (bannerCtrl.banner.id != undefined) {
        return true;
      }
      return false;
    }

    function getMinEndDate() {
      if (verifyEdit()) {
        return bannerCtrl.banner.begin_date;
      } else {
        return Date.now();
      }
    }

    function isBeginAndEndDateNotNull() {
      if ((bannerCtrl.beginDateTime !== undefined || bannerCtrl.beginDateTime != null) &&
        (bannerCtrl.endDateTime !== undefined || bannerCtrl.endDateTime != null)) {
        return true;
      } else {
        return false;
      }
    }

    function isBeginOrEndDateIsNull() {
      return !bannerCtrl.beginDateTime || !bannerCtrl.endDateTime;
    }

    function isBeginAndEndDateNull() {
      return !bannerCtrl.beginDateTime && !bannerCtrl.endDateTime;
    }

    function setTime() {
      /*jshint -W106*/
      /**
       * It has timezone or not and no dates
       */
      if ((isTimezoneNotNull(bannerCtrl.banner.gmt_timezone) || !isTimezoneNotNull(bannerCtrl.banner.gmt_timezone)) &&
        isBeginAndEndDateNull()) {
        bannerCtrl.banner.end_date = null;
        bannerCtrl.banner.begin_date = null;
        bannerCtrl.checkboxDateCampaign = false;
        bannerCtrl.banner.gmt_timezone = null;
        return;
      }

      /**
       * It has timezone and dates
       */

      if (isBeginAndEndDateNotNull() && isTimezoneNotNull(bannerCtrl.banner.gmt_timezone)) {
        bannerCtrl.banner.begin_date = moment.tz(moment(bannerCtrl.beginDateTime).format(format),
          bannerCtrl.banner.gmt_timezone).format();
        bannerCtrl.banner.end_date = moment.tz(moment(bannerCtrl.endDateTime).format(format),
          bannerCtrl.banner.gmt_timezone).format();
        return;
      }

      /**
       * It has timezone or not and a date
       */
      if ((isTimezoneNotNull(bannerCtrl.banner.gmt_timezone) || !isTimezoneNotNull(bannerCtrl.banner.gmt_timezone)) &&
        isBeginOrEndDateIsNull()) {
        if (bannerCtrl.beginDateTime) {
          bannerCtrl.banner.begin_date = moment.tz(moment(bannerCtrl.beginDateTime).format(format),
            bannerCtrl.banner.gmt_timezone).format();
          bannerCtrl.banner.end_date = null;
        } else {
          bannerCtrl.banner.end_date = moment.tz(moment(bannerCtrl.endDateTime).format(format),
            bannerCtrl.banner.gmt_timezone).format();
          bannerCtrl.banner.begin_date = null;
        }
        return;
      }
      /**
       * It has not timezone and two dates
       */
      if (!isTimezoneNotNull(bannerCtrl.banner.gmt_timezone) && isBeginAndEndDateNotNull()) {
        bannerCtrl.banner.begin_date = bannerCtrl.beginDateTime;
        bannerCtrl.banner.end_date = bannerCtrl.endDateTime;
        return;
      }
    }

    function getBanners() {
      /*jshint -W106*/
      var oldBanner = bannerPrepService;
      if (isTimezoneNotNull(bannerPrepService.gmt_timezone) && oldBanner.begin_date && oldBanner.begin_date) {
        oldBanner.begin_date = new Date(oldBanner.begin_date);
        oldBanner.end_date = new Date(oldBanner.end_date);
        bannerCtrl.beginDateTime = new Date(moment(oldBanner.begin_date).tz(oldBanner.gmt_timezone)
          .format('LLL'));
        bannerCtrl.endDateTime = new Date(moment(oldBanner.end_date).tz(oldBanner.gmt_timezone).format('LLL'));
      } else {
        bannerCtrl.beginDateTime = null;
        bannerCtrl.endDateTime = null;
      }
      return oldBanner;
    }

    function querySearchRegion(query) {
      return regionService.list(query, true, 'name', 1, true).then(function (data) {
        return data.results;
      });
    }

    function querySearchCampaign(query) {
      return campaignService.list('', '', '', query, true, 'name', 1).then(function (data) {
        return data.results;
      });
    }

    function querySearchGame(query) {
      return gameService.list(query, true, 'name', 1).then(function (data) {
        return data.results;
      });
    }

    function imageNotFound() {
      imageFound = false;
    }

    function removeTimestampFromBannerName(bannerNameWithTimeStamp) {
      var pos = bannerNameWithTimeStamp.lastIndexOf('_');
      var bannerNameWithoutTimestamp = bannerNameWithTimeStamp.substring(0, pos);
      return bannerNameWithoutTimestamp;
    }

    function clearImage(bannerForm) {
      if (bannerForm !== undefined) {
        resetInput(bannerForm.imageUrl);
        resetInput(bannerForm.targetUrl);
        resetInput(bannerForm.bannerName);
      } else {
        resetInput(bannerCtrl.bannerForm.imageUrl);
        resetInput(bannerCtrl.bannerForm.targetUrl);
        resetInput(bannerCtrl.bannerForm.bannerName);
      }

      bannerCtrl.viewImage = null;
      bannerCtrl.image = null;
      bannerCtrl.image_url = '';
      bannerCtrl.target_url = '';
      bannerCtrl.name = '';
      bannerCtrl.showProgress = false;
      bannerCtrl.language = '';
    }

    function changeImageUrl() {
      imageFound = true;
      bannerCtrl.viewImage = undefined;
      if (bannerCtrl.image_url !== undefined && bannerCtrl.image_url.length > 0) {
        bannerCtrl.viewImage = bannerCtrl.image_url;
      }
    }

    function changeUpload() {
      imageFound = true;
      bannerCtrl.viewImage = bannerCtrl.image;
      bannerCtrl.image_url = bannerCtrl.image.name;
    }

    function verifyImageType(bannerForm) {
      bannerCtrl.showProgress = true;
      bannerCtrl.name = bannerCtrl.name + '_' + Date.now();

      if (bannerForm !== undefined) {
        bannerCtrl.bannerForm = bannerForm;
      }

      if (bannerCtrl.image == null) {
        addUrls();
        return;
      }
      submitImage();
    }

    function getExt(filename) {
      var ext = filename.split('.').pop();
      if (ext === filename) {
        return '';
      }
      return ext;
    }

    function countryNamesFromRegions(regions) {
      bannerCtrl.country_names = [];
      if (regions.length > 0) {
        for (var i = 0; i < regions.length; i++) {
          for (var j = 0; j < regions[i].countries.length; j++) {
            bannerCtrl.country_names.push(regions[i].countries[j].country_name);
          }
        }
      }
      return bannerCtrl.country_names;
    }

    function hasDuplicatesCountriesInRegions(regionIndex) {

      if (bannerCtrl.banner.regions.length <= 0) {
        bannerCtrl.country_names = [];
        return false;
      }

      var names = countryNamesFromRegions(bannerCtrl.banner.regions);
      var valuesSoFar = Object.create(null);
      for (var i = 0; i < names.length; ++i) {
        var value = names[i];
        if (value in valuesSoFar) {
          $translate(['REGION_ID', 'OTHER_REGION_ADDED_ALREADY_ID', 'OK_ID'], {country: value})
            .then(showToastInfoTranslateMessage);
          bannerCtrl.banner.regions.splice(regionIndex - 1, 1);
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

    function cancel(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_CANCEL_ID, redirectState);
    }

    function submitImage() {
      bannerCtrl.loadingImage = true;
      fileUploadService.uploadFileToUrl(generateName(bannerCtrl.name), '', bannerCtrl.image, urlUtil.IMAGE, success,
        error, progress);
    }

    function success(response) {
      bannerCtrl.image_url = response.data;
      addUrls();
      resetInput(bannerCtrl.bannerForm.imageUrl);
      resetInput(bannerCtrl.bannerForm.targetUrl);
    }

    function error() {
      bannerCtrl.loadingImage = false;
      dialogService.show(null, translate.UPLOAD_ID, translate.ERROR_UPLOAD_IMAGE_ID, translate.BANNER_DIALOG_ID,
        true, translate.CLOSE_ID, null);
    }

    function progress(evt) {
      bannerCtrl.loadingImageProgress = parseInt(100.0 * evt.loaded / evt.total);
    }

    function disable() {
      return !(bannerCtrl.banner.banner_configuration_name &&
      bannerCtrl.banner.regions.length > 0 &&
      bannerCtrl.banner.banners.length > 0 &&
      bannerCtrl.banner.games.length > 0 &&
      ((isTimezoneNotNull(bannerCtrl.banner.gmt_timezone) && (bannerCtrl.beginDateTime && bannerCtrl.endDateTime)) ||
      (!bannerCtrl.beginDateTime && !bannerCtrl.endDateTime)));
    }

    function disableUrls() {
      return !(bannerCtrl.name && bannerCtrl.target_url && (bannerCtrl.image || bannerCtrl.image_url));
    }

    function removeUrl(url) {
      var index = bannerCtrl.banner.banners.indexOf(url);
      bannerCtrl.banner.banners.splice(index, 1);
    }

    function showCountryName(country) {
      return languageService.getLanguageName(country);
    }

    function addUrls() {
      var url = {
        image_url: bannerCtrl.image_url,
        target_url: bannerCtrl.target_url,
        language: setLanguage(bannerCtrl.language),
        name: bannerCtrl.name
      };
      bannerCtrl.banner.banners.push(url);
      clearImage();
    }

    function setLanguage(language) {
      if (language === null || language === '' || language === undefined) {
        return 'ALL';
      }
      return language;

    }

    function saveBanner() {
      configSaveButton(true, translate.SAVING_ID);
      setTime();
      bannerCtrl.banner.is_using_campaign_date = bannerCtrl.checkboxDateCampaign;
      $state.current.data.save(bannerService, bannerCtrl.banner, saveSuccess, saveError);
    }

    function save(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_BANNER_SAVE_ID, saveBanner);
    }

    function saveError(response) {
      configSaveButton(false, 'SAVE_ID');
    }

    function saveSuccess(response) {
      $state.go('home.banner.list');
      dialogService.showToast(translate.SUCCESS_SAVE_ID);
    }

    function generateName(imageName) {
      return 'banner/' + imageName + '.' + getExt(bannerCtrl.image.name);
    }

    function redirectState() {
      $state.go('home.banner.list');
    }

    function configSaveButton(buttonSave, buttonText) {
      bannerCtrl.buttonSave = buttonSave;
      bannerCtrl.buttonText = buttonText;
    }

    function setTimezoneBanner() {
      bannerCtrl.timezoneRequired = true;
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

})
();
