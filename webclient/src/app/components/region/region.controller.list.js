(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('RegionControllerList', RegionControllerList);

  /* @ngInject */
  function RegionControllerList($scope, $state, dialogService, regionPrepService, regionService, countryService,
                                exportCsvService) {

    var lastField = 'name';
    var regionCtlList = this;
    var listCount = count();
    regionCtlList.infinityList = 1;
    regionCtlList.list = list();
    regionCtlList.lowercaseCountryCode = lowercaseCountryCode;
    regionCtlList.nextList = nextList;
    regionCtlList.lastQuery = '';
    regionCtlList.controllerToolbar = $scope.$parent.homeCtrl;
    regionCtlList.controllerToolbar.new = newRegion;
    regionCtlList.controllerToolbar.viewAll = viewAllRegion;
    regionCtlList.controllerToolbar.change = change;
    regionCtlList.orderBy = orderBy;
    regionCtlList.ascendant = true;
    regionCtlList.isLastSortedField = isLastSortedField;
    regionCtlList.checkLastField = checkLastField;
    regionCtlList.getCountriesNames = getCountriesNames;
    regionCtlList.showDialog = showDialog;
    regionCtlList.export = exportCsvService.exportRegion;
    regionCtlList.export.getCsvExport = getCsvExport;

    function getCsvExport() {
      regionCtlList.export.fileName = regionCtlList.export.regionFileName();
      return regionService.list(regionCtlList.lastQuery, regionCtlList.ascendant, lastField, 'all', false)
        .then(successAll);
      function successAll(data) {
        return regionCtlList.export.regionExport(data.results);
      }
    }

    function orderBy(field) {
      regionCtlList.infinityList = 1;
      regionCtlList.ascendant = isLastSortedField(field) ? !regionCtlList.ascendant : false;
      regionService.list(regionCtlList.lastQuery, regionCtlList.ascendant, field,
        regionCtlList.infinityList, false).then(success);
      lastField = field;
    }

    function isLastSortedField(field) {
      return field === lastField;
    }

    function checkLastField(field) {
      return isLastSortedField(field) ? 'selected' : 'default';
    }

    function change(query) {

      regionCtlList.lastQuery = query;
      lastField = 'name';
      regionCtlList.ascendant = true;
      regionCtlList.infinityList = 1;
      regionService.list(regionCtlList.lastQuery, regionCtlList.ascendant, lastField,
        regionCtlList.infinityList, false).then(success);

    }

    function getCountriesNames(countries) {
      var regionName = '';
      /*jshint -W106*/
      for (var i in countries) {
        if (countries[i] !== null) {
          regionName += countries[i].country_name + ', ';
        }
      }

      return regionName.substring(0, (regionName.length - 2));
    }

    function success(data) {
      regionCtlList.list = data.results;
      listCount = data.count;
    }

    function lowercaseCountryCode(countryCode) {
      return angular.lowercase(countryCode);
    }

    function newRegion() {
      $state.go('home.settings.region.create');
    }

    function viewAllRegion() {
      $state.go('home.settings.region.list', {}, {reload: true});
    }

    function list() {
      return regionPrepService.results;
    }

    function count() {
      return regionPrepService.count;
    }

    function nextList() {
      if (listCount > regionCtlList.list.length) {
        ++regionCtlList.infinityList;
        regionService.list(regionCtlList.lastQuery, regionCtlList.ascendant, lastField,
          regionCtlList.infinityList, false).then(successPush);
      }
      function successPush(data) {
        regionCtlList.list.push.apply(regionCtlList.list, data.results);
        listCount = data.count;
      }
    }

    function showDialog(ev, region) {
      dialogService.showRegionDialog(ev, DialogController);

      return {dialogController: DialogController};

      /* @ngInject */
      function DialogController($mdDialog) {

        var dialogCtrl = this;
        dialogCtrl.region = region;
        dialogCtrl.cancel = cancel;
        dialogCtrl.lowercaseCountryCode = lowercaseCountryCode;

        return dialogCtrl;

        function cancel() {
          $mdDialog.cancel();
        }
      }
    }

  }

})();
