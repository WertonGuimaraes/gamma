/*jshint maxlen:120 */
/*jshint -W079 */
/*jshint -W101*/
/*jshint -W106*/
var bannerUtil = (function () {

  var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';

  return {
    getMockValidBanner: getMockValidBanner,
    getMockValidGames: getMockValidGames,
    getMockValidCampaigns: getCampaign,
    getMockValidUrls: getMockValidUrls,
    getMockValidRegions: getMockValidRegions,
    mockGetBannerCreate: mockGetBannerCreate,
    mockGetBannerCreateFail: mockGetBannerCreateFail,
    mockGetBanner: mockGetBanner,
    mockGetBanners: mockGetBanners,
    mockGetBannerEdit: mockGetBannerEdit,
    mockQuerySearch: mockQuerySearch,
    mockQuerySearchDesc: mockQuerySearchDesc,
    mockUploadImage: mockUploadImage,
    getImageURL: getImageURL,
    mockQueryGame: mockQueryGame,
    mockQueryRegion: mockQueryRegion,
    mockQueryCampaign: mockQueryCampaign,
    mockUploadImageFail: mockUploadImageFail,
    mockGetBannerEditFail: mockGetBannerEditFail,
    mockPatchBannerActivate: mockPatchBannerActivate,
    mockGetEmptyBanners: mockGetEmptyBanners,
    getBanners: getBanners,
    getMockDuplicateRegions: getMockDuplicateRegions,
    mockGetBannersWithNullElement: mockGetBannersWithNullElement,
    mockRemoveGame: mockRemoveGame,
    mockRemoveRegion: mockRemoveRegion,
    mockRemoveCampaign: mockRemoveCampaign,
    mockRemoveBanner: mockRemoveBanner
  };

  function mockUploadImage($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game').respond(200, getGames());
    $httpBackend.whenGET(urlUtil.API + 'region').respond(200, getRegions());
    $httpBackend.whenPOST(urlUtil.API + 'image/').respond(201, getImageURL());
    $httpBackend.expectPOST(urlUtil.API + 'image/');
  }

  function mockUploadImageFail($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(404, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game').respond(200, getGames());
    $httpBackend.whenGET(urlUtil.API + 'region').respond(200, getRegions());
    $httpBackend.whenPOST(urlUtil.API + 'image/').respond(201, getImageURL());
    $httpBackend.expectPOST(urlUtil.API + 'image/');
  }

  function mockGetBannerCreate($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'banner/').respond(201, {});
    $httpBackend.expectPOST(urlUtil.API + 'banner/');
  }

  function mockPatchBannerActivate($httpBackend, urlUtil, active) {
    $httpBackend.when('PATCH', urlUtil.API + 'banner/').respond(200, {active: active});
    $httpBackend.expect('PATCH', urlUtil.API + 'banner/');
  }

  function mockGetBannerCreateFail($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'banner/').respond(404, {});
    $httpBackend.expectPOST(urlUtil.API + 'banner/');
  }

  function mockGetBannerEdit($httpBackend, urlUtil) {
    $httpBackend.whenPUT(urlUtil.API + 'banner/1/').respond(201, {});
    $httpBackend.expectPUT(urlUtil.API + 'banner/1/');
  }

  function mockGetBannerEditFail($httpBackend, urlUtil) {
    $httpBackend.whenPUT(urlUtil.API + 'banner/1/').respond(404, {});
    $httpBackend.expectPUT(urlUtil.API + 'banner/1/');
  }

  function mockGetBanner($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'banner/1/').respond(200, getBanner());
    $httpBackend.whenGET(urlUtil.API + 'game').respond(200, getGames());
    $httpBackend.whenGET(urlUtil.API + 'region').respond(200, getRegions());
    $httpBackend.expectGET(urlUtil.API + 'banner/1/');
  }

  function mockGetBanners($httpBackend, urlUtil, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'banner/?ordering=-status&page=' + page + '&query=').respond(200, getBanners());
    $httpBackend.expectGET(urlUtil.API + 'banner/?ordering=-status&page=' + page + '&query=');
  }

  function mockGetBannersWithNullElement($httpBackend, urlUtil, page) {
    var banners = getBanners();
    banners.results.push(null);
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'banner/?ordering=name&page=' + page + '&query=').respond(200, banners);
    $httpBackend.expectGET(urlUtil.API + 'banner/?ordering=name&page=' + page + '&query=');
  }

  function mockGetEmptyBanners($httpBackend, urlUtil, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'banner/?ordering=-status&page=' + page + '&query=').respond(200, {
      'count': 0,
      'results': []
    });
    $httpBackend.expectGET(urlUtil.API + 'banner/?ordering=name&page=' + page + '&query=');
  }

  function mockQuerySearch($httpBackend, urlUtil, name) {
    $httpBackend.whenGET(urlUtil.API + 'banner/?ordering=name&page=1&query=' + name).respond(200, getSearchedBanners());
    $httpBackend.whenGET(urlUtil.API + 'banner/?ordering=name&page=2&query=' + name).respond(200, getSearchedBanners());
    $httpBackend.expectGET(urlUtil.API + 'banner/?ordering=name&page=1&query=' + name);
    $httpBackend.expectGET(urlUtil.API + 'banner/?ordering=name&page=2&query=' + name);
  }

  function mockQuerySearchDesc($httpBackend, urlUtil, orderBy) {
    $httpBackend.whenGET(urlUtil.API + 'banner/?ordering=-' + orderBy + '&page=1&query=').respond(200, getSearchedBanners());
    $httpBackend.expectGET(urlUtil.API + 'banner/?ordering=-' + orderBy + '&page=1&query=');
  }

  function mockQueryGame($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game').respond(200, getGames());
    $httpBackend.expectGET(urlUtil.API + 'game');
  }

  function mockQueryRegion($httpBackend, urlUtil, query) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'region/?include_countries=true&ordering=name&page=1&query=' + query).respond(200, getRegions());
    $httpBackend.expectGET(urlUtil.API + 'region/?include_countries=true&ordering=name&page=1&query=' + query);
  }

  function mockQueryCampaign($httpBackend, urlUtil, query) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'campaign/?ordering=-name&page=1&query=' + query).respond(200, getCampaign());
    $httpBackend.expectGET(urlUtil.API + 'campaign/?ordering=-name&page=1&query=' + query);
  }

  function mockRemoveGame($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'banner/?games=1&ordering=-status&page=1&query=')
      .respond(200, getBanners());
    $httpBackend.expectGET(urlUtil.API + 'banner/?games=1&ordering=-status&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockRemoveRegion($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'banner/?ordering=-status&page=1&query=&regions=BR,CA,AR,BR')
      .respond(200, getBanners());
    $httpBackend.expectGET(urlUtil.API + 'banner/?ordering=-status&page=1&query=&regions=BR,CA,AR,BR');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockRemoveCampaign($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'banner/?campaigns=1,3&ordering=-status&page=1&query=')
      .respond(200, getBanners());
    $httpBackend.expectGET(urlUtil.API + 'banner/?campaigns=1,3&ordering=-status&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockRemoveBanner($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'banner/?banners=1,3&ordering=-status&page=1&query=')
      .respond(200, getBanners());
    $httpBackend.expectGET(urlUtil.API + 'banner/?banners=1,3&ordering=-status&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function getImageURL() {
    return 'http://asus.com/zenny.jpeg';
  }

  function getMockValidBanner() {
    return {banner_configuration_name: 'Banners to Zenny Games', active: false};
  }

  function getMockValidGames() {
    return [{name: 'Zenny Worldz'}, {name: 'Zenny Kart'}];
  }

  function getMockValidUrls() {
    return [{
      image_url: 'http://asus.com/zenny.png',
      target_url: 'http://asus.com',
      name: 'default name'
    }];
  }

  function getMockValidRegions() {
    return [{'name': 'Brazil', 'countries': [{'country_code': 'AR', 'country_name': 'Argentina', 'id': 11}]}];
  }

  function getMockDuplicateRegions() {
    return [{'name': 'Brazil', 'countries': [{'country_code': 'AR', 'country_name': 'Argentina', 'id': 11}]},
      {'name': 'Brazil', 'countries': [{'country_code': 'AR', 'country_name': 'Argentina', 'id': 11}]}];
  }

  function getBanner() {
    return {
      'id': 1,
      'banner_configuration_name': 'admin',
      'campaigns': getCampaign(),
      'begin_date': new Date('2015-11-20T03:00:00Z'),
      'end_date': new Date('2016-01-14T03:00:00Z'),
      'gmt_timezone': 'Asia/Kabul',
      'banners': [
        {
          'image_url': 'https://mail.google.com/mail/u/0/#inbox.jpg',
          'target_url': 'http://localhost:3000/#/home/banner/create',
          'language': 'PT',
          'name': 'default name'

        }
      ],
      'regions': [
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
          'name': 'Zenny',
          'package_name': 'asus.com',
          'game_service_id': '1',
          'image_link': 'http://192.168.17.49:8000/static/a2109f73/images/headshot.png',
          'phases': [
            {
              'name': 'voltz',
              'score': 1,
              'period': 1
            }
          ]
        }
      ]
    };
  }

  function getBanners() {
    return {
      'count': 6, 'results': [
        {
          'id': 1,
          'banner_configuration_name': 'Banner 1',
          'language': 'EN',
          'campaigns': getCampaign(),
          'begin_date': new Date('2015-11-20T03:00:00Z'),
          'end_date': new Date('2016-01-14T03:00:00Z'),
          'gmt_timezone': 'Asia/Kabul',
          'banners': [
            {
              'image_url': 'https://mail.google.com/mail/u/0/#inbox.jpg',
              'target_url': 'http://localhost:3000/#/home/banner/create',
              'language': 'PT',
              'name': 'default name'
            }
          ],
          'regions': [
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
              'name': 'Zenny',
              'package_name': 'asus.com',
              'game_service_id': '1',
              'image_link': 'http://192.168.17.49:8000/static/a2109f73/images/headshot.png',
              'phases': [
                {
                  'name': 'voltz',
                  'score': 1,
                  'period': 1
                }
              ]
            }
          ]
        },
        {
          'id': 2,
          'banner_configuration_name': 'Banner 2',
          'language': 'EN',
          'campaigns': getCampaign(),
          'begin_date': new Date('2015-11-20T03:00:00Z'),
          'end_date': new Date('2016-01-14T03:00:00Z'),
          'gmt_timezone': 'Asia/Kabul',
          'banners': [
            {
              'image_url': 'https://mail.google.com/mail/u/0/#inbox.jpg',
              'target_url': 'http://localhost:3000/#/home/banner/create',
              'language': 'PT',
              'name': 'default name'
            }
          ],
          'regions': [
            {
              'id': 32,
              'name': 'Brazil',
              'countries': [
                {
                  'country_name': 'Brazil',
                  'country_code': 'BR',
                  'language': 'PT'
                }
              ]
            }
          ],
          'games': [
            {
              'id': 1,
              'name': 'Zenny',
              'package_name': 'asus.com',
              'game_service_id': '1',
              'image_link': 'http://192.168.17.49:8000/static/a2109f73/images/headshot.png',
              'phases': [
                {
                  'name': 'voltz',
                  'score': 1,
                  'period': 1
                }
              ]
            }
          ]
        },
        {
          'id': 3,
          'banner_configuration_name': 'Banner 3',
          'language': 'EN',
          'campaigns': getCampaign(),
          'banners': [
            {
              'image_url': 'https://mail.google.com/mail/u/0/#inbox.jpg',
              'target_url': 'http://localhost:3000/#/home/banner/create',
              'language': 'PT',
              'name': 'default name'
            }
          ],
          'regions': [
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
              'name': 'Zenny',
              'package_name': 'asus.com',
              'game_service_id': '1',
              'image_link': 'http://192.168.17.49:8000/static/a2109f73/images/headshot.png',
              'phases': [
                {
                  'name': 'voltz',
                  'score': 1,
                  'period': 1
                }
              ]
            }
          ]
        }

      ]
    };
  }

  function getSearchedBanners() {
    return {
      'count': 1, 'results': [{
        'id': 3,
        'banner_configuration_name': 'Banner 3',
        'language': 'EN',
        'campaigns': getCampaign(),
        'begin_date': new Date('2015-11-20T03:00:00Z'),
        'end_date': new Date('2016-01-14T03:00:00Z'),
        'gmt_timezone': 'Asia/Kabul',
        'banners': [
          {
            'image_url': 'https://mail.google.com/mail/u/0/#inbox.jpg',
            'target_url': 'http://localhost:3000/#/home/banner/create',
            'language': 'PT',
            'name': 'default name'
          }
        ],
        'regions': [
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
            'name': 'Zenny',
            'package_name': 'asus.com',
            'game_service_id': '1',
            'image_link': 'http://192.168.17.49:8000/static/a2109f73/images/headshot.png',
            'phases': [
              {
                'name': 'voltz',
                'score': 1,
                'period': 1
              }
            ]
          }
        ]
      }]
    };
  }

  function getCampaign(){
    return {
      'modified_date': '2016-03-22T13:59:54Z',
      'expiration_date': '2016-03-22T21:23:00Z',
      'id': 1,
      'name': 'Campaign to test banner',
      'active': false,
      'begin_date': '2016-03-21T21:23:00Z',
      'end_date': '2016-03-22T21:23:00Z',
      'participant_limit': 123,
      'regions': [
      {
        'id': 32,
        'name': 'Brazil',
        'color': '',
        'countries': [
          {
            'country_name': 'Brazil',
            'country_code': 'BR',
            'id': 32
          }
        ],
        'modified_date': null
      }
    ],
      'opened': false,
      'total_registered_participants': 0,
      'gmt_timezone': 'America/Recife',
      'forms': [
      {
        'game': {
          'id': 1,
          'modified_date': '2016-03-21T21:23:56Z',
          'name': 'game test campaign',
          'package_name': '123',
          'game_service_id': '123',
          'game_image': 'https://gamma-test.s3.amazonaws.com/game/game_icon_1458595434845.png',
          'api_key': '123',
          'form_template': '{\"selected\":{\"type\":\"item\",\"id\":\"123\",\"name\":\"attribute\"},\"templates\":[{\"type\":\"item\",\"id\":3,\"name\":\"attribute\"},{\"type\":\"container\",\"id\":1,\"columns\":[[]],\"name\":\"feature\"}],\"dropzones\":{\"root\":[{\"type\":\"item\",\"id\":\"123\",\"name\":\"attribute\"}]}}'
        },
        'form_value': '{\"123\":\"123\"}'
      }
    ],
      'status': 3
    };
  }

  function getGames() {
    return [{name: 'Zenny'}, {name: 'Zelda'}];
  }

  function getRegions() {
    return {'count': 2, 'results': [{name: 'America'}, {name: 'Asia'}]};
  }

})();
