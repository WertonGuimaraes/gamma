/**
 * Created by Gilmar on 02/03/2016.
 */

'use strict';

var dbUtilGame = require('./dbHelperGame.js');
var dbUtil = function(){


  var dbUtilHelper = require('./dbHelper.js');
  var form_value = '{\\"zix\\":{\\"score\\":\\"12\\"}}';

  return {

    insertCampaign : function() {
      dbUtilGame.insertUserGame();
      dbUtilHelper.run("insert into gmm_campaign_campaign (id, name, active, begin_date, end_date, gmt_timezone, participant_limit, created_date) values (1000, 'Zenny Worldz', 1,'2015-10-25 12:00:00.000000', '2016-10-25 12:00:00.000000', 'America/Recife', 3, '2015-10-24 12:00:00.000000')");
      dbUtilHelper.run ("insert into gmm_campaign_campaign_regions (id, campaign_id, region_id) values (1000, 1000, 32 )");
      dbUtilHelper.run ("insert into gmm_campaign_rule (id, form_value, campaign_id, game_id) values (1000, '"+ form_value +"', 1000, 1000)");
    },

    insertMoreOneCampaign : function() {
      dbUtil().insertCampaign();
      dbUtilHelper.run ("insert into gmm_campaign_campaign (id, name, active, begin_date, end_date, gmt_timezone, participant_limit, created_date) values (1001, 'Zenny Natal', 1,'2015-10-25 12:00:00.000000', '2016-10-25 12:00:00.000000','America/Recife', 3, '2015-10-24 12:00:00.000000')");
      dbUtilHelper.run ("insert into gmm_campaign_campaign_regions (id, campaign_id, region_id) values (1001, 1001, 32 )");
      dbUtilHelper.run ("insert into gmm_campaign_rule (id, form_value, campaign_id, game_id) values (1001, '"+ form_value +"', 1001, 1000)");
    },

    insertCampaignWithAllUser : function () {
      dbUtilGame.insertUserGame();
      dbUtilHelper.run( "insert into gmm_push_environmentinfo(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date, app_language) values (1001, 'en-us', '1.2.1', 'success', 'United States', 'US', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:41Z', 'pt')");
      dbUtilHelper.run( "insert into gmm_push_deviceuser(id, email, gpg_id, gcm_id, registered_at, environment_info_id, game_id, last_date_played) values (1001, 'qatests1@embedded.com', '1000200030001', '2000200020001','2015-10-2 12:00:00.000000', 1001, 1000, '2015-12-2 12:00:00.000000')");
      dbUtilHelper.run ("insert into gmm_campaign_campaign (id, name, active, begin_date, end_date, gmt_timezone, participant_limit, created_date) values (1000, 'Zenny Worldz', 1,'2015-10-25 12:00:00.000000', '2016-10-25 12:00:00.000000','America/Recife', 1, '2015-10-24 12:00:00.000000')");
      dbUtilHelper.run ("insert into gmm_campaign_campaign_regions (id, campaign_id, region_id) values (1000, 1000, 32 )");
      dbUtilHelper.run ("insert into gmm_campaign_rule (id, form_value, campaign_id, game_id) values (1000, '"+ form_value +"', 1000, 1000)");
      dbUtilHelper.run("insert into gmm_campaign_location(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date) values (1000, 'en-us', '1.2.1', 'success', 'Brazil', 'BR', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:40Z')");

      dbUtilHelper.run ("insert into gmm_campaign_participation (id, info, player_id, registered_at, campaign_id, location_id) values (1000, 'Automated Test', 1000, '2015-10-25 12:00:00.000000',1000,1000)");

    },

    insertCampaignNotStaterd : function() {
      dbUtilGame.insertUserGame();
      dbUtilHelper.run ("insert into gmm_campaign_campaign (id, name, active, begin_date, end_date, participant_limit) values (1000, 'Zenny Worldz', 1,'2016-10-2 12:00:00.000000', '2016-10-22 12:00:00.000000', 3)");
      dbUtilHelper.run ("insert into gmm_campaign_campaign_regions (id, campaign_id, region_id) values (1000, 1000, 32 )");
      dbUtilHelper.run ("insert into gmm_campaign_rule (id, form_value,campaign_id, game_id) values (1000, '"+ form_value +"', 1000, 1000)");
    },

    insertCampaignFinished : function() {
      dbUtilGame.insertUserGame();
      dbUtilHelper.run ("insert into gmm_campaign_campaign (id, name, active, begin_date, end_date, participant_limit) values (1000, 'Zenny Worldz', 1,'2016-1-1 12:00:00.000000', '2016-1-10 12:00:00.000000', 3)");
      dbUtilHelper.run ("insert into gmm_campaign_campaign_regions (id, campaign_id, region_id) values (1000, 1000, 32 )");
      dbUtilHelper.run ("insert into gmm_campaign_rule (id, form_value, campaign_id, game_id) values (1000, '"+ form_value +"', 1000, 1000)");
    },

    insertCampaignFinishedWithUserLimitExceeded : function() {
      dbUtilGame.insertUserGame();
      dbUtilHelper.run ("insert into gmm_campaign_campaign (id, name, active, begin_date, end_date, participant_limit) values (1000, 'Zenny Worldz', 1,'2016-1-1 12:00:00.000000', '2020-1-10 12:00:00.000000', 1)");
      dbUtilHelper.run ("insert into gmm_campaign_campaign_regions (id, campaign_id, region_id) values (1000, 1000, 32 )");
      dbUtilHelper.run ("insert into gmm_campaign_rule (id, form_value, campaign_id, game_id) values (1000, '"+ form_value +"', 1000, 1000)");

      dbUtilHelper.run( "insert into gmm_campaign_location(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date) values (1000, 'en-us', '1.2.1', 'success', 'Brazil', 'BR', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:40Z')");
      dbUtilHelper.run ("insert into gmm_campaign_participation (id, info, player_id, registered_at, campaign_id, location_id) values (1000, 'Automated Test', 1000, '2015-10-25 12:00:00.000000',1000,1000)");


    },

    insertCampaignDisable : function () {
      dbUtilGame.insertUserGame();
      dbUtilHelper.run ("insert into gmm_campaign_campaign (id, name, active, begin_date, end_date, participant_limit) values (1000, 'Zenny Worldz', 0,'2016-1-25 12:00:00.000000', '2016-10-25 12:00:00.000000', 1)");
      dbUtilHelper.run ("insert into gmm_campaign_campaign_regions (id, campaign_id, region_id) values (1000, 1000, 32 )");
      dbUtilHelper.run ("insert into gmm_campaign_rule (id, form_value, campaign_id, game_id) values (1000, '"+ form_value +"',1000, 1000)");
    },

    insertCampaignInOtherRegion : function () {
      dbUtilGame.insertUserGame();
      dbUtilHelper.run( "insert into gmm_push_environmentinfo(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date, app_language) values (1001, 'en-us', '1.2.1', 'success', 'United States', 'US', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:41Z', 'pt')");
      dbUtilHelper.run( "insert into gmm_push_deviceuser(id, email, gpg_id, gcm_id, registered_at, environment_info_id, game_id, last_date_played) values (1001, 'qatests1@embedded.com', '1000200030001', '2000200020001', '2015-1-25 12:00:00.000000', 1001, 1000, '2016-1-25 12:00:00.000000')");
      dbUtilHelper.run ("insert into gmm_campaign_campaign (id, name, active, begin_date, end_date, participant_limit) values (1000, 'Zenny Worldz', 0,'2016-1-25 12:00:00.000000', '2016-10-25 12:00:00.000000', 1)");
      dbUtilHelper.run ("insert into gmm_campaign_campaign_regions (id, campaign_id, region_id) values (1000, 1000, 32 )");
      dbUtilHelper.run ("insert into gmm_campaign_rule (id, form_value, campaign_id, game_id) values (1000, '" + form_value + "', 1000, 1000)");
      dbUtilHelper.run( "insert into gmm_campaign_location(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date) values (1000, 'en-us', '1.2.1', 'success', 'Argentina', 'AR', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:40Z')");
      dbUtilHelper.run ("insert into gmm_campaign_participation (id, info, player_id, registered_at, campaign_id, location_id) values (1000, 'Automated Test', 1000, '2015-10-25 12:00:00.000000',1000,1000)");

    },

    insertCampaignWithUser : function () {
      dbUtil().insertCampaign();
      dbUtilHelper.run( "insert into gmm_campaign_location(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date) values (1000, 'en-us', '1.2.1', 'success', 'Brazil', 'BR', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:40Z')");
      dbUtilHelper.run ("insert into gmm_campaign_participation (id, info, player_id, registered_at, campaign_id, location_id) values (1000, 'Automated Test', 1000, '2015-10-25 12:00:00.000000',1000,1000)");

    },

    insertCampaignDisabledWithUser : function () {
      dbUtil().insertCampaignDisable();
      dbUtilHelper.run( "insert into gmm_campaign_location(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date) values (1000, 'en-us', '1.2.1', 'success', 'Brazil', 'BR', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:40Z')");
      dbUtilHelper.run ("insert into gmm_campaign_participation (id, info, player_id, registered_at, campaign_id, location_id) values (1000, 'Automated Test', 1000, '2015-10-25 12:00:00.000000',1000,1000)");

    },

    insertCampaignWithDateFinalExpiredWithUser : function () {
      dbUtil().insertCampaignFinished();
      dbUtilHelper.run( "insert into gmm_campaign_location(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date) values (1000, 'en-us', '1.2.1', 'success', 'Brazil', 'BR', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:40Z')");
      dbUtilHelper.run ("insert into gmm_campaign_participation (id, info, player_id, registered_at, campaign_id, location_id) values (1000, 'Automated Test', 1000, '2015-10-25 12:00:00.000000',1000,1000)");

    },

    insertCampaignNotStartedYetWithUser : function () {
       dbUtil().insertCampaignNotStaterd();
      dbUtilHelper.run( "insert into gmm_campaign_location(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date) values (1000, 'en-us', '1.2.1', 'success', 'Brazil', 'BR', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:40Z')");
      dbUtilHelper.run ("insert into gmm_campaign_participation (id, info, player_id, registered_at, campaign_id, location_id) values (1000, 'Automated Test', 1000, '2015-10-25 12:00:00.000000',1000,1000)");

    },



  };
};

module.exports = new dbUtil();
