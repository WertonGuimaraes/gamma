'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var paths = {
  scripts: [path.join(conf.paths.src, '/app/*.js')],
  images: 'client/img/**/*'
}

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
  //return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});
