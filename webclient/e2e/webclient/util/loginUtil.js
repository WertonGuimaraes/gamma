/**
 * Created by Filipe on 29/10/2015.
 */

'use strict';

var LoginUtil = function() {

  return {
    setLogin : function(userName, password){
      element(by.id('loginInput')).sendKeys(userName);
      element(by.id('passwordInput')).sendKeys(password);
      element(by.id('loginBtn')).click();
    },
    logout : function() {
      browser.executeScript("return window.localStorage.removeItem('jwtToken');");
    }
  }
};

module.exports = new LoginUtil();
