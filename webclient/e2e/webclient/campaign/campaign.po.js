
'use strict';

var CampaignPage = function() {

	return {
		getList : function(){
			return element(by.id('campaignList')).sendKeys(userName);
		}
	}
};

module.exports = new CampaignPage();