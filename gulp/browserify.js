/*jslint node: true nomen: true es5: true */
'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    gutil = require('gulp-util'),
    es = require('event-stream');

function browserifyTask(isDev) {
        
    var entryPoints = ['followers.js', 'selected-followers.js', 'graph.js'];    
    
    var tasks = entryPoints.map(function (entryPoint) {
        var b =  browserify(entryPoint, {basedir: './public/src/js'});
        
        // bundle function
        var bundle = function () {
            gutil.log('Bundling', gutil.colors.green(entryPoint) + '...');
            return b
                .bundle()
                .pipe(source(entryPoint))
                .pipe(gulp.dest('./public/build/js'))
        };
        
        // enable watchify
        if (isDev) {
            b = watchify(b);
            b.on('update', bundle);
            gutil.log('Watching', gutil.colors.yellow(entryPoint));
        }
        
        return bundle();
    });
    
    return es.merge.apply(null, tasks); // returning a stream makes the task function async
};

gulp.task('browserify', browserifyTask);

module.exports = browserifyTask;