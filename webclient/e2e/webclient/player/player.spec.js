/**
 * Created by Filipe on 29/10/2015.
 */
'use strict';

describe('Players Tests', function() {

  var page = require('./player.po'),
  loginUtil = require('../util/loginUtil'),
  menuUtil = require('../util/menusUtil'),
  dbUtil = require('../util/dbUtil');


  beforeEach(function(){
    browser.get('/#/')
  });

  //it('List Players', function(){
  //
  //  dbUtil.removePlayers();
  //  dbUtil.setPlayer();
  //
  //  loginUtil.setLogin('admin','abc123');
  //  menuUtil.setMenuPlayers();
  //
  //  expect(page.getTitleList().title_list.getText()).toBe('Players');
  //
  //  expect(page.getTitleList().title_email.getText()).toBe('Email');
  //
  //  expect(page.getTitleList().title_gpgId.getText()).toBe('GPG ID');
  //
  //  expect(page.getTitleList().title_gmcId.getText()).toBe('GCM ID');
  //
  //  //expect(page.getInfoPlayer().email.getText()).toBeDefined();
  //  //
  //  //expect(page.getInfoPlayer().gpgId.getText()).toBeDefined();
  //  //
  //  //expect(page.getInfoPlayer().gcmId.getText()).toBeDefined();
  //
  //});

});
