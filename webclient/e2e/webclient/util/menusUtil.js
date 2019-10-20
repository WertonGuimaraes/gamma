/**
 * Created by Filipe on 29/10/2015.
 */
var MenuUtil = function() {

  return {
    setMenuPlayers : function(){
      element(by.id('menuPlayersBtn')).click();
    },

    setMenuCampaign : function() {
      element(by.id('menuCampaignBtn')).click();
    },

    setMenuParticipants : function() {
      element(by.id('menuParticipantsBtn')).click();
    },

    setMenuGame : function(){
      element(by.id('menuGameBtn')).click();
    },

    setMenuBanner : function() {
      element(by.id('menuBannerBtn')).click();
    },

    setCreateCampaign : function() {
      element(by.id('menuCampaignBtn')).click()
      $('#content .ng-scope.md-default-theme').click();
    }
  }
};

module.exports = new MenuUtil();
