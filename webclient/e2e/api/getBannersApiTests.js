/**
 * Created by Filipe on 19/01/2016.
 * ==Test Cases==
 * - gmm-77:Get existing banner in one game
 * - gmm-78:Get existing many banner in one game
 * - gmm-79:Get Game not found
 * - gmm-80:Get banner with invalid token
 * - gmm-81:Get banner without token
 * - gmm-83:Get banner without location_country_code
 * - gmm-82:Get banner with invalid location_country_code
 * - gmm-84:Get banner without location
 * - gmm-375:Get not existing banner to game
 * - gmm-379:Get not existing banner to region
 * - gmm-180:Get banner with invalid location_country
 * - gmm-181:Get banner without location_country
 * - gmm-182:Get banner with invalid app_language
 * - gmm-183:Get banner without app_language
 * - gmm-85:Get banner with content-type unsupported
 */
var chakram = require('chakram'),
  dbUtil = require('./util/dbHelperBanner.js'),
  dbUtilGame = require('./util/dbHelperGame.js'),
  dbUtilHelper = require('./util/dbHelper.js'),
  config = require('./config'),
  expect = chakram.expect;


describe(config.classNamePrefix + "Get Banners", function () {
  this.timeout(15000);

 it("gmm-77:Get existing banner in one game", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([
      {
        "image_url": "http://cdn.slashgear.com/wp-content/uploads/2015/05/zenny.jpg",
        "target_url": "http://www.asus.com.br/",
        "language": "PT",
        'name': 'default name'
      }
    ]);
    return chakram.wait();
  });

  it("gmm-78:Get existing many banner in one game", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertManyBannerInOneGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([
      {
        "image_url": "http://cdn.slashgear.com/wp-content/uploads/2015/05/zenny.jpg",
        "target_url": "https://www.asus.com.br",
        "language": "PT",
        'name': 'default name'
      },
      {
        "image_url": "http://gamehall.uol.com.br/kapoow/wp-content/uploads/2015/08/P1040273-1024x651.jpg",
        "target_url": "http://loja.asus.com.br/acessorios/zenfone/acessorios-zenfone-go.html",
        "language": "PT",
        'name': 'default name'
      },
      {
        "image_url": "http://lighthouseinsights.in/wp-content/uploads/2015/11/Asus_Zennykipehlidiwali-728x483.jpg",
        "target_url": "http://loja.asus.com.br",
        "language": "PT",
        'name': 'default name'
      }
    ]);
    return chakram.wait();
  });

  it("gmm-79:Get Game not found", function () {
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(404);
    expect(response).to.have.json('detail', "Game not found.");
    return chakram.wait();
  });

  it("gmm-80:Get banner with invalid token", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail',"Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-81:Get banner without token", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(401);
    expect(response).to.have.json('detail',"Authentication credentials were not provided.");
    return chakram.wait();
  });

  it("gmm-83:Get banner without location_country_code", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country_code', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-82:Get banner with invalid location_country_code", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
    var gameServiceId = '100010001000';
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Invalid country code.");
    return chakram.wait();
  });

  it("gmm-84:Get banner without location", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
    var gameServiceId = '100010001000';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'Content-Type': 'application/json'
      }
    };
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Location not provided.");
    return chakram.wait();
  });

  it("gmm-375:Get not existing banner to game", function () {
    dbUtilHelper.cleanData();
    dbUtilGame.insertGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([]);
    return chakram.wait();
  });

  it("gmm-379:Get not existing banner to region", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(200);
    expect(response).to.have.json([]);
    return chakram.wait();
  });

  it("gmm-180:Get banner with invalid location_country", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"The country \"INVALID\" does not match with the country code \"BR\".");
    return chakram.wait();
  });

  it("gmm-181:Get banner without location_country", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('location_country', ["This field is required."]);
    return chakram.wait();
  });

  it("gmm-182:Get banner with invalid app_language", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
    var gameServiceId = '100010001000';
    var params = {
      headers: {
        'X-Token': '?8$8#zns1P7aT}Vj0s,S{1s~23,H1`#S[WX43Qe6I%a8l1252AyNug,(n31r81)',
        'X-Env': '{"device_language" : "en-us", ' +
        '"app_version" : "1.2.1", ' +
        '"location_status": "success", ' +
        '"app_language": "INVALID", ' +
        '"location_country": "Brazil", ' +
        '"location_country_code": "BR", ' +    // country_code INVALID
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('detail',"Invalid app language.");
    return chakram.wait();
  });

  it("gmm-183:Get banner without app_language", function () {
    dbUtilHelper.cleanData();
    dbUtil.insertOneBannerInOneGame();
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
    response = chakram.get(config.baseUrl + 'game/' + gameServiceId + '/banner.opened', params);
    expect(response).to.have.status(400);
    expect(response).to.have.json('app_language', ["This field is required."]);
    return chakram.wait();
  });


});
