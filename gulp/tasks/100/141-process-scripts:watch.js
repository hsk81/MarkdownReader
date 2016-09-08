var pkg = require('../../package.js'),
    path = require('path');
var gulp = require('gulp'),
    gulp_util = require('gulp-util'),
    gulp_uglify = require('gulp-uglify'),
    gulp_sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify');

var watched = watchify(browserify({
    basedir: '.', entries: ['src/app/app.ts'],
    cache: {}, packageCache: {}, debug: true
}).plugin(require('tsify')));

var on_watch = function () {
    return watched.bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulp_sourcemaps.init({loadMaps: true}))
        .pipe(gulp_uglify())
        .pipe(gulp_sourcemaps.write('./'))
        .pipe(gulp.dest(path.join('build', pkg.name)));
};

watched.on('update', on_watch);
watched.on('log', gulp_util.log);
gulp.task('process-scripts:watch', on_watch);
