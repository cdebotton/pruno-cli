"use strict";

var gulp = require('gulp');
var to5 = require('gulp-6to5');

gulp.task('default', function() {
  gulp.src('./src/**/*.js')
    .pipe(to5())
    .pipe(gulp.dest('./bin/'));

  gulp.src(['!./src/**/*.js', './src/**/*', './src/**/.*'])
    .pipe(gulp.dest('./bin/'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/**/*'], ['default']);
});
