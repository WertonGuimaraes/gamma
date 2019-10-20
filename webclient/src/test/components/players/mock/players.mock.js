/*jshint maxlen:120 */
/*jshint -W079 */
var mockData = (function () {
  return {
    getMockPlayers: getMockPlayers,
    getMockPlayersWithNullElement: getMockPlayersWithNullElement
  };

  function getMockPlayersWithNullElement() {
    var players = getMockPlayers();
    players.results.push(null);
    return players;
  }

  function getMockPlayers() {
    return {
      'count': 2, 'results': [
        {
          'email': 'werton007@gmail.com',
          'gpg_id': 'meu_gpg_id',
          'gcm_id': 'meu_gcm_id',
          'environment_info': {
            'app_version': 'app_version',
            'device_language': 'portuguese',
            'location_as': '3',
            'location_city': 'Campina Grande',
            'location_country': 'Brazil',
            'location_country_code': 'BR',
            'location_date': '2050-09-04T19:13:40Z',
            'location_isp': 'Wikimedia Foundation',
            'location_lat': '-7.212775',
            'location_lon': '-35.908247',
            'location_org': 'Wikimedia Foundation',
            'location_query': '208.80.152.201',
            'location_region': 'PB',
            'location_region_name': 'Paraiba',
            'location_source': 'location_source',
            'location_status': 'success',
            'location_timezone': 'Brasilia',
            'location_zip': '58700-000'
          },
          'game': {
            'api_key': 'D8:AA:43:97:59:EE:C5:95:26:6A:07:FF:GG:55:6G:F4:F0:C8:05:C8',
            'game_image': 'https://gamma-test.s3.amazonaws.com/game/game_icon_1458313112661.jpg',
            'game_service_id': '1235456789987654321',
            'modified_date': '2016-03-18T16:44:35.082144Z',
            'name': 'Zenny Worldz',
            'package_name': 'br.com.ufcg',
            'id': 1
          },
        }
      ]
    };
  }
})();
