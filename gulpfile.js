// gulp
var gulp = require('gulp');
var bs = require('browser-sync').create();

// plugins
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
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
  return gulp.src(['./app/**/*.css', '!./app/bower_components/**', '!./../node_modules/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('scripts', function() {
  return gulp.src('./app/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js/'));
});
// gulp.task('minify-js', function(cb) {
// 	var options = {
// 	  preserveComments: 'license'
// 	};
// 	pump([
// 	      gulp.src(['./app/**/*.js', '!./app/bower_components/**']),
// 	      minifier(options, uglifyjs),
// 	      gulp.dest('dist')
// 	    ],
// 	    cb
// 	  );
//   // return gulp.src(['./app/**/*.js', '!./app/bower_components/**'])

//   //   .pipe(UglifyJS.minify().on('error', function(e){
//   //       console.log(e);
//   //    }))
//   //   .pipe(gulp.dest('./dist/'))
// });
gulp.task('copy-bower-components', function () {
  return gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('./dist/bower_components/'));
});
gulp.task('copy-html-files', function () {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./dist/'));
});
gulp.task('copy-images', function () {
  return gulp.src('./app/img/*')
    .pipe(gulp.dest('./dist/img/'));
});
gulp.task('serve', function () {
	bs.init({
    	server: './app'
    });
    gulp.watch("./app/**/*.html").on('change', bs.reload);
    gulp.watch("app/css/*.css").on('change', bs.reload);
    gulp.watch("app/js/*.js").on('change', bs.reload);
});
gulp.task('browser-sync-dist', function(callback) {
    bs.init({
    	server: './dist'
    });
    callback();
});

// default task
gulp.task('default',
  ['lint', 'serve']
);
gulp.task('build', function(callback) {
  runSequence(
    'clean',
    ['lint', 'copy-bower-components', 'minify-css', 'copy-html-files', 'copy-images', 'scripts'],
    'browser-sync-dist',
    callback
  );
})