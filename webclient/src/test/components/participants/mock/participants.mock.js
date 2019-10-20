/*jshint maxlen:120 */
/*jshint -W079 */
var mockDataParticipants = (function () {
  return {
    getMockParticipants: getMockParticipants,
    getMockParticipantsWithNullElement: getMockParticipantsWithNullElement
  };

  function getMockParticipantsWithNullElement(){
    var participants = getMockParticipants();
    participants.results.push(null);
    return participants;
  }

  function getMockParticipants() {
    return {
      'count': 2, 'results': [
        {
          'email': 'werton007@gmail.com',
          'gpg_id': 'meu_gpg_id',
          'gcm_id': 'meu_gcm_id',
          'location': {
            'status': 'success',
            'country': 'United States',
            'country_code': 'US',
            'region': 'CA',
            'region_name': 'California',
            'city': 'San Francisco',
            'zip_code': '94105',
            'lat': '37.7898',
            'lon': '-122.3942',
            'timezone': 'America/Los_Angeles',
            'isp': 'Wikimedia Foundation',
            'org': 'Wikimedia Foundation',
            'as_number': 'AS14907 Wikimedia US network',
            'query': '208.80.152.201'
          },
          'device_language': 'English',
          'game': {
            'api_key': 'D8:AA:43:97:59:EE:C5:95:26:6A:07:FF:GG:55:6G:F4:F0:C8:05:C8',
            'game_image': 'https://gamma-test.s3.amazonaws.com/game/game_icon_1458313112661.jpg',
            'game_service_id': '1235456789987654321',
            'modified_date': '2016-03-18T16:44:35.082144Z',
            'name': 'Zenny Worldz',
            'package_name': 'br.com.ufcg',
            'id': 1
          },
          'campaign': {
            'id': 1,
            'name': 'campaign 0001'
          }
        }
      ]
    };
  }
})();
