(function(){
	'use strict';

	angular.module('gmm')
	.filter('countryname', countryname);

	/* @ngInject */
	function countryname (countryService) {

		return function(code) {
			return countryService.getName(code);
		};

	}

})();
