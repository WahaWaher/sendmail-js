'use strict';

const gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
		scss = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		rename = require("gulp-rename"),
		del = require('del'),
		uglify = require("gulp-uglify"),
		cssnano = require('gulp-cssnano'),
		headerComment = require('gulp-header-comment'),
		headerInfo = `
	    	jQuery.sendMail
		   Version: 2.0.3
		   Repo: https://github.com/WahaWaher/sendmail-js
		   Author: Sergey Kravchenko
		   Contacts: wahawaher@gmail.com
		   License: MIT
	  `;


// BrowserSync
gulp.task('browser-sync', function() {
	browserSync.init({
  	proxy: 'sendmail.js',
  	notify: false,
  	browser: 'chrome'
  });
});

// Препроцессор SCSS + автопрефиксер 
gulp.task('scss', function() {
    return gulp.src('demo/scss/**/*.scss')
    .pipe(scss({
    	outputStyle: "expanded",
			indentType: "tab", 
			indentWidth: 1
    })).pipe(autoprefixer({
            browsers: ['last 30 versions', '> 0.5%', 'ie 9-11'], // github.com/ai/browserslist#queries
        }))
    .pipe(gulp.dest('demo/css'))
    .pipe(browserSync.stream())
});

gulp.task('default', ['browser-sync', 'scss'], function() {
  gulp.watch('demo/scss/**/*.scss', ['scss']);
	gulp.watch('demo/**/*.js').on('change', browserSync.reload);
	gulp.watch('demo/**/*.+(html|php)').on('change', browserSync.reload);
});

gulp.task('build', ['deldist', 'scss'], function() {

	gulp.src([
		'demo/js/jquery.sendmail.js'
		])
	.pipe(headerComment(headerInfo))
	.pipe(gulp.dest('dist'));

	gulp.src('demo/js/jquery.sendmail.js')
	.pipe(uglify())
	.pipe(headerComment(headerInfo))
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('dist'));

	gulp.src(['demo/mail/sendmail.php']).pipe(gulp.dest('dist/mail'));
	gulp.src(['demo/mail/error.html']).pipe(gulp.dest('dist/mail'));
	gulp.src(['demo/mail/success.html']).pipe(gulp.dest('dist/mail'));
	gulp.src(['demo/mail/phpmailer/**/*']).pipe(gulp.dest('dist/mail/phpmailer'));

});


gulp.task('deldist', function() {
  return del.sync('dist');
});