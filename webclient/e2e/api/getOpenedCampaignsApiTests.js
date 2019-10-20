/**
 * Created by Filipe on 18/01/2016.
 * ==Test Cases==
 * - gmm-69:Get campaing with one campaing active
 * - gmm-71:Get campaing expired (date)
 * - gmm-70:Get campaing with many campaing active
 * - gmm-72:Get campaign limits of participants exceeded
 * - gmm-73:Get campaing disable
 * - gmm-74:Get campaign with different region
 * - gmm-75:Get with game not found
 * - gmm-76:Get campaign non existent for game
 * - gmm-170:Get campaing with Token invalid
 * - gmm-171:Get campaing without Token
 * - gmm-172:Get campaing with invalid country_code
 * - gmm-173:Get campaing without location_country_code
 * - gmm-174:Get campaing with invalid location_contry
 * - gmm-175:Get campaing without location_country
 * - gmm-176:Get campaing with invalid app_language
 * - gmm-177:Get campaing without app_language
 * - gmm-178:Get campaign without location
 * - gmm-179:Get campaign with content-type Unsupported
 */
var chakram = require('chakram'),
  dbUtil = require('./util/dbHelperCampaign.js'),
  dbUtilGame = require('./util/dbHelperGame.js'),
  dbUtilHelper = require('./util/dbHelper.js'),
  config = require('./config'),
  expect = chakram.expect;


describe(config.classNamePrefix + "Get Opened Campaign", function () {
  this.timeout(15000);

  it("gmm-69:Get campaing with one campaing active", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([
      {
      "id": 1000,
      "name": "Zenny Worldz",
      "begin_date": "2015-10-25T12:00:00Z",
      "end_date": "2016-10-25T12:00:00Z",
      "rule": {"zix":{"score":"12"}}
      }
    ]);
    return chakram.wait();
  });

  it("gmm-71:Get campaing expired (date)", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignFinished();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([]);
    return chakram.wait();
  });

  it("gmm-70:Get campaing with many campaing active", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertMoreOneCampaign();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([
      {
        "id": 1000,
        "name": "Zenny Worldz",
        "begin_date": "2015-10-25T12:00:00Z",
        "end_date": "2016-10-25T12:00:00Z",
        "rule": {"zix":{"score":"12"}}
      },
      {
        "id": 1001,
        "name": "Zenny Natal",
        "begin_date": "2015-10-25T12:00:00Z",
        "end_date": "2016-10-25T12:00:00Z",
        "rule": {"zix":{"score":"12"}}
      }
    ]);
    return chakram.wait();
  });

  it("gmm-72:Get campaign limits of participants exceeded", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignFinishedWithUserLimitExceeded();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([]);
    return chakram.wait();
  });

  it("gmm-73:Get campaing disable", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignDisable();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([]);
    return chakram.wait();
  });

  it("gmm-76:Get campaign non existent for game", function () {
    dbUtilHelper.cleanData();
    dbUtilGame.insertoGame2();
    var gameServiceId = '200020002000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([]);
    return chakram.wait();
  });

  it("gmm-74:Get campaign with different region", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignFinished();
    var gameServiceId = '100010001000';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "United States", ' +
        '"location_country_code": "US", ' +
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([]);
    return chakram.wait();
  });

  it("gmm-75:Get with game not found", function () {
    dbUtilHelper.cleanData();
    var gameServiceId = '100010001000123456789';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(404);
    expect(response).to.have.json('detail', "Game not found.");
    return chakram.wait();
  });

  it("gmm-170:Get campaing with Token invalid", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var params = {
      headers: {
        'X-Token': 'tokenInvalid',
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail', "Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-171:Get campaing without Token", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail', "Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-172:Get campaing with invalid country_code", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "XX", ' +
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Invalid country code.");
    return chakram.wait();
  });

  it("gmm-173:Get campaing without location_country_code", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country_code', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-174:Get campaing with invalid location_contry", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"The country \"INVALID\" does not match with the country code \"BR\".");
    return chakram.wait();
  });

  it("gmm-175:Get campaing without location_country", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-176:Get campaing with invalid app_language", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Invalid app language.");
    return chakram.wait();
  });

  it("gmm-177:Get campaing without app_language", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('app_language', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-178:Get campaign without location", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/campaign.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Location not provided.");
    return chakram.wait();
  });


});


