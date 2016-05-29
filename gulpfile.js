'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

let files = ['./**/*.js', '!node_modules/'];

gulp.task('lint', () => {
  return gulp.src(files)
    .pipe($.eslint())
    .pipe($.eslint.format());
});

gulp.task('test', () => {
  return gulp.src('./test/**.js')
    .pipe($.mocha())
    .once('error', () => {
      process.exit(1);
    }).once('end', function() {
      process.exit(0);
    });
});

gulp.task('watch', () => {
  gulp.watch(files, ['lint']);
});

gulp.task('default', ['watch']);
