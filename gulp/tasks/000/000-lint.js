let pkg = require('../../package.js'),
    extend = require('xtend'),
    pump = require('pump');
let gulp = require('gulp'),
    gulp_tslint = require("gulp-tslint");

gulp.task('lint:ts', function (done) {
    let lint = true;
    if (pkg.dizmo && pkg.dizmo.build) {
        let cfg_lint = pkg.dizmo.build.lint;
        if (cfg_lint || cfg_lint === undefined) {
            lint = extend({}, cfg_lint);
        } else {
            lint = false;
        }
    }

    let argv = require('yargs')
        .default('lint', lint).argv;
    if (typeof argv.lint === 'string') {
        argv.lint = JSON.parse(argv.lint);
    }

    let stream = [gulp.src([
        './src/**/*.ts', '!src/lib/**', '!build/**', '!node_modules/**'
    ])];
    if (argv.lint || argv.lint === undefined) {
        stream.push(gulp_tslint.apply(this, [extend({
            formatter: 'stylish'
        }, argv.lint)]));
        stream.push(gulp_tslint.report({
            emitError: false
        }));
    }
    pump(stream, done);
});

gulp.task('lint', ['lint:ts']);
