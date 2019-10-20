'use strict';

describe('Login tests', function () {
  var page = require('./login.po'),
      loginUtil = require('../util/loginUtil'),
      dbUtil = require('../util/dbUtil');

  beforeEach(function () {
    browser.executeScript("return window.localStorage.removeItem('jwtToken');");
    browser.get('/#/');
    loginUtil.logout();
  });

  afterEach(function() {
    browser.executeScript("return window.localStorage.removeItem('jwtToken');")
  })

  it('should have app title', function() {
    expect(browser.getTitle()).toEqual('GaMMa');
  });

  it('gmm-1:Login of the System', function () {

    page.setLogin('admin');

    page.setPassword('abc123');

    page.clickLogin();

    var token = browser.executeScript("return window.localStorage.getItem('jwtToken');");

    expect(token.isNull).not.toBeTruthy();

    expect(page.verifyLogoHomePage().isDisplayed()).toBeTruthy();

  });

  it('gmm-2:Logout of the system', function() {

    loginUtil.setLogin('admin', 'abc123');

    var token = browser.executeScript("return window.localStorage.getItem('jwtToken');");

    expect(token.isNull).not.toBeTruthy();

    browser.sleep(2000);

    page.clickLogout();

    browser.sleep(1000);

    expect(page.verifyTitleLogin()).toBe('Sign In');

  });

  it('gmm-320:Login with username that not exist', function() {

    page.setLogin('invalidUser');

    page.setPassword('abc123');

    page.clickLogin();

    expect(page.verifyDialog().isPresent()).toBe(true);

    expect(page.titleDialog()).toBe('Login failed');

  });



  it('gmm-321:Login with password invalid', function () {

    page.setLogin('admin');

    page.setPassword('invalidPass');

    page.clickLogin();

    expect(page.verifyDialog().isPresent()).toBe(true);

    expect(page.titleDialog()).toBe('Login failed');

  });

  it('gmm-326:Login with username and password invalid', function () {
    page.setLogin('invalidUser');

   page.setPassword('invalidPass');

   page.clickLogin();

   expect(page.verifyDialog().isPresent()).toBe(true);

   expect(page.titleDialog()).toBe('Login failed');

  });


  it('gmm-318:Login with only username empty',function(){

    page.setLogin('');

    page.setPassword('abc123');

    expect(page.verifyButtonLogin().isEnabled()).toBe(false);

  });


  it('gmm-319:Login with only password empty', function(){

    page.setLogin('admin');

    page.setPassword('');

    expect(page.verifyButtonLogin().isEnabled()).toBe(false);

  });

  it('gmm-317:Login with username and password empty', function(){

    page.setLogin('');

    page.setPassword('');

    expect(page.verifyButtonLogin().isEnabled()).toBe(false);

  });



});


