"use strict";

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var plumber = require('gulp-plumber');
var del = require('del');

gulp.task('del', function(cb) {
  return del(['./bin/**/*'], cb);
});

gulp.task('to5', function() {
  gulp.src(['!./src/frameworks/**/app/**/*', './src/**/*.js'])
    .pipe(to5())
    .pipe(plumber())
    .pipe(gulp.dest('./bin/'));

  gulp.src(['./src/frameworks/**/app/**/*'])
    .pipe(gulp.dest('./bin/frameworks/'));

  gulp.src(['./src/**/*.hbs'])
    .pipe(gulp.dest('./bin/'));

  gulp.src(['./src/**/.*'])
    .pipe(gulp.dest('./bin/'));
});

gulp.task('default', ['to5']);

gulp.task('watch', function() {
  gulp.watch(['./src/**/*'], ['default']);
});
