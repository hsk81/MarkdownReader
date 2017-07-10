let pkg = require('../../package.js'),
    path = require('path');
let gulp = require('gulp'),
    gulp_copy = require('gulp-copy');

gulp.task('process-assets:base', function () {
    return gulp.src([
        'assets/Icon.*', 'assets/Icon-dark.*', 'assets/Preview.*'
    ]).pipe(
        gulp_copy(path.join('build', pkg.name), {
            prefix: 1
        })
    );
});
gulp.task('process-assets', ['process-assets:base'], function () {
    return gulp.src([
        'assets/**/*'
    ]).pipe(
        gulp_copy(path.join('build', pkg.name, 'assets'), {
            prefix: 1
        })
    );
});
