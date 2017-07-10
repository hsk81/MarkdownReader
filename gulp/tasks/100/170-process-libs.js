let pkg = require('../../package.js'),
    path = require('path');
let gulp = require('gulp'),
    gulp_copy = require('gulp-copy');

gulp.task('process-libs', function () {
    return gulp.src([
        'src/lib/**/*'
    ]).pipe(
        gulp_copy(path.join('build', pkg.name), {
            prefix: 1
        })
    );
});
