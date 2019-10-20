/*jshint -W106 */
describe('CampaignListController', function () {

  var controller, urlUtil, $rootScope, $httpBackend, service, generalService;
  var page = 1;

  beforeEach(function () {
    module('gmm', function ($provide) {
      $provide.value('campaignPrepService', function () {
        campaignUtil.mockGetCampaigns($httpBackend, urlUtil, page, '', 'status');
        var result;
        service.list('', '', '', '', false, 'status', 1).then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;
      });

      $provide.value('generalPrepService', function () {
        campaignUtil.mockGetGeneral($httpBackend, urlUtil);
        var result;
        generalService.get().then(function (data) {
          result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        return result;
      });
    });
  });

  beforeEach(inject(function (_$state_, _$rootScope_, _$controller_, _$httpBackend_, _urlUtil_, campaignPrepService,
                              campaignService, generalPrepService, _generalService_) {
    urlUtil = _urlUtil_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    service = campaignService;
    generalService = _generalService_;
    mockI18n.mockI18nEnglish($httpBackend);
    var homeCtrl = _$controller_('HomeController');
    var $scope = $rootScope.$new();
    $scope.$parent.homeCtrl = homeCtrl;
    controller = _$controller_('CampaignControllerList', {
      $scope: $scope,
      campaignPrepService: campaignPrepService(),
      generalPrepService: generalPrepService()
    });
  }));

  afterEach(function () {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
   });

  describe('should be created successfully', function () {

    it('should be divided controller', function () {
      expect(controller).toBeDefined();
    });

    it('should be divided infinityList', function () {
      expect(controller.infinityList).toBeDefined();
      expect(controller.infinityList).toEqual(1);
    });

    it('should be divided list', function () {
      expect(controller.list).toBeDefined();
      expect(controller.list.length).toEqual(3);
    });
  });

  describe('getCsvExport', function () {
    var expectHeader = ['ID', 'NAME', 'BEGIN DATE', 'END DATE', 'TIMEZONE', 'PARTICIPANT LIMIT', 'TOTAL REGISTERED',
      'COUNTRIES', 'GAMES', 'ACTIVE', 'STATUS'];
    it('should call getCsvExport', function () {
      campaignUtil.mockGetCampaigns($httpBackend, urlUtil, 'all', '', 'status');
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.campaignHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
    it('should call getCsvExport same null object', function () {
      campaignUtil.mockGetCampaignsWithNullElement($httpBackend, urlUtil, 'all', '');
      controller.export.getCsvExport();
      $httpBackend.flush();
      expect(controller.export.campaignHeader()).toEqual(expectHeader);
      expect(controller.export.fileName).not.toBe('');
    });
  });

  describe('nextList', function () {
    beforeEach(function () {
      page = 2;
    });

    it('should call the server, refresh the list and infinityList update', function () {
      campaignUtil.mockGetCampaigns($httpBackend, urlUtil, page, '', 'status');
      controller.nextList();
      $httpBackend.flush();
      expect(controller.infinityList).toEqual(2);
      expect(controller.list.length).toEqual(6);
    });
  });

});
