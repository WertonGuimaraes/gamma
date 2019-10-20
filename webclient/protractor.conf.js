'use strict';

var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;
var HtmlReporter = require('protractor-html-screenshot-reporter');

// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  //seleniumServerJar: deprecated, this should be set on node_modules/protractor/config.json

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:4000',

  //=====================================
  //
  //       !!! ATENTION!!!
  //
  // THIS  CONFIGURATION IS BEEN SUBCRIBED
  //        ON gulp/e2e-tests.js
  //
  specs: [paths.e2eWebclient + '/**/*.js'],
  //
  //=======================================

  framework: 'jasmine2',

  onPrepare: function() {

      browser.driver.manage().window().maximize();


      var jasmineReporters = require('jasmine-reporters');

      // jasmine.getEnv().addReporter(new HtmlReporter({
      //    baseDirectory: paths.e2e + '/reports'
      // }));

      jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'reports',
        filePrefix: 'e2e-webclient-testresults',
        modifySuiteName: function(generatedSuiteName, suite){
          return 'br.com.asus.gmm.test.e2e.webclient.' + generatedSuiteName
        }
      }));

  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
