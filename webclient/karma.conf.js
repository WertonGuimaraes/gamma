'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  return wiredep(wiredepOptions).js
    .concat([
      path.join(conf.paths.src, '/app/**/*.module.js'),
      path.join(conf.paths.src, '/app/**/*.js'),
      path.join(conf.paths.src, '/**/*.spec.js'),
      path.join(conf.paths.src, '/**/*.mock.js'),
      path.join(conf.paths.src, '/**/*.html')
    ]);
}

module.exports = function (config) {

  var configuration = {
    files: listFiles(),

    singleRun: true,

    autoWatch: false,

    frameworks: ['jasmine', 'angular-filesort', 'sinon'],

    reporters: ['progress', 'junit', 'coverage'],

    junitReporter: {
      outputDir: 'reports', // results will be saved as $outputDir/$browserName.xml
      outputFile: 'unit-testresults.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: 'br.com.asus.gmm.test.unit.webclient', // suite will become the package name attribute in xml testsuite element
      useBrowserName: false // add browser name to report and classes names
    },

    angularFilesort: {
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'gmm'
    },

    //browsers : ['PhantomJS'],
    browsers: ['Chrome'],

    plugins: [
      'karma-junit-reporter',
      'karma-coverage',
      'karma-chrome-launcher',
      //'karma-phantomjs-launcher',
      'karma-angular-filesort',
      'karma-jasmine',
      'karma-sinon',
      'karma-ng-html2js-preprocessor',
    ],

    preprocessors: {
      'src/**/*.html': ['ng-html2js'],
      'src/app/**/*.js': ['coverage']
    },

    coverageReporter: {
      dir: 'reports/',
      reporters: [
        //{type: 'html', subdir: 'coverage'},
        {type: 'cobertura', subdir: '.', file: 'unit-testcoverage.xml'}
      ]
    }
  };

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if (configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
