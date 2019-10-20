/*jshint maxlen:120 */
/*jshint -W079 */
/*jshint -W101*/
/*jshint -W106*/
var generalUtil = (function () {

  var $httpBackend, urlUtil;
  var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6Imxlbm5vbkB0aGViZWF0bGVzLmNvbSIsImV4cCI6MTQ0NTk0NTE0Nn0.AK_94Zt_x4y6lav59ACGVTlouPWUeOlqiBqYEzJqL0o';

  return {
    mockGetGeneralCreate: mockGetGeneralCreate,
    mockGetGeneral: mockGetGeneral
  };

  function mockGetGeneral($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'refresh-token/').respond(200, {token: token});
    $httpBackend.whenGET(urlUtil.API + 'settings/').respond(200, getGeneral());
    $httpBackend.expectGET(urlUtil.API + 'settings/');
    $httpBackend.expectPOST(urlUtil.API + 'refresh-token/');
  }

  function mockGetGeneralCreate($httpBackend, urlUtil) {
    $httpBackend.whenPOST(urlUtil.API + 'settings/').respond(201, {});
    $httpBackend.expectPOST(urlUtil.API + 'settings/');
  }

  function getGeneral() {
    return {
      'id': 1,
      'update_time_push': 300000,
      'update_time_participant_number': 10
    };
  }

})();
