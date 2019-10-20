/*jshint maxlen:120 */
/*jshint -W079 */
/*jshint -W101 */
var participantsUtil = (function () {

  var $httpBackend, urlUtil;
  var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';

  return {
    mockGetParticipants: mockGetParticipants,
    mockQuerySearchDesc: mockQuerySearchDesc,
    mockRemoveGame: mockRemoveGame,
    mockRemoveRegion: mockRemoveRegion,
    mockGetEmptyParticipants: mockGetEmptyParticipants,
    mockGetCampaignParticipants: mockGetCampaignParticipants,
    mockGetParticipantsWithNullElement: mockGetParticipantsWithNullElement
  };

  function mockGetCampaignParticipants($httpBackend, urlUtil, query, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?campaigns=1&ordering=game__name&page=' + page + '&query=' + query)
      .respond(200, mockDataParticipants.getMockParticipants());
    $httpBackend.expectGET(urlUtil.API + 'participant/?campaigns=1&ordering=game__name&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetParticipants($httpBackend, urlUtil, query, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?ordering=game__name&page=' + page + '&query=' + query)
      .respond(200, mockDataParticipants.getMockParticipants());
    $httpBackend.expectGET(urlUtil.API + 'participant/?ordering=game__name&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetParticipantsWithNullElement($httpBackend, urlUtil, query, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?ordering=game__name&page=' + page + '&query=' + query)
      .respond(200, mockDataParticipants.getMockParticipantsWithNullElement());
    $httpBackend.expectGET(urlUtil.API + 'participant/?ordering=game__name&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetEmptyParticipants($httpBackend, urlUtil, query, page) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?ordering=game__name&page=' + page + '&query=' + query)
      .respond(200, {'count': 1, 'results': []});
    $httpBackend.expectGET(urlUtil.API + 'participant/?ordering=game__name&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockQuerySearchDesc($httpBackend, urlUtil, order) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?ordering=-' + order + '&page=1&query=')
      .respond(200, mockData.getMockPlayers());
    $httpBackend.expectGET(urlUtil.API + 'participant/?ordering=-' + order + '&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockRemoveGame($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?games=1&ordering=game__name&page=1&query=')
      .respond(200, mockData.getMockPlayers());
    $httpBackend.expectGET(urlUtil.API + 'participant/?games=1&ordering=game__name&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockRemoveRegion($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'participant/?location_country_codes=BR,CA,AR,BR&ordering=game__name&page=1&query=')
      .respond(200, mockData.getMockPlayers());
    $httpBackend.expectGET(urlUtil.API + 'participant/?location_country_codes=BR,CA,AR,BR&ordering=game__name&page=1&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }
})();
