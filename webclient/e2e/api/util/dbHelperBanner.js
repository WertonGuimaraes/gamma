/**
 * Created by Gilmar on 07/03/2016.
 */

'use strict';



var dbUtil = function(){

  var dbUtilHelper = require('./dbHelper.js');
  var dbHelperGame = require('./dbHelperGame.js');



  return {

    insertOneBannerInOneGame : function() {
      dbHelperGame.insertGame();
      dbUtilHelper.run("insert into gmm_banner_bannerconfiguration(id, banner_configuration_name, active, begin_date, end_date, gmt_timezone, created_date) values (100,'NameBanner',1,'2015-10-25 12:00:00.000000', '2017-10-25 12:00:00.000000', 'America/Recife', '2015-10-24 12:00:00.000000')");
      dbUtilHelper.run("insert into gmm_banner_bannerconfiguration_games(id, bannerconfiguration_id, game_id) values (10,100,1000)");
      dbUtilHelper.run("insert into gmm_banner_banner(id, name, image_url, target_url,language,bannerconfiguration_id) values (1, 'default name', 'http://cdn.slashgear.com/wp-content/uploads/2015/05/zenny.jpg','http://www.asus.com.br/','PT',100)");
      dbUtilHelper.run("insert into gmm_banner_bannerconfiguration_regions(id, bannerconfiguration_id,region_id) values (10, 100 , 32)");
    },

    insertManyBannerInOneGame : function() {
      dbHelperGame.insertGame();
      dbUtilHelper.run("insert into gmm_banner_bannerconfiguration(id, banner_configuration_name, active, begin_date, end_date, gmt_timezone, created_date) values (100,'NameBanner',1,'2015-10-25 12:00:00.000000', '2017-10-25 12:00:00.000000', 'America/Recife', '2015-10-24 12:00:00.000000')");
      dbUtilHelper.run("insert into gmm_banner_bannerconfiguration_games(id, bannerconfiguration_id, game_id) values (10,100,1000)");
      dbUtilHelper.run("insert into gmm_banner_banner(id, name, image_url, target_url, language, bannerconfiguration_id) values (100, 'default name', 'http://cdn.slashgear.com/wp-content/uploads/2015/05/zenny.jpg','https://www.asus.com.br', 'PT', 100)");
      dbUtilHelper.run("insert into gmm_banner_banner(id, name, image_url, target_url, language, bannerconfiguration_id) values (101, 'default name', 'http://gamehall.uol.com.br/kapoow/wp-content/uploads/2015/08/P1040273-1024x651.jpg','http://loja.asus.com.br/acessorios/zenfone/acessorios-zenfone-go.html','PT',100)");
      dbUtilHelper.run("insert into gmm_banner_banner(id, name, image_url, target_url, language, bannerconfiguration_id) values (102, 'default name', 'http://lighthouseinsights.in/wp-content/uploads/2015/11/Asus_Zennykipehlidiwali-728x483.jpg','http://loja.asus.com.br','PT',100)");
      dbUtilHelper.run("insert into gmm_banner_bannerconfiguration_regions(id, bannerconfiguration_id,region_id) values (10, 100 , 32)");
    }

  };
};

module.exports = new dbUtil();
