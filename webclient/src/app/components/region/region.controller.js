(function () {
  'use strict';

  angular
    .module('gmm')
    .controller('RegionController', RegionController);

  /* @ngInject */
  function RegionController($state, dialogService, countryService, regionService, regionPrepService,
                            regionPrepTranslateService) {

    var regionCtrl = this;
    var translate = regionPrepTranslateService;
    regionCtrl.querySearch = querySearch;
    regionCtrl.cancel = cancel;
    regionCtrl.disabled = disabled;
    regionCtrl.region = regionPrepService;
    regionCtrl.regions = regionCtrl.region.countries;
    regionCtrl.countries = loadCountries();
    regionCtrl.save = save;

    configSaveButton(false, translate.SAVE_ID);

    function cancel(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_CANCEL_ID, redirectState);
    }

    function redirectState() {
      $state.go('home.settings.region.list');
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      /*jshint -W106*/
      return function filterFn(country) {
        return (country.country_name.toLowerCase().indexOf(lowercaseQuery) === 0);
      };
    }

    function disabled() {
      return !regionCtrl.region.name || !regionCtrl.region.color || regionCtrl.regions.length <= 1;
    }

    function loadCountries() {
      var arr = [];
      var countries = countryService.getAll();

      for (var country  in countries) {
        if (countries[country] !== null) {
          var aux = countries[country];
          arr.push(aux);
        }
      }
      /*jshint -W106*/
      return arr.map(function (country) {
        var countryAux = {};
        countryAux.country_name = country.name;
        countryAux.country_code = country.code;
        return countryAux;
      });
    }

    function querySearch(query) {
      var results = query ? regionCtrl.countries.filter(createFilterFor(query)) : [];
      return results;
    }

    function saveError(response) {
      configSaveButton(false, translate.SAVE_ID);
    }

    function save(ev) {
      dialogService.showConfirm(ev, translate.CONFIRM_SAVE_REGION_ID, saveRegion);
    }

    function saveRegion() {
      configSaveButton(true, translate.SAVING_ID);
      $state.current.data.save(regionService, regionCtrl.region, saveSuccess, saveError);
    }

    function saveSuccess(response) {
      redirectState();
      dialogService.showToast (translate.SUCCESS_SAVE_ID);
    }

    function configSaveButton(buttonSave, buttonText) {
      regionCtrl.buttonSave = buttonSave;
      regionCtrl.buttonText = buttonText;
    }

  }

})();
