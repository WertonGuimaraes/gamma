/*jshint maxlen:120 */
/*jshint -W079 */
/*jshint -W106 */
var mockDataGame = (function () {
  return {
    getGame: getGame,
    getImageURL: getImageURL,
    getGames: getGames,
    getGamesWithNullElement: getGamesWithNullElement,
    getSearchKart: getSearchKart,
    mockGetValidGame: mockGetValidGame,
    mockStructureFeatureWithoutAttribute: mockStructureFeatureWithoutAttribute,
    mockStructureFeatureWithIdUndefined: mockStructureFeatureWithIdUndefined,
    mockStructureFeatureOrAttributeWithSameName: mockStructureFeatureOrAttributeWithSameName
  };

  function getImageURL() {
    return 'http://asus.com/zenny.jpeg';
  }

  function getGame() {

    return {
      'id': 1,
      name: 'Zenny',
      package_name: 'com.asus',
      game_service_id: 123,
      game_image: 'http://www.asus.com/zenny.png',
      api_key: '5164654wadsadwqwe'
    };

  }

  function getGamesWithNullElement() {
    var games = getGames();
    games.results.push(null);
    return games;
  }

  function getGames() {
    return {
      'count': 4, 'results': [
        {
          'id': 1,
          name: 'Zenny Worldz',
          package_name: 'com.asus',
          game_service_id: 123,
          game_image: 'http://www.asus.com/zennyw.png',
          api_key: '5164654wadsadwqwe',
          formPushValues: [{
            data: {message: 'tes', open: 'game', title: 'tes'},
            form_push_template: '',
            query: {}
          }]
        },
        {
          'id': 2,
          name: 'Zenny Kart',
          package_name: 'com.asus',
          game_service_id: 123,
          game_image: 'http://www.asus.com/zennyk.png',
          api_key: '5164654wadsadwqwe',
          formPushValues: [{
            data: {message: 'tes', open: 'game', title: 'tes'},
            form_push_template: '',
            query: {}
          }]
        }
      ]
    };
  }


  function getSearchKart() {
    return [
      {
        'id': 2,
        name: 'Zenny Kart',
        package_name: 'com.asus',
        game_service_id: 123,
        game_image: 'http://www.asus.com/zennyk.png',
        api_key: '5164654wadsadwqwe'
      }
    ];
  }

  function mockStructureFeatureWithoutAttribute() {
    return {
      'selected': null,
      'templates': [{'type': 'item', 'id': 2, 'name': 'attribute'}, {
        'type': 'container',
        'id': 2,
        'columns': [[]],
        'name': 'feature'
      }],
      'dropzones': {'root': [{'type': 'container', 'id': 1, 'columns': [[]], 'name': 'feature'}]}
    };
  }

  function mockStructureFeatureWithIdUndefined() {
    return {
      'selected': null,
      'templates': [{'type': 'item', 'id': 2, 'name': 'attribute'}, {
        'type': 'container',
        'id': 2,
        'columns': [[]],
        'name': 'feature'
      }],
      'dropzones': {
        'root': [{
          'type': 'container',
          'id': undefined,
          'columns': [[{'type': 'item', 'id': 2, 'name': 'attribute'}]],
          'name': 'feature'
        }]
      }
    };
  }

  function mockStructureFeatureOrAttributeWithSameName() {
    return {
      'selected': null,
      'templates': [{'type': 'item', 'id': 2, 'name': 'attribute'}, {
        'type': 'container',
        'id': 2,
        'columns': [[]],
        'name': 'feature'
      }],
      'dropzones': {
        'root': [{
          'type': 'container',
          'id': 'zix',
          'columns': [[
            {'type': 'item', 'id': 'name', 'name': 'attribute'}, {'type': 'item', 'id': 'name', 'name': 'attribute'}]],
          'name': 'feature'
        }]
      }
    };
  }

  function mockGetValidGame() {
    return {
      'id': 1,
      name: 'Zenny',
      package_name: 'com.asus',
      game_service_id: 123,
      game_image: 'http://www.asus.com/zenny.png',
      api_key: '5164654wadsadwqwe',
      analytics_view_id: "",
      form_template: {
        selected: null,
        templates: [
          {type: 'item', id: 2, name: 'attribute'},
          {type: 'container', id: 1, columns: [[]], name: 'feature'}
        ],
        dropzones: {
          'root': [
            {
              'type': 'container',
              'id': 1,
              'desc': '',
              'columns': [
                [
                  {
                    'type': 'item',
                    'id': '1'
                  },
                  {
                    'type': 'item',
                    'id': '2'
                  }
                ],
                [
                  {
                    'type': 'item',
                    'id': '3'
                  }
                ]
              ]
            },
            {
              'type': 'container',
              'id': 2,
              'desc': 'description',
              'columns': [
                [
                  {
                    'type': 'item',
                    'id': '1'
                  },
                  {
                    'type': 'item',
                    'id': '2'
                  }
                ],
                [
                  {
                    'type': 'item',
                    'id': '3'
                  }
                ]
              ]
            },
            {
              'type': 'item',
              'id': '4'
            },
            {
              'type': 'item',
              'id': '5'
            },
            {
              'type': 'item',
              'id': '6'
            }
          ]
        }
      }
    };
  }

})();
