// gulp
var gulp = require('gulp');
var bs = require('browser-sync').create();

// plugins
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('lint', () =>
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del(['docs/*']));

gulp.task('minify-css', () => {
    var opts = { comments: true, spare: true };

    return gulp.src(['./app/**/*.css', '!./app/bower_components/**', '!./../node_modules/**'])
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('./docs/'));
});


gulp.task('scripts', () => {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(concat('all.js'))
      .pipe(gulp.dest('./docs/js'));
});

gulp.task('copy-bower-components', () =>
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('./docs/bower_components/'))
);

gulp.task('copy-html-files', () =>
  gulp.src('./app/**/*.html')
  .pipe(gulp.dest('./docs/'))
);

gulp.task('copy-images', () =>
  gulp.src('./app/img/*')
    .pipe(gulp.dest('./docs/img/'))
);

gulp.task('serve', () => {
    bs.init({
        server: './app'
    });
    gulp.watch('./app/**/*.html').on('change', bs.reload);
    gulp.watch('app/css/*.css').on('change', bs.reload);
    gulp.watch('app/js/*.js').on('change', bs.reload);
});
gulp.task('browser-sync-docs', callback => {
    bs.init({
        server: './docs'
    });
    callback();
});

// default task
gulp.task('default', ['lint', 'serve']);
gulp.task('build', callback => {
    runSequence(
        'clean', ['copy-bower-components', 'minify-css', 'copy-html-files', 'copy-images', 'scripts'],
        'browser-sync-docs',
        callback
    );
});
