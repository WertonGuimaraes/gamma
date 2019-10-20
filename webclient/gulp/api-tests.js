var gulp = require('gulp');
var mocha = require('gulp-mocha');
 
gulp.task('chakram', function () {
    return gulp.src('e2e/api/**/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha({
          //reporter: 'spec'
          reporter: 'xunit',
          reporterOptions: {
            output: 'reports/e2e-api-testresults.xml'
          }
        }));
});