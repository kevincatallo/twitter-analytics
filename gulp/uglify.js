/*jslint node: true nomen: true es5: true */
'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('uglify', ['browserify'], function () {
    return gulp
        .src('./public/build/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/build/js'));
});