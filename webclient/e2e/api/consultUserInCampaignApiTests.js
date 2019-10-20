/**
 * Created by Filipe on 16/12/2015.
 * ==Test Cases==
 * - gmm-86:Get player participating in an open campaign
 * - gmm-87:Get player participating in an disable campaign
 * - gmm-88:Get player participating in a campaign with end date expired
 * - gmm-89:Get player participating in a campaign with participants exceeded limit
 * - gmm-90:Get player that is not participating in an active campaign
 * - gmm-91:Get player that is not participating in a campaign that is closed
 * - gmm-92:Get player that is not participating in a campaign with end date expired
 * - gmm-93:Get player that is not participating in a campaign that has not started
 * - gmm-94:Get player that is not participating in a campaign with participants exceeded limits
 * - gmm-95:Get player that is not participate in a closed campaign to your region
 * - gmm-96:Get with no existing campaign
 * - gmm-97:Get with no existing game
 * - gmm-98:Get with invalid token
 * - gmm-99:Get without token
 * - gmm-100:Get with invalid country_code
 * - gmm-101:Get without country_code
 * - gmm-102:Get without location
 * - gmm-166:Get with invalid country
 * - gmm-167:Get without country
 * - gmm-168:Get with invalid app_language
 * - gmm-169:Get without app_language
 * - gmm-103:Get with content-type Unsupported
 */
var chakram = require('chakram'),
  dbUtilGame = require('./util/dbHelperGame.js'),
  dbUtilCampaign = require('./util/dbHelperCampaign.js'),
  dbUtilHelper = require('./util/dbHelper.js'),
  config = require('./config'),
  expect = chakram.expect;

describe(config.classNamePrefix + "Consult User in Campaign", function () {
  this.timeout(15000);

  it("gmm-86:Get player participating in an open campaign", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    console.log(response);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',{
      "registered_at": "2015-10-25T12:00:00Z",
      "info": "Automated Test",
        "email": "qatests@embedded.com",
        "gpg_id": "100020003000"
      }
    );
    expect(response).to.have.json('open_campaign', true);
    return chakram.wait();
  });

  it("gmm-87:Get player participating in an disable campaign", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignDisabledWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',{
      "registered_at": "2015-10-25T12:00:00Z",
      "info": "Automated Test",
      "email": "qatests@embedded.com",
      "gpg_id": "100020003000"
    });
    expect(response).to.have.json('open_campaign', false);
    return chakram.wait();
  });

  it("gmm-88:Get player participating in a campaign with end date expired", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithDateFinalExpiredWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',{
      "registered_at": "2015-10-25T12:00:00Z",
      "info": "Automated Test",
      "email": "qatests@embedded.com",
      "gpg_id": "100020003000"
    });
    expect(response).to.have.json('open_campaign', false);
    return chakram.wait();
  });

  it("gmm-89:Get player participating in a campaign with participants exceeded limit", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithAllUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',{
      "registered_at": "2015-10-25T12:00:00Z",
      "info": "Automated Test",
      "email": "qatests@embedded.com",
      "gpg_id": "100020003000"
    });
    expect(response).to.have.json('open_campaign', false);
    return chakram.wait();
  });

  it("gmm-90:Get player that is not participating in an active campaign", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',null);
    expect(response).to.have.json('open_campaign', true);
    return chakram.wait();
  });

  it("gmm-91:Get player that is not participating in a campaign that is closed", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignFinished();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',null);
    expect(response).to.have.json('open_campaign', false);
    return chakram.wait();
  });

  it("gmm-92:Get player that is not participating in a campaign with end date expired", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignDisable();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',null);
    expect(response).to.have.json('open_campaign', false);
    return chakram.wait();
  });

  it("gmm-93:Get player that is not participating in a campaign that has not started", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignNotStaterd();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',null);
    expect(response).to.have.json('open_campaign', false);
    return chakram.wait();
  });

  it("gmm-94:Get player that is not participating in a campaign with participants exceeded limits", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithAllUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qaouthertests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',null);
    expect(response).to.have.json('open_campaign', false);
    return chakram.wait();
  });

  it("gmm-95:Get player that is not participate in a closed campaign to your region", function (){
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignFinished();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qaouthertests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('register',null);
    expect(response).to.have.json('open_campaign', false);
    return chakram.wait();
  });

  it("gmm-96:Get with no existing campaign", function () {
    dbUtilHelper.cleanData();
    dbUtilGame.insertGame();
    var gameServiceId = '100010001000';
    var id = '100000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(404);
    return chakram.wait();
  });

  it("gmm-97:Get with no existing game", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaign();
    var gameServiceId = '100010001000123456789';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(404);
    return chakram.wait();
  });

  it("gmm-98:Get with invalid token", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)INVALID',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail',"Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-99:Get without token", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail',"Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-100:Get with invalid country_code", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "INVALID", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Invalid country code.");
    return chakram.wait();
  });

  it("gmm-166:Get with invalid country", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "INVALID", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"The country \"INVALID\" does not match with the country code \"BR\".");
    return chakram.wait();
  });

  it("gmm-168:Get with invalid app_language", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "INVALID", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Invalid app language.");
    return chakram.wait();
  });

  it("gmm-101:Get without country_code", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country_code', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-167:Get without country", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-169:Get without app_language", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var email = 'qatests@embedded.com';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +
        '"location_region": "CA", ' +
        '"location_region_name": "California", ' +
        '"location_city": "San Francisco", ' +
        '"location_zip": "94105", ' +
        '"location_lat": "37.7898", ' +
        '"location_lon": "-122.3942", ' +
        '"location_timezone": "America Los_Angeles", ' +
        '"location_isp": "Wikimedia Foundation", ' +
        '"location_org": "Wikimedia Foundation", ' +
        '"location_as": "AS14907 Wikimedia US network", ' +
        '"location_query": "208.80.152.201", ' +
        '"location_source": "4G - IP API", ' +
        '"location_date": "2016-09-04T19:13:40Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/' + email, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('app_language', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-102:Get without location", function () {
    dbUtilHelper.cleanData();
    dbUtilCampaign.insertCampaign();
    var gamegameServiceId = '100010001000';
    var id = '1000';
    var email = "qatests@embedded.com";
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gamegameServiceId + '/campaign/' + id + '/register/' + email,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Location not provided.");
    return chakram.wait();
  });

});


