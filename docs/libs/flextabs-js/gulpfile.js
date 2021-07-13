'use strict';

const ver = '2.0.0',

		gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
		scss = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		rename = require("gulp-rename"),
		del = require('del'),
		uglify = require("gulp-uglify"),
		cssnano = require('gulp-cssnano'),
		headerComment = require('gulp-header-comment'),
		headerInfo = `
	    	jQuery FlexTabs
		   Version: ${ver}
		   Repo: https://github.com/WahaWaher/flextabs-js
		   Author: Sergey Kravchenko
		   Contacts: wahawaher@gmail.com
		   License: MIT
	  `,
	  headerInfoTheme = `
	    	jQuery FlexTabs Theme Default
		   Version: ${ver}
		   Repo: https://github.com/WahaWaher/flextabs-js
		   Author: Sergey Kravchenko
		   Contacts: wahawaher@gmail.com
		   License: MIT
	  `,
	  headerInfoThemeTemplate = `
	    	jQuery FlexTabs Theme Template
		   Version: ${ver}
		   Repo: https://github.com/WahaWaher/flextabs-js
		   Author: Sergey Kravchenko
		   Contacts: wahawaher@gmail.com
		   License: MIT
	  `;

// BrowserSync
gulp.task('browser-sync', function() {
	browserSync.init({
  	proxy: 'flextabs.js',
  	notify: false,
  	browser: 'chrome'
  });
});

gulp.task('scss', function() {
    return gulp.src('demo/scss/**/*.scss')
    .pipe(scss({
    	outputStyle: "expanded",
			indentType: "tab", 
			indentWidth: 1
    })).pipe(autoprefixer({
            browsers: ['last 2 versions'/*, '> 0.5%'*/], // github.com/ai/browserslist#queries
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

	// js
	gulp.src([
		'demo/js/jquery.flextabs.js'
		])
	.pipe(headerComment(headerInfo))
	.pipe(gulp.dest('dist'));

	// js min
	gulp.src('demo/js/jquery.flextabs.js')
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(headerComment(headerInfo))
	.pipe(gulp.dest('dist'));

	// css common
	gulp.src([
		'demo/css/jquery.flextabs.css',
		])
	.pipe(headerComment(headerInfo))
	.pipe(gulp.dest('dist'));

	// css common min
	gulp.src('demo/css/jquery.flextabs.css')
	.pipe(cssnano({ discardComments: { removeAll: true } }))
   .pipe(rename({ suffix: '.min' }))
   .pipe(headerComment(headerInfo))
	.pipe(gulp.dest('dist'));


	// css theme default
	gulp.src([
		'demo/css/jquery.flextabs.theme-default.css',
		])
	.pipe(headerComment(headerInfoTheme))
	.pipe(gulp.dest('dist'));

	// css theme default min
	gulp.src('demo/css/jquery.flextabs.theme-default.css')
	.pipe(cssnano({ discardComments: { removeAll: true } }))
   .pipe(rename({ suffix: '.min' }))
   .pipe(headerComment(headerInfoTheme))
	.pipe(gulp.dest('dist'));

	// css theme default
	// gulp.src([
	// 	'demo/scss/jquery.flextabs.theme-template.scss',
	// 	])
	// .pipe(headerComment(headerInfoThemeTemplate))
	// .pipe(gulp.dest('dist'));

});


gulp.task('deldist', function() {
  return del.sync('dist');
});