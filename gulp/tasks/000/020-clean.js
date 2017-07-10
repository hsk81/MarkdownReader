let gulp = require('gulp'),
    rimraf = require('rimraf');

gulp.task('clean:build', function () {
    rimraf.sync('build')
});
gulp.task('clean', ['clean:build']);
