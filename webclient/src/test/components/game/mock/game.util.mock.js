/*jshint maxlen:120 */
/*jshint -W079 */
/*jshint -W101*/
/*jshint -W106*/
var gameUtil = (function () {

  var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';

  return {
    mockGetGameCreate: mockGetGameCreate,
    mockGetGames: mockGetGames,
    mockGetGame: mockGetGame,
    mockGetGameEdit: mockGetGameEdit,
    mockSearchValue: mockSearchValue,
    mockOrderByAsc: mockOrderByAsc,
    mockOrderByDesc: mockOrderByDesc,
    mockUploadImage: mockUploadImage,
    mockGetAllGames: mockGetAllGames,
    mockGetEmptyGames: mockGetEmptyGames,
    mockGetGamesWithNullElement: mockGetGamesWithNullElement
  };

  function mockUploadImage($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenPOST(urlUtil.API + 'image/').respond(201, mockDataGame.getImageURL());
    $httpBackend.expectPOST(urlUtil.API + 'image/');
  }


  function mockGetGameCreate($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenPOST(urlUtil.API + 'game/').respond(201, {});
    $httpBackend.expectPOST(urlUtil.API + 'game/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetGameEdit($httpBackend, urlUtil) {
    $httpBackend.whenPUT(urlUtil.API + 'game/1/').respond(201, {});
    $httpBackend.expectPUT(urlUtil.API + 'game/1/');
  }

  function mockGetGames($httpBackend, urlUtil, page, query) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game/?ordering=name&page=' + page + '&query=' + query).respond(200, mockDataGame.getGames());
    $httpBackend.expectGET(urlUtil.API + 'game/?ordering=name&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetGamesWithNullElement($httpBackend, urlUtil, page, query) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game/?ordering=name&page=' + page + '&query=' + query).respond(200, mockDataGame.getGamesWithNullElement());
    $httpBackend.expectGET(urlUtil.API + 'game/?ordering=name&page=' + page + '&query=' + query);
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetEmptyGames($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game/?ordering=name&page=2&query=').respond(200, {'count': 0, 'results': []});
    $httpBackend.expectGET(urlUtil.API + 'game/?ordering=name&page=2&query=');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetAllGames($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game').respond(200, mockDataGame.getGames());
    $httpBackend.expectGET(urlUtil.API + 'game');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetGame($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game/1/').respond(200, mockDataGame.getGame());
    $httpBackend.expectGET(urlUtil.API + 'game/1/');
  }

  function mockSearchValue($httpBackend, urlUtil, value) {
    if (value === undefined) {
      value = '';
    }
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game/search?query=' + value).respond(200, mockDataGame.getSearchKart());
    $httpBackend.expectGET(urlUtil.API + 'game/search?query=' + value);
  }

  function mockOrderByAsc($httpBackend, urlUtil, value, field, page) {
    if (value === undefined) {
      value = '';
    }
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'game/?ordering=' + field + '&page=' + page + '&query=' + value).respond(200, mockDataGame.getGames());
    $httpBackend.expectGET(urlUtil.API + 'game/?ordering=' + field + '&page=' + page + '&query=' + value);
  }

  function mockOrderByDesc($httpBackend, urlUtil, value, field, page) {
    if (value === undefined) {
      value = '';
    }
    $httpBackend.whenGET(urlUtil.API + 'game/?ordering=-' + field + '&page=' + page + '&query=' + value).respond(200, mockDataGame.getGames());
    $httpBackend.expectGET(urlUtil.API + 'game/?ordering=-' + field + '&page=' + page + '&query=' + value);
  }

})();
