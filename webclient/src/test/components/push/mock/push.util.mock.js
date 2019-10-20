/*jshint maxlen:120 */
/*jshint -W079 */
/*jshint -W101 */
var pushUtil = (function () {

  var $httpBackend, urlUtil;
  var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';

  return {
    mockGetListPush: mockGetListPush,
    mockGetEmptyListPush: mockGetEmptyListPush,
    mockPush: mockPush,
    mockPushError: mockPushError,
    mockInitController: mockInitController,
    mockFilter: mockFilter,
    mockErrorFilter: mockErrorFilter,
    mockRemoveGame: mockRemoveGame,
    mockRemoveCampaign: mockRemoveCampaign,
    mockRemoveRegion: mockRemoveRegion,
    mockFilterWithParticipants: mockFilterWithParticipants,
    mockGetListPushWithNullElement: mockGetListPushWithNullElement
  };

  function mockGetListPush($httpBackend, urlUtil, ordering, page, query) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'push/?ordering=' + ordering + '&page=' + page + '&query=' + query).respond(200, mockDataPush.getMockListPush());
    $httpBackend.expectGET(urlUtil.API + 'push/?ordering=' + ordering + '&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetListPushWithNullElement($httpBackend, urlUtil, ordering, page, query) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'push/?ordering=' + ordering + '&page=' + page + '&query=' + query).respond(200, mockDataPush.getMockListPushWithNullElement());
    $httpBackend.expectGET(urlUtil.API + 'push/?ordering=' + ordering + '&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetEmptyListPush($httpBackend, urlUtil, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'push/?ordering=data&page=' + page + '&query=').respond(200, {
      'count': 0,
      'results': []
    });
    $httpBackend.expectGET(urlUtil.API + 'push/?ordering=data&page=' + page + '&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockPush($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenPOST(urlUtil.API + 'pushes/').respond(201, {});
    $httpBackend.expectPOST(urlUtil.API + 'pushes/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockPushError($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'pushes/').respond(404, {});
    $httpBackend.expectPOST(urlUtil.API + 'pushes/');
  }

  function mockInitController($httpBackend, urlUtil){
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'player/?page=1&query=')
      .respond(200, mockDataPush.getMockTotalFilter());
    $httpBackend.expectGET(urlUtil.API + 'player/?page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockFilter($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'player/?games=1,2&page=1&query=')
      .respond(200, mockDataPush.getMockTotalFilter());
    $httpBackend.expectGET(urlUtil.API + 'player/?games=1,2&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockFilterWithParticipants($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?campaigns=1,2,3&games=1,2&location_country_codes=BR,CA,FR,CA,PE,AR,BR&page=1&query=')
      .respond(200, mockDataPush.getMockTotalFilter());
    $httpBackend.expectGET(urlUtil.API + 'participant/?campaigns=1,2,3&games=1,2&location_country_codes=BR,CA,FR,CA,PE,AR,BR&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockErrorFilter($httpBackend, urlUtil) {
    $httpBackend.whenGET(urlUtil.API + 'player/search?games=1,2&query=')
      .respond(404, {});
    $httpBackend.expectGET(urlUtil.API + 'player/search?games=1,2&query=');
  }

  function mockRemoveGame($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'player/?games=1&page=1&query=')
      .respond(200, mockDataPush.getMockTotalFilter());
    $httpBackend.expectGET(urlUtil.API + 'player/?games=1&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockRemoveCampaign($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?campaigns=1,3&page=1&query=')
      .respond(200, mockDataPush.getMockTotalFilter());
    $httpBackend.expectGET(urlUtil.API + 'participant/?campaigns=1,3&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockRemoveRegion($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'player/?location_country_codes=BR,CA,AR,BR&page=1&query=')
      .respond(200, mockDataPush.getMockTotalFilter());
    $httpBackend.expectGET(urlUtil.API + 'player/?location_country_codes=BR,CA,AR,BR&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

})();
