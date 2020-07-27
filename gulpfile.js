const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const connect = require('gulp-connect');
const util = require('gulp-util');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const csso = require('gulp-csso');

sass.compiler = require('node-sass');

let production = false;

// Set enviroment mode for production
gulp.task('production', (done) => {
  production = true;
  done();
});

// Set enviroment mode for development
gulp.task('development', (done) => {
  production = false;
  done();
});

// Remove all files from distrib dir
gulp.task('clean-distrib', function () {
  return gulp.src('./distrib/', { read: false, allowEmpty: true }).pipe(clean());
});

// Compile sass file and put them in distrib dir
gulp.task('sass', () => {
  return gulp
    .src('./assets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(production ? csso() : util.noop())
    .pipe(gulp.dest('./distrib/assets/css'))
    .pipe(production ? util.noop() : connect.reload());
});

// Transpile js files with babel and put them in distrib dir
gulp.task('js', () => {
  return gulp
    .src('./assets/scripts/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(production ? uglify() : util.noop())
    .pipe(gulp.dest('./distrib/assets/scripts'))
    .pipe(production ? util.noop() : connect.reload());
});

// Copy html files to distrib dir
gulp.task('copy-html', () => {
  return gulp
    .src('./*.html')
    .pipe(
      production
        ? htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        : util.noop()
    )
    .pipe(gulp.dest('./distrib/'))
    .pipe(production ? util.noop() : connect.reload());
});

// Copy fonts files to distrib dir
gulp.task('copy-fonts', () => {
  return gulp
    .src('./assets/fonts/**/*')
    .pipe(gulp.dest('./distrib/assets/fonts'))

    .pipe(production ? util.noop() : connect.reload());
});

// Copy images files to distrib dir
gulp.task('copy-img', () => {
  return gulp
    .src('./assets/img/**/*')
    .pipe(gulp.dest('./distrib/assets/img'))
    .pipe(production ? util.noop() : connect.reload());
});

// Copy external css files to distrib dir
gulp.task('copy-css', () => {
  return gulp
    .src('./assets/css/**/*')
    .pipe(production ? csso() : util.noop())
    .pipe(gulp.dest('./distrib/assets/css'))
    .pipe(connect.reload());
});

// Build dev version of page
gulp.task(
  'build-dev',
  gulp.series(['development', 'clean-distrib', 'sass', 'js', 'copy-html', 'copy-fonts', 'copy-img', 'copy-css'])
);

// Build production version of page
gulp.task(
  'build-prod',
  gulp.series(['production', 'clean-distrib', 'sass', 'js', 'copy-html', 'copy-fonts', 'copy-img', 'copy-css'])
);

// Live server tasks
gulp.task('serve', () => {
  return connect.server({ root: 'distrib', livereload: true });
});

gulp.task('watch', () => {
  gulp.watch('./*.html', gulp.series('copy-html'));
  gulp.watch('./assets/scripts/**/*.js', gulp.series('js'));
  gulp.watch('./assets/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./assets/fonts/**/*', gulp.series('copy-fonts'));
  gulp.watch('./assets/img/**/*', gulp.series('copy-img'));
  gulp.watch('./assets/css/**/*', gulp.series('copy-css'));
});

gulp.task('start-dev', gulp.series('development', 'clean-distrib', 'build-dev', gulp.parallel(['watch', 'serve'])));
