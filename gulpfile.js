var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

console.log('Compiling for: ' + process.env.NODE_ENV);

gulp.task('browserify', function() {
	browserify('./frontend/js/main.js', {debug: (process.env.NODE_ENV !== 'production')})
		.transform('reactify')
		.transform({
  			global: true
		}, 'uglifyify')
		.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest('build/js'));
});

gulp.task('copy', function() {
	gulp.src('frontend/index.html')
		.pipe(gulp.dest('build'));
	gulp.src('frontend/assets/**/*.*')
		.pipe(gulp.dest('build/assets'));
});

gulp.task('default', ['browserify', 'copy'], function() {
	return gulp.watch('frontend/**/*.*', ['browserify', 'copy']);
});