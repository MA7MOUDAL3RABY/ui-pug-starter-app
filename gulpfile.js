const gulp = require('gulp');
const connect = require('gulp-connect');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rollup = require('gulp-better-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

function reload(done) {
	connect.server({
		livereload: true,
		port: 9090,
		root: './dist'
	});
	done();
}

function styles() {
	return (
		gulp.src('src/scss/*.scss')
			.pipe(plumber())
			.pipe(sass({ outputStyle: 'expanded' }))
			.pipe(autoprefixer({
				cascade: false
			}))
			.pipe(gulp.dest('./dist/css'))
			.pipe(connect.reload()) &&
		gulp.src('src/scss/bootstrab.scss')
			.pipe(plumber())
			.pipe(sass({ outputStyle: 'expanded' }))
			.pipe(autoprefixer({
				cascade: false
			}))
			.pipe(gulp.dest('./dist/css'))
			.pipe(connect.reload())
	);
}

function scripts() {
	return (
		gulp.src('src/js/**/*.js')
			.pipe(plumber())
			.pipe(rollup({ // Using Rollup for bundling
				plugins: [
					resolve(), // Resolve module paths
					commonjs() // Convert CommonJS modules to ES6
				]
			}, 'iife')) // Output format: Immediately Invoked Function Expression (IIFE)
			.pipe(concat('app.js')) // Concatenate all JS files into app.js (if necessary)
			.pipe(gulp.dest('./dist/js'))
			.pipe(connect.reload())
	);
}

function html() {
	return (
		gulp.src('*.html')
			.pipe(plumber())
			.pipe(connect.reload())
	);
}

function views() {
	return (
		gulp.src('src/pug/views/**/*.pug')
			.pipe(plumber())
			.pipe(pug({
				pretty: true
			}))
			.pipe(gulp.dest('./dist'))
			.pipe(connect.reload())
	)
}

function copyAssets() {
	return gulp.src('src/assets/**/*')
		.pipe(gulp.dest('./dist/assets'));
}

function watchTask(done) {
	gulp.watch('*.html', html);
	gulp.watch('src/js/**/*.js', scripts);
	gulp.watch('src/pug/**/*.pug', views);
	gulp.watch('src/scss/**/*.scss', styles);
	gulp.watch('src/assets/**/*', copyAssets);
	done();
}

const watch = gulp.parallel(watchTask, reload);
const build = gulp.series(gulp.parallel(styles, scripts, html, views, copyAssets));

exports.reload = reload;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.views = views;
exports.watch = watch;
exports.build = build;
exports.default = watch;
