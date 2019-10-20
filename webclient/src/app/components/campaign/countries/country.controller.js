(function () {
	'use strict';
	
	angular.module('gmm')
		.controller('CountryController', CountryController);
		
		/* @ngInject */
		function CountryController (countryService) {    

			var countryCtl = this;
			countryCtl.countries = countryService.getAll();    

		}

})();
