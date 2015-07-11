var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var notify = require("gulp-notify");
 
var sourceDir = './frontend';
var buildDir = './build';
 
// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file, watch) {
  var props = watchify.args;
  props.entries = [sourceDir + '/js/' + file];
  props.debug = (process.env.NODE_ENV !== 'production');
  
  var bundler = watch ? watchify(browserify(props)) : browserify(props);
  
  bundler.transform('reactify')
  		   .transform({
			  			global: true
					}, 'uglifyify');
  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
      }))
      .pipe(source(file))
      .pipe(gulp.dest(buildDir + '/js'));
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
}

gulp.task('copy', function() {
	gulp.src(sourceDir + '/index.html')
		.pipe(gulp.dest(buildDir));
	gulp.src(sourceDir + '/assets/**/*.*')
		.pipe(gulp.dest(buildDir + '/assets'));
});
 
gulp.task('build', function() {
  return buildScript('main.js', false);
});
 
 
gulp.task('default', ['build', 'copy'], function() {
	gulp.watch(sourceDir + '/**/*.*', ['copy']);
  return buildScript('main.js', true);
});