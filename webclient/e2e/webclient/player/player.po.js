/**
 * Created by Filipe on 29/10/2015.
 */
'use strict';

var PlayerPage = function (){
  return {
    getTitleList : function() {
      var title_list = element(by.id('titleListplayers'));
      var title_email = element(by.id('columnEmail'));
      var title_gpgid = element(by.id('columnGpgid'));
      var title_gcmid = element(by.id('columnGcmid'));
      return {
        title_list: title_list,
        title_email: title_email,
        title_gpgId : title_gpgid,
        title_gmcId: title_gcmid
      }
    },
    getInfoPlayer : function() {
      var list = element.all(by.tagName('td'));
      var player_email = list.get(0);
      var player_gpgId = list.get(1);
      var player_gcmId = list.get(2);
      return {
        email : player_email,
        gpgId : player_gpgId,
        gcmId : player_gcmId
      }
    },
    getHavePlayers : function() {
      var list = element.all(by.tagName('td'));
      return list.get(0).isNull;
    }
  }
};

module.exports = new PlayerPage();
