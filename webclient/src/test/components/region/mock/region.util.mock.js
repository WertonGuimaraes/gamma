/*jshint maxlen:120 */
/*jshint -W079 */
/*jshint -W101*/
/*jshint -W106*/
var regionUtil = (function () {

  var $httpBackend, urlUtil;
  var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';
  var region = {id: 1, name: 'Name 0', countries: [{country_name: 'Brazil', country_code: 'BR'}]};
  var regions = getRegions;

  return {
    mockGetRegionCreate: mockGetRegionCreate,
    mockGetRegion: mockGetRegion,
    mockGetRegions: mockGetRegions,
    mockGetRegionEdit: mockGetRegionEdit,
    mockNextListFilter: mockNextListFilter,
    mockChange: mockChange,
    mockGetAllRegions: mockGetAllRegions,
    getRegions: getRegions,
    mockGetOrderRegions: mockGetOrderRegions,
    mockGetRegionEditFail: mockGetRegionEditFail,
    mockGetRegionsWithNullElement: mockGetRegionsWithNullElement
  };

  function mockGetRegionCreate($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenPOST(urlUtil.API + 'region/').respond(201, {});
    $httpBackend.expectPOST(urlUtil.API + 'region/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetRegionEdit($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenPUT(urlUtil.API + 'region/1/').respond(200, {});
    $httpBackend.expectPUT(urlUtil.API + 'region/1/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetRegionEditFail($httpBackend, urlUtil) {
    $httpBackend.whenPUT(urlUtil.API + 'region/1/').respond(404, {});
    $httpBackend.expectPUT(urlUtil.API + 'region/1/');
  }

  function mockGetRegion($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'region/1/').respond(200, region);
    $httpBackend.expectGET(urlUtil.API + 'region/1/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetAllRegions($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'region/').respond(200, regions());
  }

  function mockGetRegions($httpBackend, urlUtil, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'region/?include_countries=false&ordering=name&page=' + page + '&query=').respond(200, regions());
    $httpBackend.expectGET(urlUtil.API + 'region/?include_countries=false&ordering=name&page=' + page + '&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetRegionsWithNullElement($httpBackend, urlUtil, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'region/?include_countries=false&ordering=name&page=' + page + '&query=').respond(200, getRegionsWithNullElement());
    $httpBackend.expectGET(urlUtil.API + 'region/?include_countries=false&ordering=name&page=' + page + '&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetOrderRegions($httpBackend, urlUtil, page, ordering) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'region/?include_countries=false&ordering=' + ordering + '&page=' + page + '&query=').respond(200, regions());
    $httpBackend.expectGET(urlUtil.API + 'region/?include_countries=false&ordering=' + ordering + '&page=' + page + '&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockNextListFilter($httpBackend, urlUtil, query, page) {
    $httpBackend.whenGET(urlUtil.API + 'region/search?include_countries=false&order_by=name&page=' + page + '&query=' + query).respond(200, nextListFilter());
    $httpBackend.expectGET(urlUtil.API + 'region/search?include_countries=false&order_by=name&page=' + page + '&query=' + query);
  }

  function mockChange($httpBackend, urlUtil, query, countries) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'region/?include_countries=' + countries + '&ordering=name&page=1&query=' + query).respond(200, getRegions());
    $httpBackend.expectGET(urlUtil.API + 'region/?include_countries=' + countries + '&ordering=name&page=1&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function getRegionsWithNullElement(){
    var regions = getRegions();
    regions.results.push(null);
    return regions;
  }

  function getRegions() {
    return {
      'count': 5, 'results': [
        {
          'id': 1,
          'name': 'Region 1',
          'countries': [{'country_name': 'brazil', 'country_code': 'BR'}, {
            'country_name': 'canada',
            'country_code': 'CA'
          }]
        },
        {
          'id': 3,
          'name': 'Region 2',
          'countries': [
            {'country_name': 'france', 'country_code': 'FR'},
            {'country_name': 'canada', 'country_code': 'CA'},
            {'country_name': 'peru', 'country_code': 'PE'}
          ]
        },
        {
          'id': 2, 'name': 'Region 3',
          'countries': [{'country_name': 'Argentina', 'country_code': 'AR'}]
        },
        {
          'id': 4,
          'name': 'Region 4',
          'countries': [{'country_name': 'Brazil', 'country_code': 'BR'}]
        }
      ]
    };
  }

  function nextListFilter() {
    return [
      {
        'id': 1,
        'name': 'Region 1',
        'countries': [{'country_name': 'brazil', 'country_code': 'BR'},
          {
            'country_name': 'canada',
            'country_code': 'CA'
          }]
      },
      {
        'id': 4,
        'name': 'Region 4',
        'countries': [{'country_name': 'Brazil', 'country_code': 'BR'}]
      }
    ];
  }

})();
