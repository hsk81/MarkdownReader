var gulp = require('gulp'),
    require_all = require('require-all');

require_all({
    dirname: __dirname + '/gulp/tasks',
    filter:  /.js$/, recursive: true
});

gulp.task('default', ['build']);
