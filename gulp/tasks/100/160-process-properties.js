let pkg = require('../../package.js'),
    fs = require('fs'),
    path = require('path');
let gulp = require('gulp'),
    gulp_plist = require('gulp-plist'),
    gulp_rename = require('gulp-rename');
let lodash = require('lodash'),
    pump = require('pump');

gulp.task('process-properties', function (done) {
    let settings = lodash.mapKeys(pkg.dizmo.settings, function (v, k) {
        return lodash.upperFirst(lodash.camelCase(k));
    });

    fs.stat('.info.plist', (err) => {
        if (err === null) {
            pump([
                gulp.src('.info.plist'),
                gulp_plist(settings),
                gulp_rename('Info.plist'),
                gulp.dest(path.join('build', pkg.name))
            ], done);
        } else {
            this.emit('error', err);
        }
    });
});
