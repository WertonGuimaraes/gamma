/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var LoginPage = function() {

  var title_login = element(by.xpath('//h1[text()="Sign In"]'))
  var field_username = element(by.id('loginInput'));
  var field_password = element(by.id('passwordInput'));
  var btn_login = element(by.id('loginBtn'));
  var dialog = element(by.tagName('md-dialog'));
  var title_dialog = dialog.element(by.tagName('h2'));
  var btn_logout = element(by.id('btn_logout'));
  var img_logo = element(by.xpath('//img[@title="Go to Homepage"]'))


	return {
		setLogin : function(userName){
      field_username.sendKeys(userName);
		},

		setPassword : function(password){
      field_password.sendKeys(password);
		},

		clickLogin : function(){
      btn_login.click();
		},

		verifyButtonLogin : function(){
			return btn_login;
		},

		verifyDialog : function(){
				return dialog;
		},

    titleDialog : function(){
      return title_dialog.getText();
    },

    clickLogout : function() {
      btn_logout.click();
    },

    verifyTitleLogin : function() {
      return title_login.getText();
    },

    verifyLogoHomePage : function() {
      return img_logo;
    }

	}
};

module.exports = new LoginPage();



