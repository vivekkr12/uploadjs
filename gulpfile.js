/*global alert,console*/
/*jslint continue:true, node:true, vars:true*/

'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');

gulp.task('default', function () {
  gulp.src(['extensions.js', 'iterator.js', 'upload.js'])
    .pipe(concat('upload.min.js'))
    .pipe(uglify())
    .pipe(insert.prepend('/*The MIT License (MIT) Copyright (c) 2016 Vivek Kumar https://github.com/vivekkr12/uploadjs/blob/master/LICENSE.md */\n'))
    .pipe(gulp.dest('./dist/'));
  
  console.log("Task Complete. Check 'dist' folder. Include the 'upload.min.js' file in webpage");
  
});
