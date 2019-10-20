/**
 * Created by Filipe on 08/12/2015.
 * ==Test Cases==
 * - gmm-104:Register device user in game with success
 * - gmm-105:Register user in game with other GCM_ID
 * - gmm-106:Register user in game with other GPG_ID and e-mail
 * - gmm-385:Register user in game with other email and gcm_id
 * - gmm-386:Register user in game with other gpg_id and gcm_id
 * - gmm-107:Register user in game with other e-mail
 * - gmm-108:Register user in game with other GPG_ID
 * - gmm-184:Register in other game a device user already registered
 * - gmm-109:Game not found
 *   gmm-110:User already registered in game
 * - gmm-111:Register user in game with invalid token
 * - gmm-112:Register user in game without token
 * - gmm-113:Register user in game with invalid county_code
 * - gmm-114:Register user in game without Country_code
 * - gmm-115:Register user in game without location
 * - gmm-185:Register user in game with invalid location_county
 * - gmm-186:Register user in game without location_country
 * - gmm-187:Register user in game without app_language
 * - gmm-188:Register user in game with invalid app_language
 * - gmm-116:Register user in game with content-type unsupported
 */
var chakram = require('chakram'),
  dbUtil = require('./util/dbHelperGame.js'),
  dbUtilHelper = require('./util/dbHelper.js'),
  config = require('./config'),
  expect = chakram.expect;

describe(config.classNamePrefix + "Register User Service", function () {
  this.timeout(15000);

  it("gmm-104:Register device user in game with success", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(201);
    expect(response).to.have.json('email', "qatests@embedded.com");
    expect(response).to.have.json('gpg_id', "100020003000");
    expect(response).to.have.json('gcm_id', "200020002000");
    return chakram.wait();
  });

  it("gmm-105:Register user in game with other GCM_ID", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000123"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(201);
    expect(response).to.have.json('email', "qatests@embedded.com");
    expect(response).to.have.json('gpg_id', "100020003000");
    expect(response).to.have.json('gcm_id', "200020002000123");
    return chakram.wait();
  });

  it("gmm-106:Register user in game with other GPG_ID and e-mail", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertUserGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests2@embedded.com",
      gpg_id: "100020003000123",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(201);
    expect(response).to.have.json('email', "qatests2@embedded.com");
    expect(response).to.have.json('gpg_id', "100020003000123");
    expect(response).to.have.json('gcm_id', "200020002000");
    return chakram.wait();
  });

  it("gmm-385:Register user in game with other email and gcm_id", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertUserGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests2@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000123"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(201);
    expect(response).to.have.json('email', "qatests2@embedded.com");
    expect(response).to.have.json('gpg_id', "100020003000");
    expect(response).to.have.json('gcm_id', "200020002000123");
    return chakram.wait();
  });


    it("gmm-386:Register user in game with other gpg_id and gcm_id", function () {
      dbUtilHelper.cleanData();
      dbUtil.insertUserGame();
      var serviceId = '100010001000';
      var data = {
        email: "qatests@embedded.com",
        gpg_id: "100020003000123",
        gcm_id: "200020002000123"
      };
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
      response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
      expect(response).to.have.status(201);
      expect(response).to.have.json('email', "qatests@embedded.com");
      expect(response).to.have.json('gpg_id', "100020003000123");
      expect(response).to.have.json('gcm_id', "200020002000123");
      return chakram.wait();
    });

  it("gmm-107:Register user in game with other e-mail", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertUserGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests2@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(201);
    expect(response).to.have.json('email', "qatests2@embedded.com");
    expect(response).to.have.json('gpg_id', "100020003000");
    expect(response).to.have.json('gcm_id', "200020002000");
    return chakram.wait();
  });

  it("gmm-108:Register user in game with other GPG_ID", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertUserGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000123",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(200);
    expect(response).to.have.json('email', "qatests@embedded.com");
    expect(response).to.have.json('gpg_id', "100020003000123");
    expect(response).to.have.json('gcm_id', "200020002000");
    return chakram.wait();
  });

  it("gmm-109:Game not found", function () {
    dbUtilHelper.cleanData();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000123",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(404);
    expect(response).to.have.json('detail' , "Game not found.");
    return chakram.wait();
  });

  it("gmm-110:User already registered in game", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertUserGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(409);
    expect(response).to.have.json('detail' , "Player already registered.");
    return chakram.wait();
  });

  it("gmm-184:Register in other game a device user already registered", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertUserGame();
    dbUtil.insertoGame2();
    var serviceId = '200020002000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(201);
    expect(response).to.have.json('email', "qatests@embedded.com");
    expect(response).to.have.json('gpg_id', "100020003000");
    expect(response).to.have.json('gcm_id', "200020002000");
    return chakram.wait();
  });

  it("gmm-111:Register user in game with invalid token", function () {
    dbUtilHelper.cleanData();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
    var params = {
      headers: {
        'X-Token': '123456',
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail', "Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-112:Register user in game without token", function () {
    dbUtilHelper.cleanData();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
    var params = {
      headers: {
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail', "Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-113:Register user in game with invalid county_code", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "United States", ' +
        '"location_country_code": "ABCDE", ' +
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail', "Invalid country code.");
    return chakram.wait();
  });

  it("gmm-114:Register user in game without Country_code", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "pt", ' +
        '"location_country": "United States", ' +
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country_code', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-186:Register user in game without location_country", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-185:Register user in game with invalid location_county", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail', "The country \"INVALID\" does not match with the country code \"BR\".");
    return chakram.wait();
  });

  it("gmm-188:Register user in game with invalid app_language", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail', "Invalid app language.");
    return chakram.wait();
  });

  it("gmm-187:Register user in game without app_language", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data, params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('app_language', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-115:Register user in game without location", function () {
    dbUtilHelper.cleanData();
    var serviceId = '100010001000';
    var id = '1000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
    };
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user', data,  params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Location not provided.");
    return chakram.wait();
  });

  it("gmm-116:Register user in game with content-type unsupported", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertGame();
    var serviceId = '100010001000';
    var id = '1000';
    var data = {
      email: "qatests@embedded.com",
      gpg_id: "100020003000",
      gcm_id: "200020002000"
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
    response = chakram.post(config.baseUrl + 'game/' + serviceId + '/user/', data,  params);
    expect(response).to.have.status(415);
    expect(response).to.have.json('detail','Unsupported media type \"multipart/formdata\" in request.');
    return chakram.wait();
  });
});
