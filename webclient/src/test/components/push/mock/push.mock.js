/*jshint maxlen:120 */
/*jshint -W079 */
var mockDataPush = (function () {
  return {
    getMockListPush: getMockListPush,
    getMockTotalFilter: getMockTotalFilter,
    getListPush: getListPush,
    getMockListPushWithNullElement: getMockListPushWithNullElement
  };

  function getMockTotalFilter() {
    return {
      'count': 1,
      'results': [{
        'email': 'fagner@gmail.com',
        'gpg_id': '123456789',
        'gcm_id': 'ciF1ZbHwCCk:APA91DUowKZAcx6doQATI_8F8Y-gvVrYR2TK6vU8t3P6YfoWgRJ4jOpONS',
        'environment_info': {
          'location_status': 'success',
          'location_country': 'Brazil',
          'location_country_code': 'BR',
          'location_region': 'PB',
          'location_region_name': 'Paraiba',
          'location_city': 'Campina Grande',
          'location_zip': '58700-000',
          'location_lat': '-7.212775',
          'location_lon': '-35.908247',
          'location_timezone': 'Brasilia',
          'location_isp': 'Wikimedia Foundation',
          'location_org': 'Wikimedia Foundation',
          'location_as': '3',
          'location_query': '208.80.152.201',
          'device_language': 'portuguese',
          'location_source': 'location_source',
          'location_date': '2050-09-04T19:13:40Z',
          'app_version': 'app_version'
        },
        'game': {
          'id': 1,
          'name': 'Zenny',
          'package_name': 'BJbXoCX',
          'game_service_id': '123456789',
          'game_image': 'https://imgnzn-a.akamaized.net/2015/08/20/20182943235768.jpg',
          'api_key': 'AIzaSyB0Tld-TleZQ6ThfsKaxHFnmhLpg5RcFiE'
        },
        'date': '2016-01-21T20:52:53.772783Z'
      }]
    };
  }

  function getMockListPushWithNullElement() {
    var pushes = getMockListPush();
    pushes.results.push(null);
    return pushes;
  }

  function getMockListPush() {
    return {
      'count': 5,
      'results': [
        {
          'data': '{\'message\': "{}"}',
          'date': '2016-01-21T20:54:20.803938Z',
          'query': '{"games":\'1\'}'
        }
      ]
    };
  }

  function getListPush() {
    return [
      {
        'data': '{\'message\': "{}"}',
        'date': '2016-01-21T20:54:20.803938Z',
        'query': '{"games":\'1\'}'
      },
      {
        'data': '{\'message\': "{}"}',
        'date': '2016-01-21T20:54:20.803938Z',
        'query': '{"games":\'1\'}'
      },
      {
        'data': '{\'message\': "{}"}',
        'date': '2016-01-21T20:54:20.803938Z',
        'query': '{"games":\'1\'}'
      },
      {
        'data': '{\'message\': "{}"}',
        'date': '2016-01-21T20:54:20.803938Z',
        'query': '{"games":\'1\'}'
      },
      {
        'data': '{\'message\': "{}"}',
        'date': '2016-01-21T20:54:20.803938Z',
        'query': '{"games":\'1\'}'
      }
    ];
  }

})();
