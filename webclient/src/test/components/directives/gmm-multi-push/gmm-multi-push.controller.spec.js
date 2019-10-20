describe('MultiPushController', function () {

  beforeEach(module('gmm'));

  var $mdDialog, $rootScope, controller, scope;

  beforeEach(inject(function (_$controller_, _$rootScope_, _$mdDialog_) {
    $mdDialog = _$mdDialog_;
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();
    scope.onAdd = jasmine.createSpy('onAdd');
    scope.onRemove = jasmine.createSpy('onRemove');
    scope.game = mockDataGame.mockGetValidGame();
    controller = _$controller_('MultiPushController', {'$scope': scope});
  }));

  it('should be created successfully', function () {
    expect(controller).toBeDefined();
  });

  describe('showPushConfigDialog', function () {

    describe('Controller showPushConfigDialog', function () {

      var dialogCtrl, pushConfig;

      beforeEach(function () {
        pushConfig = {
          selected: null,
          name: 'push campaign',
          max: 1,
          templates: null,
          dropzones: {
            root: [{
              type: 'container',
              id: 'open',
              columns: [[{type: 'item', id: 'game', name: 'value'}]],
              name: 'action',
              allowedTypes: ['item']
            }, {
              type: 'container', id: 'title', columns: [[]], name: 'action', allowedTypes: ['item']
            }, {
              type: 'container', id: 'message', columns: [[]], name: 'action', allowedTypes: ['item']
            }]
          }
        };
        scope.game.formJsonPush = {root: {open: 'game', title: '1', message: '2'}};
        dialogCtrl = controller.showPushConfigDialog({}, scope.game);
        dialogCtrl = dialogCtrl.dialogController($rootScope.$new(), $mdDialog);
      });

      it('should call cancel function by dialogCtrl', function () {
        spyOn(dialogCtrl, 'cancel').and.callThrough();
        dialogCtrl.cancel();
        expect(dialogCtrl.cancel).toHaveBeenCalled();
      });

      it('should call addPushTemplate function by dialogCtrl', function () {
        spyOn(dialogCtrl, 'addPushTemplate').and.callThrough();
        dialogCtrl.addPushTemplate(pushConfig);
        expect(scope.onAdd).toHaveBeenCalled();
        expect(dialogCtrl.addPushTemplate).toHaveBeenCalledWith(pushConfig);
      });

      it('should call addPushTemplate function by dialogCtrl without formJsonPush', function () {
        spyOn(dialogCtrl, 'addPushTemplate').and.callThrough();
        scope.game.formJsonPush = {root: []};
        dialogCtrl.addPushTemplate(pushConfig);
        expect(dialogCtrl.addPushTemplate).toHaveBeenCalledWith(pushConfig);
      });

      describe('disableTemplate', function () {
        it('should call disableTemplate function', function () {
          expect(dialogCtrl.disablePushTemplate(scope.game)).toBeFalsy();
        });
      });

      describe('removeGamePushConfig', function () {
        it('should call removeGamePushConfig function', function () {
          spyOn(controller, 'removeGamePushConfig').and.callThrough();
          controller.removeGamePushConfig(scope.game, scope.game.formPushValues[0]);
          expect(controller.removeGamePushConfig).toHaveBeenCalled();
          expect(scope.onRemove).toHaveBeenCalled();
        });
      });

    });

    describe('Create controller with pushTemplate and formPushValues', function (){
      beforeEach(inject(function (_$controller_, formConfigService) {
        scope = $rootScope.$new();
        scope.game = mockDataGame.mockGetValidGame();
        scope.game.formPushValues = formConfigService.formTemplateFromJson(scope.game);
        scope.game.pushTemplatesAux = [];
        controller = _$controller_('MultiPushController', {'$scope': scope});
      }));
    });

  });

});

