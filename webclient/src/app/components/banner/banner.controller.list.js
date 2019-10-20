(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('BannerControllerList', BannerControllerList);

  /* @ngInject */
  /*jshint -W071*/
  /*jshint -W072*/
  function BannerControllerList($scope, $state, $mdSidenav, $translate, bannerPrepService, bannerService, dialogService,
                                exportCsvService, querySearchService, bannerListPrepTranslateService,
                                gmmAnalyticsService) {

    var bannerCtlList = this;
    var dateNow = new Date();
    var translate = bannerListPrepTranslateService;
    var listCount = bannerPrepService.count;
    bannerCtlList.translate = $translate;
    bannerCtlList.lastField = 'status';
    bannerCtlList.status = 'all';
    bannerCtlList.banners = [];
    bannerCtlList.regions = [];
    bannerCtlList.games = [];
    bannerCtlList.campaigns = [];
    bannerCtlList.infinityList = 1;
    bannerCtlList.slideInterval = 3000;
    bannerCtlList.list = bannerPrepService.results;
    bannerCtlList.lastQuery = '';
    bannerCtlList.ascendant = false;
    bannerCtlList.export = exportCsvService.exportBanner;
    bannerCtlList.export.getCsvExport = getCsvExport;
    bannerCtlList.controllerToolbar = $scope.$parent.homeCtrl;
    bannerCtlList.controllerToolbar.new = newBanner;
    bannerCtlList.controllerToolbar.viewAll = viewAllBanners;
    bannerCtlList.controllerToolbar.change = change;
    bannerCtlList.controllerToolbar.filter = true;
    bannerCtlList.querySearchBanner = querySearchService.querySearchBanner;
    bannerCtlList.querySearchRegion = querySearchService.querySearchRegion;
    bannerCtlList.querySearchGame = querySearchService.querySearchGame;
    bannerCtlList.querySearchCampaign = querySearchService.querySearchCampaign;
    bannerCtlList.clearFilter = clearFilter;
    bannerCtlList.closeSidenavFilter = closeSidenavFilter;
    bannerCtlList.filter = filter;
    bannerCtlList.filterStatus = filterStatus;
    bannerCtlList.getCampaignsNames = getCampaignsNames;
    bannerCtlList.getGamesNames = getGamesNames;
    bannerCtlList.getStatus = getStatus;
    bannerCtlList.lowercaseCountryCode = lowercaseCountryCode;
    bannerCtlList.nextList = nextList;
    bannerCtlList.ordinations = ordinations;
    bannerCtlList.removeBanner = removeBanner;
    bannerCtlList.removeCampaign = removeCampaign;
    bannerCtlList.removeGame = removeGame;
    bannerCtlList.removeRegion = removeRegion;
    bannerCtlList.showDialog = showDialog;
    bannerCtlList.showFilter = showFilter;

    gmmAnalyticsService.authorize(onSingIn, onError);

    function getBannersString() {
      return querySearchService.getIds(bannerCtlList.banners).toString();
    }

    function getGamesString() {
      return querySearchService.getIds(bannerCtlList.games).toString();
    }

    function getRegionsString() {
      return querySearchService.getRegionsId(bannerCtlList.regions).toString();
    }

    function getCampaignsString() {
      return querySearchService.getIds(bannerCtlList.campaigns).toString();
    }

    function clearFilter() {
      var CLEAR = '';
      bannerCtlList.lastField = 'status';
      bannerCtlList.ascendant = false;
      bannerCtlList.status = 'all';
      bannerCtlList.games = [];
      bannerCtlList.regions = [];
      bannerCtlList.campaigns = [];
      bannerCtlList.banners = [];
      filterBanner(CLEAR, CLEAR, CLEAR, CLEAR, success);
    }

    function closeSidenavFilter() {
      $mdSidenav('right').close();
    }

    function showFilter() {
      return (bannerCtlList.banners.length > 0 || bannerCtlList.games.length > 0 || bannerCtlList.regions.length > 0 ||
      bannerCtlList.campaigns.length > 0 || bannerCtlList.status !== 'all');
    }

    function filter() {
      bannerCtlList.infinityList = 1;
      filterBanner(getBannersString(), getGamesString(), getRegionsString(), getCampaignsString(), success);
    }

    function filterBanner(banners, games, regions, campaigns, success) {
      bannerService.list(banners, games, regions, campaigns, bannerCtlList.lastQuery, bannerCtlList.ascendant,
        bannerCtlList.lastField, bannerCtlList.infinityList, bannerCtlList.status).then(success);
    }

    function removeBanner(item) {
      var bannersID = querySearchService.getIds(bannerCtlList.banners);
      bannersID.splice(querySearchService.remove(bannerCtlList.banners, item), 1);
      filterBanner(bannersID.toString(), getGamesString(), getRegionsString(), getCampaignsString(), success);
    }

    function removeGame(item) {
      var gamesID = querySearchService.getIds(bannerCtlList.games);
      gamesID.splice(querySearchService.remove(bannerCtlList.games, item), 1);
      filterBanner(getBannersString(), gamesID.toString(), getRegionsString(), getCampaignsString(), success);
    }

    function removeRegion(iten) {
      var regionsID = querySearchService.getRegionsId(bannerCtlList.regions);
      regionsID.splice(querySearchService.remove(bannerCtlList.regions, iten), 1);
      filterBanner(getBannersString(), getGamesString(), regionsID.toString(), getCampaignsString(), success);
    }

    function removeCampaign(iten) {
      var campaignsID = querySearchService.getIds(bannerCtlList.campaigns);
      campaignsID.splice(querySearchService.remove(bannerCtlList.campaigns, iten), 1);
      filterBanner(getBannersString(), getGamesString(), getRegionsString(), campaignsID.toString(), success);
    }


    function ordinations() {
      bannerCtlList.ordersList = [
        {'key': 'begin_date', 'value': translate.BEGIN_DATE_ID},
        {'key': 'created_date', 'value': translate.CREATED_ID},
        {'key': 'end_date', 'value': translate.END_DATE_ID},
        {'key': 'banner_configuration_name', 'value': translate.NAME_ID},
        {'key': 'status', 'value': translate.STATUS_ID},
        {'key': 'modified_date', 'value': translate.UPDATE_ID}
      ];
    }

    function filterStatus() {
      bannerCtlList.statusList = [
        {'key': 'all', 'value': translate.ALL_ID},
        {'key': 'started', 'value': translate.STARTED_ID},
        {'key': 'about to start', 'value': translate.ABOUT_TO_START_ID},
        {'key': 'paused', 'value': translate.PAUSED_ID},
        {'key': 'finished', 'value': translate.FINISHED_ID}
      ];
    }


    function listStatus(objectsWithName) {
      if (objectsWithName === true) {
        return 'IT_HAS_BEEN_EXPIRED_ID';
      }
    }

    function getStatus(banner) {
      /*jshint -W106*/
      return listStatus(banner.is_expired);
    }

    function getCsvExport() {
      bannerCtlList.export.fileName = bannerCtlList.export.bannerFileName();

      return bannerService.list(getBannersString(), getGamesString(), getRegionsString(), getCampaignsString(),
        bannerCtlList.lastQuery, bannerCtlList.ascendant, bannerCtlList.lastField, bannerCtlList.infinityList,
        'all').then(successAll);
      function successAll(data) {
        return bannerCtlList.export.bannerExport(data.results);
      }
    }

    function listNames(objectsWithName) {
      var response = '';

      for (var i in objectsWithName) {
        if (objectsWithName[i] !== null) {
          response += objectsWithName[i].name + ', ';
        }
      }
      return response.substring(0, (response.length - 2));
    }

    function getCampaignsNames(banner) {
      return listNames(banner.campaigns);
    }

    function getGamesNames(banner) {
      return listNames(banner.games);
    }

    function change(query) {

      bannerCtlList.lastQuery = query;
      bannerCtlList.lastField = 'name';
      bannerCtlList.ascendant = true;
      bannerCtlList.infinityList = 1;
      bannerService.list(getBannersString(), getGamesString(), getRegionsString(), getCampaignsString(),
        bannerCtlList.lastQuery, bannerCtlList.ascendant, bannerCtlList.lastField, bannerCtlList.infinityList,
        bannerCtlList.status).then(success);
    }

    function success(data) {
      bannerCtlList.list = data.results;
      listCount = data.count;
    }

    function newBanner() {
      $state.go('home.banner.create');
    }

    function showDialog(ev, banner) {
      dialogService.showBannerDialog(ev, DialogController);

      return {dialogController: DialogController};

      /* @ngInject */
      function DialogController($mdDialog, languageService) {

        var dialogCtrl = this;
        dialogCtrl.banner = banner;
        dialogCtrl.myInterval = 0;
        dialogCtrl.noWrapSlides = false;
        dialogCtrl.activate = activate;
        dialogCtrl.cancel = cancel;
        dialogCtrl.lowercaseCountryCode = lowercaseCountryCode;
        dialogCtrl.getCampaignsNames = getCampaignsNames;
        dialogCtrl.getLanguageName = getLanguageName;
        dialogCtrl.getGamesNames = getGamesNames;

        getAnalyticsClickBanner();

        return dialogCtrl;

        function getAnalyticsClickBanner() {
          /*jshint -W106*/
          for (var i in dialogCtrl.banner.games) {
            if (dialogCtrl.banner.games[i].analytics_view_id !== null ||
              dialogCtrl.banner.games[i].analytics_view_id !== undefined) {
              for (var j in dialogCtrl.banner.banners) {
                if (dialogCtrl.banner.banners[j] !== null) {
                  dialogCtrl.banner.banners[j].numberClick = 0;
                  dialogCtrl.banner.banners[j].analyticsLinks = [];
                  gmmAnalyticsService.queryExplorer(dialogCtrl.banner.games[i].analytics_view_id,
                    getNameImage(dialogCtrl.banner.banners[j].image_url), onReportSuccess, onError);
                }
              }
            }
          }
        }

        function getNameImage(url) {
          var res = url.split('/');
          return res[res.length - 1];
        }

        function getNameFilters(filter) {
          var res = filter.split('@');
          return res[res.length - 1];
        }

        function onReportSuccess(response) {
          angular.forEach(response.rows, function (value, key) {
            var profileInfo = {
              accountId: response.profileInfo.accountId,
              internalWebPropertyId: response.profileInfo.internalWebPropertyId,
              profileId: response.profileInfo.profileId
            };
            setNumberClickBanner(getNameFilters(response.query.filters), value[0], profileInfo);
          });
        }

        function setNumberClickBanner(name, numberClick, profileInfo) {
          /*jshint -W106*/
          for (var i in dialogCtrl.banner.banners) {
            if (getNameImage(dialogCtrl.banner.banners[i].image_url) === name &&
              verifiedIncrement(dialogCtrl.banner.banners[i].analyticsLinks, profileInfo)) {
              var url = gmmAnalyticsService.mountAnalyticsLink(dialogCtrl.banner.banners[i].image_url, profileInfo);
              var analyticsLink = addAnalyticsLink(profileInfo, url);
              dialogCtrl.banner.banners[i].analyticsLinks.push(analyticsLink);
              dialogCtrl.banner.banners[i].numberClick += parseInt(numberClick);
            }
          }
        }

        function verifiedIncrement(analyticsLinks, profileInfo) {
          for (var i in analyticsLinks) {
            if (analyticsLinks[i].profileId === profileInfo.profileId) {
              return false;
            }
          }
          return true;
        }

        function addAnalyticsLink(profileInfo, url) {
          /*jshint -W106*/
          /*jshint -W116*/
          var analyticsLink = {game: '', link: url};
          for (var i in dialogCtrl.banner.games) {
            if (dialogCtrl.banner.games[i].analytics_view_id == profileInfo.profileId) {
              analyticsLink.game = dialogCtrl.banner.games[i].name;
              analyticsLink.gameImage = dialogCtrl.banner.games[i].game_image;
              analyticsLink.profileId = profileInfo.profileId;
            }
          }
          return analyticsLink;
        }

        function activate(ev, active) {
          $mdDialog.cancel();
          bannerCtlList.translate('CONFIRM_ACTIVATE_BANNER_ID', {'status': msgStatus(banner.active)})
            .then(showToastInfoTranslateMessage);

          function showToastInfoTranslateMessage(translation) {
            dialogService.showConfirm(ev, translation, activeBanner);
          }

          function activeBanner() {
            dateNow = new Date();
            bannerService.activatedBanner(dialogCtrl.banner, active).then(success);
          }
        }

        function getLanguageName(code) {
          return languageService.getLanguageName(code);
        }

        function msgStatus(status) {
          var msg = translate.ENABLE_ID;
          if (status) {
            msg = translate.DISABLE_ID;
          }
          return msg;
        }

        function success(data) {
          banner.active = data.active;
          bannerCtlList.filter();
          bannerCtlList.translate('SUCCESS_BANNER_CHANGE_ENABLED_STATUS_ID', {'status': msgStatus(banner.active)})
            .then(showToastTranslate);
          function showToastTranslate(translation) {
            bannerCtlList.filter();
            dialogService.showToast (translation);
          }
        }

        function cancel() {
          $mdDialog.cancel();
        }
      }
    }

    function onSingIn() {
      dialogService.showToastInfo(translate.INFO_ANALYTICS_SIGNED_IN_ID, 5000);
    }

    function onError(response) {
      dialogService.showToastInfo(response.error.message, 5000);
    }

    function viewAllBanners() {
      $state.go('home.banner.list', {}, {reload: true});
    }

    function lowercaseCountryCode(countryCode) {
      return angular.lowercase(countryCode);
    }

    function nextList() {
      if (listCount > bannerCtlList.list.length) {
        ++bannerCtlList.infinityList;
        bannerService.list(getBannersString(), getGamesString(), getRegionsString(), getCampaignsString(),
          bannerCtlList.lastQuery, bannerCtlList.ascendant, bannerCtlList.lastField, bannerCtlList.infinityList,
          bannerCtlList.status).then(successPush);
      }

      function successPush(data) {
        if (data.results.length > 0) {
          bannerCtlList.list.push.apply(bannerCtlList.list, data.results);
          listCount = data.count;
        }
      }
    }
  }
})();
