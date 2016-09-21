// gulp
var gulp = require('gulp');
var bs = require('browser-sync').create();

// plugins
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('lint', function() {
  return gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task('clean', function() {
	return del([
		'dist/*'
	]);
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  return gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('minify-js', function() {
  return gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('copy-bower-components', function () {
  return gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('./dist/bower_components/'));
});
gulp.task('copy-html-files', function () {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./dist/'));
});
gulp.task('serve', function () {
	bs.init({
    	server: './app'
    });
    gulp.watch("./app/**/*.html").on('change', bs.reload);
    gulp.watch("app/css/*.css").on('change', bs.reload);
    gulp.watch("app/js/*.js").on('change', bs.reload);
});
gulp.task('browser-sync-dist', function() {
    bs.init({
    	server: './dist'
    });
});

// default task
gulp.task('default',
  ['lint', 'serve']
);
gulp.task('build', function() {
  runSequence(
    'clean',
    ['lint', 'copy-bower-components', 'minify-css', 'minify-js', 'copy-html-files'],
    'browser-sync-dist'
  );
})