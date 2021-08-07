var ms = require('gulp-monkeyscript');
var msProject = ms.createProject("package.json");

var gulp = require('gulp');
var gulpless = require('gulp-less');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var replace = require('gulp-replace');

/**
 * LESS compile/merge task.
 * @param {Function} cb Some callback.
 */
function lessTask(cb) {
	// uncomment to use LESS->CSS builder
	
	// gulp.src("src/less/index.less")
	// 	.pipe(gulpless())
	// 	.pipe(gulp.dest("src/css/"));
    
	cb();
}

/**
 * Main build task.
 * @param {Function} cb Some callback.
 */
function buildTask(cb) {
	// user.js
	gulp.src([
		'src/**/!(index)*.js',	// all .js files EXCEPT index
		'src/index.js',		// index at the end
	])
		.pipe(concat("script.user.js"))
		.pipe(msProject()) // add monkeyscript header
		.pipe(gulp.dest("dist/"))
	;

	// meta.js
	var stream = source('script.meta.js');
	stream.end('');
	stream
		.pipe(msProject()) // add monkeyscript header
		.pipe(replace(/\/\/\s+@(update|download)URL.+[\r\n]*/g, ''))
		.pipe(gulp.dest("dist/"))
	;
		
	cb();
}

// task names
exports.less = lessTask;
exports.build = buildTask;
exports.default = gulp.series(lessTask, buildTask)