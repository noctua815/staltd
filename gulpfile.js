'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	rimraf = require('rimraf'),
	browserSync = require('browser-sync'),
	postcss = require('gulp-postcss'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	imageminOptipng = require('imagemin-optipng'),
	cssnano = require('cssnano'),
	postshort = require('postcss-short'),
	precss = require('precss'),
	assets = require('postcss-assets'),
	autoprefixer = require('autoprefixer'),
	sass = require('gulp-sass'),
	clearfix = require('postcss-clearfix'),
	cache = require('gulp-cache'),
	rename = require('gulp-rename'),
	svgmin = require('gulp-svgmin'),
	svgstore = require('gulp-svgstore'),
	svgfallback = require('gulp-svgfallback'),
	inlinesvg = require('postcss-inline-svg'),
	inject = require('gulp-inject'),
	sourcemaps = require('gulp-sourcemaps'),
	fileinclude = require('gulp-file-include'),
	jscs = require('gulp-jscs'), //Check JavaScript code style with JSCS
	gulpPath = require('path'),
	babel = require('gulp-babel'),
	debug = require('gulp-debug'),
	typograf = require('gulp-typograf'),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		pic: 'build/pic/',
		svg: 'build/svg/',
		media: 'build/media/',
		fullpage: 'build/',
		fonts: 'build/fonts/',
		favicon: 'build/favicons/',
		php: 'build/php/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/main.js',
		jsVendor: 'src/js/vendor.js',
		style: 'src/style/*.*css',
		img: 'src/img/**/*.*',
		pic: 'src/pic/**/*.*',
		svg: 'src/svg/**/*.svg',
		media: 'src/media/**/*.*',
		fullpage: 'src/full-page/*.html',
		fonts: 'src/fonts/*.*',
		favicon: 'src/favicons/**/*.*',
		php: 'src/php/**/*.php'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.*css',
		img: 'src/img/**/*.*',
		pic: 'src/pic/**/*.*',
		svg: 'src/svg/**/*.svg',
		media: 'src/media/**/*.*',
		fullpage: 'src/full-page/*.html',
		fonts: 'src/fonts/*.*',
		favicon: 'src/favicons/**/*.*',
		php: 'src/php/**/*.php'
	},
	clean: './build'
};

var config = {
	server: {
		baseDir: "./build"
	},
	routes: {
		"/bower_components": "/"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function() {
	browserSync(config);
});

gulp.task('clean', function(cb) {
	rimraf(path.clean, cb);
});

gulp.task('clear-cache', function(done) {
	return cache.clearAll(done);
});

gulp.task('css:build', function() {
	var processors = [
		postshort(),
		clearfix(),
		inlinesvg(),
		assets(),
		autoprefixer(),
		cssnano({
			autoprefixer: {
				browsers: ['last 50 versions'],
				add: true
			},
			core: false,
			zindex: false,
			reduceIdents: false,
			reduceTransforms: false
		})
	];
	return gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['src/style/'],
			outputStyle: 'compressed',
			sourceMap: true,
			errLogToConsole: true
		}))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('js:build', function() {
	gulp.src(path.src.js)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		// .pipe(jscs({fix: true}))
		.pipe(jscs.reporter())
		.pipe(jscs.reporter('fail'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(debug({title: 'unicorn:'}))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('js:build-vendor', function() {
	gulp.src(path.src.jsVendor)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('html:build', function() {
	gulp.src(path.src.html)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: 'src/templates'
		}))
		.pipe(typograf({
			locale: ['ru', 'en-US'],
			htmlEntity: { type: 'name' }
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('image:build', function() {
	gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('pic:build', function() {
	gulp.src(path.src.pic)
		.pipe(gulp.dest(path.build.pic))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('fonts:build', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('php:build', function () {
    gulp.src(path.src.php)
        .pipe(gulp.dest(path.build.php))
        .pipe(reload({stream: true}));
});

gulp.task('svgstore:build', function() {
	return gulp
		.src(path.src.svg)
		.pipe(svgmin(function(file) {
			var prefix = gulpPath.basename(file.relative, gulpPath.extname(file.relative));
			return {
				plugins: [{
					cleanupIDs: {
						prefix: prefix + '-',
						minify: true
					}
				}]
			}
		}))
		.pipe(svgstore())
		.pipe(gulp.dest('src/templates'));
});

gulp.task('media:build', function() {
	gulp.src(path.src.media)
		.pipe(gulp.dest(path.build.media))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('fullpage:build', function() {
	gulp.src(path.src.fullpage)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: 'src/templates'
		}))
		.pipe(typograf({
			locale: ['ru', 'en-US'],
			htmlEntity: { type: 'name' }
		}))
		.pipe(gulp.dest(path.build.fullpage))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('favicon:build', function() {
	gulp.src(path.src.favicon)
		.pipe(gulp.dest(path.build.favicon))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('build', [
	'svgstore:build',
	'html:build',
	'js:build',
	'js:build-vendor',
	'css:build',
	'image:build',
	'pic:build',
	'media:build',
	'fullpage:build',
	'favicon:build',
	'fonts:build',
	'php:build'
]);


gulp.task('watch', function() {
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('css:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build', 'js:build-vendor');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.pic], function(event, cb) {
		gulp.start('pic:build');
	});
	watch([path.watch.svg], function(event, cb) {
		gulp.start('svgstore:build');
	});
	watch([path.watch.media], function(event, cb) {
		gulp.start('media:build');
	});
	watch([path.watch.fullpage], function(event, cb) {
		gulp.start('fullpage:build');
	});
	watch([path.watch.fullpage], function(event, cb) {
		gulp.start('favicon:build');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
	watch([path.watch.php], function(event, cb) {
        gulp.start('php:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);
