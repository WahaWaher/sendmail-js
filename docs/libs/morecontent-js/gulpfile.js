'use strict';

var plugin = {
	version: '1.0.0',
	name: [
		'morecontent',
		'morecontent-js',
		'MoreContent',
		'moreContent',
		'mrcnt'
	]
};

const gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
		scss = require('gulp-sass'),
		notify = require("gulp-notify"),
		autoprefixer = require('gulp-autoprefixer'),
		rename = require("gulp-rename"),
		del = require('del'),
		uglify = require("gulp-uglify"),
		cssnano = require('gulp-cssnano'),
		headerComment = require('gulp-header-comment'),
		runSequence = require('run-sequence'),
		fs = require('fs'),
		headerInfo = `
	    	jQuery.` + plugin.name[3] + `
		   Version: ` + plugin.version + `
		   Repo: https://github.com/WahaWaher/` + plugin.name[1] + `
		   Author: Sergey Kravchenko
		   Contacts: wahawaher@gmail.com
		   License: MIT`,
		headerInfoLite = `
	    	jQuery.` + plugin.name[3] + ` Lite` + `
		   Version: ` + plugin.version + `
		   Repo: https://github.com/WahaWaher/` + plugin.name[1] + `
		   Author: Sergey Kravchenko
		   Contacts: wahawaher@gmail.com
		   License: MIT`;

/* BrowserSync: */
gulp.task('browser-sync', function() {
	browserSync.init({
		proxy: plugin.name[0] + '.js',
		notify: false,
		open: false,
		browser: 'chrome' // ["opera", "firefox", "chrome"]
	});
});

/* SCSS: */
gulp.task('scss', function() {
	return gulp.src('demo/scss/**/*.scss')
	.pipe(scss({
		outputStyle: "expanded",
		indentType: "tab", 
		indentWidth: 1
	}).on("error", notify.onError({
		title: "SCSS - Ошибка при компиляции:\n\r\n\r",
		message: "<%= error.message %>"
	})))
	.pipe(autoprefixer({
		browsers: ['last 15 versions', '> 0.5%', 'ie 9-11'], // Док.: github.com/ai/browserslist#queries
	}))
	.pipe(gulp.dest('demo/css'))
	.pipe(browserSync.stream())
});

gulp.task('deldist', function() {
	del('dist');
});

gulp.task('default', ['browser-sync', 'scss'], function() {
	gulp.watch('demo/scss/**/*.scss', ['scss']);
	gulp.watch('demo/js/**/*.js').on('change', browserSync.reload);
	gulp.watch('demo/**/*.+(html|php)').on('change', browserSync.reload);
});

/* BUILD */
gulp.task('build', ['deldist', 'scss'], function() {
	
	// js exp
	gulp.src([
		'demo/js/jquery.' + plugin.name[0] + '.js'
		])
	.pipe(headerComment(headerInfo))
	.pipe(gulp.dest('dist'));

	// js exp min
	gulp.src('demo/js/jquery.' + plugin.name[0] + '.js')
	.pipe(uglify().on('error', function(e){
            console.log(e);
         }))
	.pipe(rename({ suffix: '.min' }))
	.pipe(headerComment(headerInfo))
	.pipe(gulp.dest('dist'));


	// js lite
	gulp.src([
		'demo/js/jquery.' + plugin.name[0] + '.lite.js'
		])
	.pipe(headerComment(headerInfoLite))
	.pipe(gulp.dest('dist'));

	// js lite min
	gulp.src('demo/js/jquery.' + plugin.name[0] + '.lite.js')
	.pipe(uglify().on('error', function(e){
            console.log(e);
         }))
	.pipe(rename({ suffix: '.min' }))
	.pipe(headerComment(headerInfoLite))
	.pipe(gulp.dest('dist'));

	// css
	// gulp.src(['demo/css/jquery.' + plugin.name[0] + '.css'])
	// .pipe(headerComment(headerInfo))
	// .pipe(gulp.dest('dist/'));

	// gulp.src(['demo/css/jquery.' + plugin.name[0] + '.css'])
	// .pipe(cssnano())
 //   .pipe(rename({ suffix: '.min' }))
 //   .pipe(headerComment(headerInfo))
	// .pipe(gulp.dest('dist/'));

	// gulp.src(['demo/folder/**/*']).pipe(gulp.dest('dist/folder'));

});

/* Rename */
gulp.task('rename', function() {
	runSequence('change-contents', 'change-file-names');
});

gulp.task('change-contents', function() {

	fs.readFile('names.json', 'utf-8', function (err, data) {
		if (err) return console.log(err);

		var json = JSON.parse(data),
			 files = [
				 'gulpfile.js',
				 'bower.json',
				 'package.json',
				 'README.md',
				 'help.txt',
				 'demo/index.html',
				 'demo/js/jquery.morecontent.js',
				 'demo/js/demo.js',
				 'demo/scss/jquery.morecontent.scss',
				 'demo/css/jquery.morecontent.css'
			 ];

		console.log( 'names.json : ' , json );

		for (var i = 0; i < files.length; i++) {

			var filePath = files[i],
				 fileContent = '';
			
			fileContent = fs.readFileSync(filePath, 'utf-8');

			fileContent = fileContent.allReplace({
				'morecontent': json.names[0],
				'morecontent-js': json.names[1],
				'MoreContent': json.names[2],
				'moreContent': json.names[3],
				'mrcnt': json.names[4]
			});

			fs.writeFileSync(filePath, fileContent);
			console.log( 'Содержимое файла по пути "' + filePath + '" изменено.' );

		};

		
	});

});

gulp.task('change-file-names', function() {
	
	fs.readFile('names.json', 'utf-8', function (err, data) {
		if (err) return console.log(err);

		var json = JSON.parse(data);

		console.log( 'names.json : ' , json );

		fs.rename('demo/js/jquery.morecontent.js', 'demo/js/jquery.'+json.names[0]+'.js', function(err) {
			if ( err ) console.log(err);
		});

		fs.rename('demo/css/jquery.morecontent.css', 'demo/css/jquery.'+json.names[0]+'.css', function(err) {
			if ( err ) console.log(err);
		});

		fs.rename('demo/scss/jquery.morecontent.scss', 'demo/scss/jquery.'+json.names[0]+'.scss', function(err) {
			if ( err ) console.log(err);
		});

	});

});

String.prototype.allReplace = function(obj) {
	var retStr = this;
	for (var x in obj) {
		retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
	}
	return retStr;
};

del.sync('package-lock.json');