/*jshint maxlen:120 */
/*jshint -W079 */
/*jshint -W101*/
/*jshint -W106*/
var campaignUtil = (function () {

  var $httpBackend, urlUtil;
  var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';

  return {
    mockGetCampaigns: mockGetCampaigns,
    mockGetValidCampaign: mockGetValidCampaign,
    mockGetCampaignCreate: mockGetCampaignCreate,
    mockGetCampaignEdit: mockGetCampaignEdit,
    mockGetCampaign: mockGetCampaign,
    mockActivateCampaign: mockActivateCampaign,
    mockSearchTextChange: mockSearchTextChange,
    mockQuerySearch: mockQuerySearch,
    mockGetAllCampaign: mockGetAllCampaign,
    getCampaigns: getCampaigns,
    mockGetCampaignCreateFail: mockGetCampaignCreateFail,
    mockGetCampaignsWithNullElement: mockGetCampaignsWithNullElement,
    mockGetGeneral: mockGetGeneral,
    mockGetCampaignsGeneral: mockGetCampaignsWithGeneral
  };

  function mockGetCampaign($httpBackend, urlUtil, id) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'campaign/' + id + '/').respond(200, getCampaigns()[0]);
    $httpBackend.expectGET(urlUtil.API + 'campaign/' + id + '/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetCampaigns($httpBackend, urlUtil, page, query, ordering) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'campaign/?ordering=' + ordering + '&page=' + page + '&query=' + query).respond(200, getCampaigns());
    $httpBackend.expectGET(urlUtil.API + 'campaign/?ordering=' + ordering + '&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetCampaignsWithGeneral($httpBackend, urlUtil, page, query, ordering) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'settings/').respond(200, getGeneral());
    $httpBackend.whenGET(urlUtil.API + 'campaign/?ordering=' + ordering + '&page=' + page + '&query=' + query).respond(200, getCampaigns());
    $httpBackend.expectGET(urlUtil.API + 'campaign/?ordering=' + ordering + '&page=' + page + '&query=' + query);
    $httpBackend.expectGET(urlUtil.API + 'settings/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetCampaignsWithNullElement($httpBackend, urlUtil, page, query) {
    var campaigns = getCampaigns();
    campaigns.results.push(null);
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'campaign/?ordering=status&page=' + page + '&query=' + query).respond(200, campaigns);
    $httpBackend.expectGET(urlUtil.API + 'campaign/?ordering=status&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetCampaignCreate($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'campaign/').respond(201, {});
    $httpBackend.expectPOST(urlUtil.API + 'campaign/');
  }

  function mockGetCampaignCreateFail($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'campaign/').respond(404, {});
    $httpBackend.expectPOST(urlUtil.API + 'campaign/');
  }

  function mockGetCampaignEdit($httpBackend, urlUtil) {
    $httpBackend.whenPUT(urlUtil.API + 'campaign/1/').respond(201, {});
    $httpBackend.expectPUT(urlUtil.API + 'campaign/1/');
  }

  function mockGetCampaign($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'campaign/1/').respond(200, getCampaign());
    $httpBackend.whenGET(urlUtil.API + 'game/').respond(200, []);
    $httpBackend.whenGET(urlUtil.API + 'region/').respond(200, []);
    $httpBackend.expectGET(urlUtil.API + 'campaign/1/');
  }

  function mockActivateCampaign($httpBackend, urlUtil) {
    $httpBackend.whenGET(urlUtil.API + 'campaign/1/activate').respond(200, getCampaignActivated());
    $httpBackend.expectGET(urlUtil.API + 'campaign/1/activate');
  }

  function mockSearchTextChange($httpBackend, urlUtil, name) {
    $httpBackend.whenGET(urlUtil.API + 'campaign?name=' + name + '&page=1').respond(200, getSearchedCampaigns());
    $httpBackend.expectGET(urlUtil.API + 'campaign?name=' + name + '&page=1');
  }

  function mockQuerySearch($httpBackend, urlUtil, name) {
    $httpBackend.whenGET(urlUtil.API + 'campaign?name=' + name + '&page=1').respond(200, getSearchedCampaigns());
    $httpBackend.expectGET(urlUtil.API + 'campaign?name=' + name + '&page=1');
  }

  function mockGetAllCampaign($httpBackend, urlUtil) {
    $httpBackend.whenGET(urlUtil.API + 'campaign').respond(200, getSearchedCampaigns());
  }

  function mockGetValidCampaign() {
    return {
      'name': 'Campanha 1',
      'active': false,
      'begin_date': new Date('2015-11-20T03:00:00Z'),
      'end_date': new Date('2016-01-14T03:00:00Z'),
      'participant_limit': 10000
    };
  }

  function getCampaign() {
    return {
      'id': 1,
      'name': 'Campanha 1',
      'active': false,
      'begin_date': new Date('2015-11-20T03:00:00Z'),
      'end_date': new Date('2016-01-14T03:00:00Z'),
      'participant_limit': 10000,
      'gmt_timezone': 'Asia/Kabul',
      'regions': [
        {
          'id': 11,
          'name': 'Argentina',
          'countries': [
            {
              'country_name': 'Argentina',
              'country_code': 'AR'
            }
          ]
        },
        {
          'id': 32,
          'name': 'Brazil',
          'countries': [
            {
              'country_name': 'Brazil',
              'country_code': 'BR'
            }
          ]
        }
      ],
      'forms': [{
        'game': {
          'id': 6,
          'modified_date': '2016-03-07T13:04:36.463148Z',
          'name': 'game 005',
          'package_name': 'br.com.0005',
          'game_service_id': '12365478998756423312312',
          'game_image': 'https://gamma-test.s3.amazonaws.com/game/game_icon_1457114499079.jpg',
          'api_key': 'apikey0005',
          'form_template': {
            'selected': {'type': 'item', 'id': 'score', 'name': 'attribute'},
            'templates': [{'type': 'item', 'id': 6, 'name': 'attribute'}, {
              'type': 'container',
              'id': 2,
              'columns': [[]],
              'name': 'feature'
            }],
            'dropzones': {
              'root': [{
                'type': 'container',
                'id': 'zix',
                'columns': [[{'type': 'item', 'id': 'name', 'name': 'attribute'}, {
                  'type': 'item',
                  'id': 'score',
                  'name': 'attribute'
                }]],
                'name': 'feature'
              }, {'type': 'item', 'id': 'score', 'name': 'attribute'}, {
                'type': 'item',
                'id': 'name',
                'name': 'attribute'
              }]
            }
          }
        }, 'form_value': {'zix': {'name': '1', 'score': '2'}, 'score': '3', 'name': '4'}
      }, {
        'game': {
          'id': 5,
          'modified_date': '2016-03-03T19:10:21.000228Z',
          'name': 'game 004',
          'package_name': 'br.com.0004',
          'game_service_id': 'asdas5465465454',
          'game_image': 'https://gamma-test.s3.amazonaws.com/game/game_icon_1457029222205.jpg',
          'api_key': 'apikey0004',
          'form_template': {
            'selected': null,
            'templates': [{'type': 'item', 'id': 6}, {'type': 'container', 'id': 2, 'columns': [[]]}],
            'dropzones': {'root': [{'type': 'item', 'id': 4}, {'type': 'item', 'id': 5}]}
          }
        }, 'form_value': {'4': '3', '5': '3'}
      }]
    };
  }

  function getCampaignActivated() {
    return {
      'id': 1,
      'name': 'Campanha 1',
      'active': true,
      'begin_date': new Date('2015-11-20T03:00:00Z'),
      'end_date': new Date('2016-01-14T03:00:00Z'),
      'participant_limit': 10000,
      'regions': [
        {
          'id': 11,
          'name': 'Argentina',
          'countries': [
            {
              'country_name': 'Argentina',
              'country_code': 'AR'
            }
          ]
        },
        {
          'id': 32,
          'name': 'Brazil',
          'countries': [
            {
              'country_name': 'Brazil',
              'country_code': 'BR'
            }
          ]
        }
      ],
      'games': [
        {
          'id': 1,
          'name': 'Zenny Worldz',
          'package_name': 'com.asus',
          'game_service_id': '123',
          'image_link': 'http://tudo.extra.com.br/imagens/2015/03/Batman_102813_1600.jpg',
          'phases': [
            {
              'name': 'voltz',
              'score': 2,
              'period': 2
            }
          ]
        }
      ]
    };
  }


  function getCampaigns() {
    return {
      'count': 6, 'results': [
        {
          'id': 1,
          'name': 'Campanha 1',
          'active': false,
          'begin_date': new Date('2015-11-20T03:00:00Z'),
          'end_date': new Date('2016-01-14T03:00:00Z'),
          'participant_limit': 10000,
          'regions': [
            {
              'id': 11,
              'name': 'Argentina',
              'countries': [
                {
                  'country_name': 'Argentina',
                  'country_code': 'AR'
                }
              ]
            },
            {
              'id': 32,
              'name': 'Brazil',
              'countries': [
                {
                  'country_name': 'Brazil',
                  'country_code': 'BR'
                }
              ]
            }
          ],
          'games': [
            {
              'id': 1,
              'name': 'Zenny Worldz',
              'package_name': 'com.asus',
              'game_service_id': '123',
              'image_link': 'http://tudo.extra.com.br/imagens/2015/03/Batman_102813_1600.jpg',
              'phases': [
                {
                  'name': 'voltz',
                  'score': 2,
                  'period': 2
                }
              ]
            }
          ]
        },

        {
          'id': 2,
          'name': 'Campanha 2',
          'active': false,
          'begin_date': new Date('2015-11-20T03:00:00Z'),
          'end_date': new Date('2016-01-14T03:00:00Z'),
          'participant_limit': 10000,
          'regions': [
            {
              'id': 11,
              'name': 'Argentina',
              'countries': [
                {
                  'country_name': 'Argentina',
                  'country_code': 'AR'
                }
              ]
            },
            {
              'id': 32,
              'name': 'Brazil',
              'countries': [
                {
                  'country_name': 'Brazil',
                  'country_code': 'BR'
                }
              ]
            }
          ],
          'games': [
            {
              'id': 1,
              'name': 'Zenny Worldz',
              'package_name': 'com.asus',
              'game_service_id': '123',
              'image_link': 'http://tudo.extra.com.br/imagens/2015/03/Batman_102813_1600.jpg',
              'phases': [
                {
                  'name': 'voltz',
                  'score': 2,
                  'period': 2
                }
              ]
            }
          ]
        },

        {
          'id': 3,
          'name': 'Campanha 3',
          'active': false,
          'begin_date': new Date('2015-11-20T03:00:00Z'),
          'end_date': new Date('2016-01-14T03:00:00Z'),
          'participant_limit': 10000,
          'regions': [
            {
              'id': 11,
              'name': 'Argentina',
              'countries': [
                {
                  'country_name': 'Argentina',
                  'country_code': 'AR'
                }
              ]
            },
            {
              'id': 32,
              'name': 'Brazil',
              'countries': [
                {
                  'country_name': 'Brazil',
                  'country_code': 'BR'
                }
              ]
            }
          ],
          'games': [
            {
              'id': 1,
              'name': 'Zenny Worldz',
              'package_name': 'com.asus',
              'game_service_id': '123',
              'image_link': 'http://tudo.extra.com.br/imagens/2015/03/Batman_102813_1600.jpg',
              'phases': [
                {
                  'name': 'voltz',
                  'score': 2,
                  'period': 2
                }
              ]
            }
          ]
        }
      ]
    };
  }


  function getSearchedCampaigns() {
    return [
      {
        'id': 1,
        'name': 'Campanha 1',
        'active': false,
        'begin_date': new Date('2015-11-20T03:00:00Z'),
        'end_date': new Date('2016-01-14T03:00:00Z'),
        'participant_limit': 10000,
        'regions': [
          {
            'id': 11,
            'name': 'Argentina',
            'countries': [
              {
                'country_name': 'Argentina',
                'country_code': 'AR'
              }
            ]
          },
          {
            'id': 32,
            'name': 'Brazil',
            'countries': [
              {
                'country_name': 'Brazil',
                'country_code': 'BR'
              }
            ]
          }
        ],
        'games': [
          {
            'id': 1,
            'name': 'Zenny Worldz',
            'package_name': 'com.asus',
            'game_service_id': '123',
            'image_link': 'http://tudo.extra.com.br/imagens/2015/03/Batman_102813_1600.jpg',
            'phases': [
              {
                'name': 'voltz',
                'score': 2,
                'period': 2
              }
            ]
          }
        ]
      },

      {
        'id': 2,
        'name': 'Campanha 2',
        'active': false,
        'begin_date': new Date('2015-11-20T03:00:00Z'),
        'end_date': new Date('2016-01-14T03:00:00Z'),
        'participant_limit': 10000,
        'regions': [
          {
            'id': 11,
            'name': 'Argentina',
            'countries': [
              {
                'country_name': 'Argentina',
                'country_code': 'AR'
              }
            ]
          },
          {
            'id': 32,
            'name': 'Brazil',
            'countries': [
              {
                'country_name': 'Brazil',
                'country_code': 'BR'
              }
            ]
          }
        ],
        'games': [
          {
            'id': 1,
            'name': 'Zenny Worldz',
            'package_name': 'com.asus',
            'game_service_id': '123',
            'image_link': 'http://tudo.extra.com.br/imagens/2015/03/Batman_102813_1600.jpg',
            'phases': [
              {
                'name': 'voltz',
                'score': 2,
                'period': 2
              }
            ]
          }
        ]
      }
    ];
  }

  function mockGetGeneral($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'settings/').respond(200, getGeneral());
    $httpBackend.expectGET(urlUtil.API + 'settings/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function getGeneral() {
    return {
      'id': 1,
      'update_time_push': 300000,
      'update_time_participant_number': 10
    };
  }
})();
