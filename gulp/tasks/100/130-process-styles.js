var pkg = require('../../package.js'),
    path = require('path');

var gulp = require('gulp'),
    gulp_copy = require('gulp-copy'),
    gulp_sass = require('gulp-sass'),
    gulp_sourcemaps = require('gulp-sourcemaps');

gulp.task('process-styles:copy', function () {
    return gulp.src(['src/style/**/*', '!src/style/**/*.scss'])
        .pipe(gulp_copy(path.join('build', pkg.name, 'style'), {
            prefix: 2
        }));
});
gulp.task('process-styles', ['process-styles:copy'], function () {
    return gulp.src('src/style/**/*.scss')
        .pipe(gulp_sourcemaps.init())
        .pipe(gulp_sass({outputStyle: 'compressed'})
            .on('error', gulp_sass.logError))
        .pipe(gulp_sourcemaps.write('./'))
        .pipe(gulp.dest(path.join('build', pkg.name, 'style')));
});
