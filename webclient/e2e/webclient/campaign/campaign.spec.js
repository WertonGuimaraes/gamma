'use strict';

describe('Campaign Tests', function () {

	beforeEach(function () {
    	browser.get('/#/campaign');
  	});

  	it('should have app title', function() {
    	expect(browser.getTitle()).toEqual('GaMMa');
  	});
});
