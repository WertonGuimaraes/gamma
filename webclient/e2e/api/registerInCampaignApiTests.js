/**
 * Created by Filipe on 16/12/2015.
 * ==Test Cases==
 * - gmm-117:Register user in campaign with success
 * - gmm-118:User already registered in campaign (409)
 * - gmm-120:Game not found
 * - gmm-119:Campaign not found
 * - gmm-122:The campaign is not opened (current date before begin date)
 * - gmm-121:The campaign is not opened (status)
 * - gmm-123:The campaign is not opened (current date after end date)
 * - gmm-124:The campaign is not opened (reached the limit of participants)
 * - gmm-125:The campaign is not opened (region of campaign is different from the user region)
 * - gmm-126:Register user in campaign with Token invalid
 * - gmm-127:Register user in campaign without Token
 * - gmm-128:Register user in campaign without location_country_code
 * - gmm-129:Register user in campaign with location_country_code invalid
 * - gmm-190:Register user in campaign without location_country
 * - gmm-189:Register user in campaign with invalid location_country
 * - gmm-191:Register user in campaign with invalid app_language
 * - gmm-192:Register user in campaign without app_language
 * - gmm-130:Register user in campaign without location
 * - gmm-131:Register user in campaign with Content-Type unsupported
 */
var chakram = require('chakram'),
  dbUtil = require('./util/dbHelperCampaign.js'),
  dbUtilGame = require('./util/dbHelperGame.js'),
  dbUtilHelper = require('./util/dbHelper.js'),
  config = require('./config'),
  expect = chakram.expect;

describe(config.classNamePrefix + "Register User in Campaign", function () {
  this.timeout(15000);


  it("gmm-117:Register user in campaign with success", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player : {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(201);
    return chakram.wait();
  });

  it("gmm-118:User already registered in campaign", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignWithUser();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data, params);
    expect(response).to.have.status(409);
    expect(response).to.have.json('detail', "Player already registered.");
    return chakram.wait();
  });

  it("gmm-120:Game not found", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameId = '100010001000123456789'; //gameId notexistent
    var campaignid = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameId + '/campaign/' + campaignid + '/register/', data, params);
    expect(response).to.have.status(404);
    expect(response).to.have.json('detail', "Game or Campaign not found.");
    return chakram.wait();
  });

  it("gmm-119:Campaign not found", function () {
    dbUtilHelper.cleanData();
    dbUtilGame.insertGame();
    var gameServiceId = '100010001000';
    var id = '100000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data, params);
    expect(response).to.have.status(404);
    expect(response).to.have.json('detail', "Game or Campaign not found.");
    return chakram.wait();
  });

  it("gmm-122:The campaign is not opened (current date before begin date)", function () {
    dbUtilHelper.cleanData();
    dbUtil. insertCampaignNotStaterd();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data, params);
    expect(response).to.have.status(403);
    expect(response).to.have.json('detail', "The campaign is not open.");
    return chakram.wait();
  });

  it("gmm-121:The campaign is not opened (status)", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignDisable();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data, params);
    expect(response).to.have.status(403);
    expect(response).to.have.json('detail', "The campaign is not open.");
    return chakram.wait();
  });

  it("gmm-123:The campaign is not opened (current date after end date)", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignFinished();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data, params);
    expect(response).to.have.status(403);
    expect(response).to.have.json('detail', "The campaign is not open.");
    return chakram.wait();
  });

  it("gmm-124:The campaign is not opened (reached the limit of participants)", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignWithAllUser();
    var gameId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests1@embedded.com",
        gpg_id: "1000200030001",
        gcm_id: "2000200020001"
      }
    };
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
        '"location_date": "2016-09-04T19:13:41Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.post(config.baseUrl + 'game/' + gameId + '/campaign/' + id + '/register/', data, params);
    expect(response).to.have.status(403);
    expect(response).to.have.json('detail', "The campaign is not open.");
    return chakram.wait();
  });

  it("gmm-125:The campaign is not opened (region of campaign is different from the user region)", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaignInOtherRegion();
    var gameId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests1@embedded.com",
        gpg_id: "1000200030001",
        gcm_id: "2000200020001"
      }
    };
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
        '"location_date": "2016-09-04T19:13:41Z" }',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.post(config.baseUrl + 'game/' + gameId + '/campaign/' + id + '/register/', data, params);
    expect(response).to.have.status(403);
    expect(response).to.have.json('detail', "The campaign is not open.");
    return chakram.wait();
  });

  it("gmm-126:Register user in campaign with Token invalid", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail',"Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-127:Register user in campaign without Token", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail',"Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-128:Register user in campaign without location_country_code", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country_code', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-190:Register user in campaign without location_country", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-192:Register user in campaign without app_language", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('app_language', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-191:Register user in campaign with invalid app_language", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "XUXA", ' +      // app_language INVALID
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Invalid app language.");
    return chakram.wait();
  });

  it("gmm-129:Register user in campaign with location_country_code invalid", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "XX", ' +    // country_code INVALID
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Invalid country code.");
    return chakram.wait();
  });

  it("gmm-189:Register user in campaign with invalid location_country", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "XUXA", ' +    // country INVALID
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
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"The country \"XUXA\" does not match with the country code \"BR\".");
    return chakram.wait();
  });

  it("gmm-130:Register user in campaign without location", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Location not provided.");
    return chakram.wait();
  });

  it(" gmm-131:Register user in campaign with Content-Type unsupported", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertCampaign();
    var gameServiceId = '100010001000';
    var id = '1000';
    var data = {
      player: {
        email: "qatests@embedded.com",
        gpg_id: "100020003000",
        gcm_id: "200020002000"
      }
    };
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
        'Content-Type': 'multipart/formdata'
      }
    };
    response = chakram.post(config.baseUrl + 'game/' + gameServiceId + '/campaign/' + id + '/register/', data,  params);
    expect(response).to.have.status(415);
    expect(response).to.have.json('detail','Unsupported media type \"multipart/formdata\" in request.');
    return chakram.wait();
  });

});

