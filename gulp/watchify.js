/*jslint node: true nomen: true es5: true */
'use strict';

var gulp = require('gulp'),
    browserifyTask = require('./browserify.js');

gulp.task('watchify', browserifyTask.bind(null, true));