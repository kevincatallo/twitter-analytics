/*jslint node: true nomen: true es5: true */
'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('start', ['browserify'], function () {
    nodemon({
        script: 'tiw-project.js',
        ignore: ['public/'],
        env: {'NODE_ENV': 'production'}
    });
});

gulp.task('start-dev', ['watchify'], function () {
    nodemon({
        script: 'tiw-project.js',
        ignore: ['public/']
    });
});