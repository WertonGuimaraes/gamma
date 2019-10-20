/**
 * Created by Filipe on 30/10/2015.
 */
'use strict';

var dbUtil = function(){

    function run( sql ) {

      var sys = require( 'sys' ),
          url_bd = 'localhost',
          //url_bd = '192.168.56.101',
          process = require( 'child_process'),
          dbName = 'e2e_gmm',
          //dbName = 'gmm',
          child;

      child = process.execSync("mysql -u root -proot -h " + url_bd + " " + dbName + " -e " + sql);

      console.log(child.toString());

    };

  return {

    setCampaign : function() {

      run( "\"insert into gmm_campaign_campaign(id,name,active,country_code,begin_date, end_date) values (1000,'campaign_teste01',1,'BR','2015-10-25 12:00:00.000000','2015-12-30 12:00:00.000000')\"" );

    },

    //setCampaignInvalid : function() {
    //
    //  run( "\"insert into gmm.gmm_campaign_campaign(id,name,active,country_code,begin_date, end_date) values (1000,'campaign_teste01',1,'BR','2015-10-25 12:00:00.000000','2015-12-30 12:00:00.000000')\"" );
    //
    //},

    removeCampaign : function() {
      run( "\"delete from  gmm_campaign_campaign where id='1000'\"" );
    },

    removeAllCampaign : function() {

      run( "\"delete * from  gmm_campaign_phase\"" );

      run( "\"delete * from  gmm_campaign_participation\"" );

      run( "\"delete * from  gmm_campaign_player\"" );

      run( "\"delete * from  gmm_campaign_campaign\"" );

    },


    setParticipant : function() {

      run( "\"insert into gmm_campaign_location(id, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date, app_version, device_language) values (1000,'statustest','countrytest','country_codetest','regiontest','regionnametest','citytest','zipcodetest','1000','2000','acre time','ispteste','orgtest','as_numbertest','querytest', '3G', '2050-09-04T19:13:40Z', 'V2.0', 'Portuguese')\"" );

      run( "\"insert into gmm_campaign_player(id,email,gpg_id) values (1000,'testes@testesasus.com','testeQA')\"" );

      run( "\"insert into gmm_campaign_participation(id,location_id,player_id,campaign_id,registered_at, phase) values (1000,'1000',1000,'1000','2015-10-25 15:00:00.000000','zix')\"" );

    },

    removeParticipant : function() {

    run( "\"delete * from  gmm_campaign_phase\"" );

    run( "\"delete * from  gmm_campaign_participation where id='1000'\"" );

    run( "\"delete * from  gmm_campaign_player where id='1000'\"" );

    },

    setPlayer : function() {

      run( "\"insert into gmm_game_game(id,name,package_name,game_service_id,game_image) values (1000,'Zenny','package.zenny', '1D_service3', 'http:www.image.com')\"" );

      run( "\"insert into gmm_push_environmentinfo(id, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date, app_version, device_language) values (1000,'statustest','countrytest','country_codetest','regiontest','regionnametest','citytest','zipcodetest','1000','2000','acre time','ispteste','orgtest','as_numbertest','querytest', '3G', '2050-09-04T19:13:40Z', 'V2.0', 'Portuguese')\"" );

      run( "\" insert into gmm_push_deviceuser(id, email, gpg_id,gcm_id,environment_info_id,game_id_id) values (1000,'teste@teste.com','testegpg','testegcm',1000,1000)\"" );


    },

    removePlayers : function() {

      run( "\"delete from gmm_push_deviceuser where id=1000\"" );

      run( "\"delete from gmm_push_environmentinfo where id=1000\"" );

    }
  };
};

module.exports = new dbUtil();
