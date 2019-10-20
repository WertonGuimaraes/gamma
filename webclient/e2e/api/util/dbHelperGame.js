/**
 * Created by Gilmar on 02/03/2016.
 */

'use strict';

var dbUtil = function(){

  var dbUtilHelper = require('./dbHelper.js');

  return {
    insertGame : function() {
      var form_template = '{\\"selected\\":{\\"type\\":\\"item\\",\\"name\\":\\"attribute\\",\\"tooltip\\":\\"Value that can be linked with a feature.\\"},\\"templates\\":[{\\"type\\":\\"container\\",\\"id\\":2,\\"columns\\":[[]],\\"name\\":\\"feature\\",\\"tooltip\\":\\"Container should contain other features and attributes.\\",\\"desc\\":\\"\\"},{\\"type\\":\\"item\\",\\"id\\":4,\\"name\\":\\"attribute\\",\\"tooltip\\":\\"Value that can be linked with a feature.\\"}],\\"dropzones\\":{\\"root\\":[{\\"type\\":\\"container\\",\\"id\\":\\"zix\\",\\"columns\\":[[{\\"type\\":\\"item\\",\\"id\\":\\"score\\",\\"name\\":\\"attribute\\",\\"tooltip\\":\\"Value that can be linked with a feature.\\"}]],\\"name\\":\\"feature\\",\\"tooltip\\":\\"Container should contain other features and attributes.\\",\\"desc\\":\\"\\"}]}}';
      dbUtilHelper.run('insert into gmm_game_game (id, name, analytics_view_id, package_name, game_service_id, game_image, api_key, form_template) values (1000, \'Zenny\', 1010101010, \'Teste\', \'100010001000\', \'http://www.asus.com/zentalk/tw/static/image/smiley/zenny/zenny03.png\',\'AIzaSyB0Tld-TleZQ6ThfsKaxHFnmhLpg5RcFiE\', \'' + form_template + '\')');

      var push_template = '{\\"selected\\":{\\"type\\":\\"item\\",\\"id\\":\\"http://asus.com\\",\\"name\\":\\"value\\",\\"tooltip\\":\\"Value set for action.\\"},\\"name\\":\\"teste\\",\\"max\\":1,\\"templates\\":[{\\"type\\":\\"container\\",\\"id\\":2,\\"columns\\":[[]],\\"desc\\":\\"\\",\\"name\\":\\"action\\",\\"tooltip\\":\\"Action that may contain a set value.\\",\\"allowedTypes\\":[\\"item\\"]},{\\"type\\":\\"item\\",\\"id\\":3,\\"name\\":\\"value\\",\\"tooltip\\":\\"Value set for action.\\"}],\\"dropzones\\":{\\"root\\":[{\\"type\\":\\"container\\",\\"id\\":\\"open\\",\\"columns\\":[[{\\"type\\":\\"item\\",\\"id\\":\\"http://asus.com\\",\\"name\\":\\"value\\",\\"tooltip\\":\\"Value set for action.\\"}]],\\"desc\\":\\"\\",\\"name\\":\\"action\\",\\"tooltip\\":\\"Action that may contain a set value.\\",\\"allowedTypes\\":[\\"item\\"]}]}}';
      dbUtilHelper.run ("insert into gmm_game_pushtemplate(id, push_template, created_date, game_id) values (1000, '" + push_template + "', '2015-12-5 12:00:00.000000', 1000)");
    },

    insertoGame2 : function() {
      var form_template = '{\\"selected\\":{\\"type\\":\\"item\\",\\"name\\":\\"attribute\\",\\"tooltip\\":\\"Value that can be linked with a feature.\\"},\\"templates\\":[{\\"type\\":\\"container\\",\\"id\\":2,\\"columns\\":[[]],\\"name\\":\\"feature\\",\\"tooltip\\":\\"Container should contain other features and attributes.\\",\\"desc\\":\\"\\"},{\\"type\\":\\"item\\",\\"id\\":4,\\"name\\":\\"attribute\\",\\"tooltip\\":\\"Value that can be linked with a feature.\\"}],\\"dropzones\\":{\\"root\\":[{\\"type\\":\\"container\\",\\"id\\":\\"zix\\",\\"columns\\":[[{\\"type\\":\\"item\\",\\"id\\":\\"score\\",\\"name\\":\\"attribute\\",\\"tooltip\\":\\"Value that can be linked with a feature.\\"}]],\\"name\\":\\"feature\\",\\"tooltip\\":\\"Container should contain other features and attributes.\\",\\"desc\\":\\"\\"}]}}';
      dbUtilHelper.run('insert into gmm_game_game (id, name, analytics_view_id, package_name, game_service_id, game_image, api_key, form_template) values (1001, \'Zenny2\', 2020202020, \'Teste2\', \'200020002000\', \'http://www.asus.com/zentalk/tw/static/image/smiley/zenny/zenny03.png\',\'AIzaSyB0Tld-TleZQ6ThfsKaxHFnmhLpg5RcFiE\', \'' + form_template + '\')');

      var push_template = '{\\"selected\\":{\\"type\\":\\"item\\",\\"id\\":\\"http://asus.com\\",\\"name\\":\\"value\\",\\"tooltip\\":\\"Value set for action.\\"},\\"name\\":\\"teste\\",\\"max\\":1,\\"templates\\":[{\\"type\\":\\"container\\",\\"id\\":2,\\"columns\\":[[]],\\"desc\\":\\"\\",\\"name\\":\\"action\\",\\"tooltip\\":\\"Action that may contain a set value.\\",\\"allowedTypes\\":[\\"item\\"]},{\\"type\\":\\"item\\",\\"id\\":3,\\"name\\":\\"value\\",\\"tooltip\\":\\"Value set for action.\\"}],\\"dropzones\\":{\\"root\\":[{\\"type\\":\\"container\\",\\"id\\":\\"open\\",\\"columns\\":[[{\\"type\\":\\"item\\",\\"id\\":\\"http://asus.com\\",\\"name\\":\\"value\\",\\"tooltip\\":\\"Value set for action.\\"}]],\\"desc\\":\\"\\",\\"name\\":\\"action\\",\\"tooltip\\":\\"Action that may contain a set value.\\",\\"allowedTypes\\":[\\"item\\"]}]}}';
      dbUtilHelper.run ("insert into gmm_game_pushtemplate(id, push_template, created_date, game_id) values (1001, '" + push_template + "', '2015-12-5 12:00:00.000000', 1001)");
    },

    insertUserGame : function() {
      dbUtil().insertGame();
      dbUtilHelper.run( "insert into gmm_push_environmentinfo(id, device_language, app_version, location_status, location_country, location_country_code, location_region, location_region_name, location_city, location_zip, location_lat, location_lon, location_timezone, location_isp, location_org, location_as, location_query, location_source, location_date, app_language) values (1000, 'en-us', '1.2.1', 'success', 'United States', 'US', 'CA', 'California', 'San Francisco', '94105', '37.7898', '-122.3942', 'America Los_Angeles', 'Wikimedia Foundation', 'Wikimedia Foundation','AS14907 Wikimedia US network', '208.80.152.201', '4G - IP API', '2016-09-04T19:13:40Z', 'pt')");
      dbUtilHelper.run( "insert into gmm_push_deviceuser(id, email, gpg_id, gcm_id, environment_info_id, game_id, registered_at, last_date_played) values (1000, 'qatests@embedded.com', '100020003000', '200020002000', 1000, 1000, '2015-12-2 12:00:00.000000', '2015-12-5 12:00:00.000000')");
    }
  };
};

module.exports = new dbUtil();

