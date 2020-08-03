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

const pagePath = 'page';
const assetsPath = `${pagePath}/assets`;

const distribPath = 'distrib';
const distAssetsPath = `${distribPath}/assets`;

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
  return gulp.src(`${distribPath}/`, { read: false, allowEmpty: true }).pipe(clean());
});

// Compile sass file and put them in distrib dir
gulp.task('sass', () => {
  return gulp
    .src(`${assetsPath}/scss/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(production ? csso() : util.noop())
    .pipe(gulp.dest(`${distAssetsPath}/css`))
    .pipe(production ? util.noop() : connect.reload());
});

// Transpile js files with babel and put them in distrib dir
gulp.task('js', () => {
  return gulp
    .src(`${assetsPath}/scripts/**/*.js`)
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(production ? uglify() : util.noop())
    .pipe(gulp.dest(`${distAssetsPath}/scripts`))
    .pipe(production ? util.noop() : connect.reload());
});

// Copy html files to distrib dir
gulp.task('copy-html', () => {
  return gulp
    .src(`${pagePath}/*.html`)
    .pipe(
      production
        ? htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        : util.noop()
    )
    .pipe(gulp.dest(`${distribPath}/`))
    .pipe(production ? util.noop() : connect.reload());
});

// Copy fonts files to distrib dir
gulp.task('copy-fonts', () => {
  return gulp
    .src(`${assetsPath}/fonts/**/*`)
    .pipe(gulp.dest(`${distAssetsPath}/fonts`))

    .pipe(production ? util.noop() : connect.reload());
});

// Copy images files to distrib dir
gulp.task('copy-img', () => {
  return gulp
    .src(`${assetsPath}/img/**/*`)
    .pipe(gulp.dest(`${distAssetsPath}/img`))
    .pipe(production ? util.noop() : connect.reload());
});

// Copy external css files to distrib dir
gulp.task('copy-css', () => {
  return gulp
    .src(`${assetsPath}/css/**/*`)
    .pipe(production ? csso() : util.noop())
    .pipe(gulp.dest(`${distAssetsPath}/css`))
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
  return connect.server({ root: `${distribPath}`, livereload: true });
});

gulp.task('watch', () => {
  gulp.watch(`${pagePath}/*.html`, gulp.series('copy-html'));
  gulp.watch(`${assetsPath}/scripts/**/*.js`, gulp.series('js'));
  gulp.watch(`${assetsPath}/scss/**/*.scss`, gulp.series('sass'));
  gulp.watch(`${assetsPath}/fonts/**/*`, gulp.series('copy-fonts'));
  gulp.watch(`${assetsPath}/img/**/*`, gulp.series('copy-img'));
  gulp.watch(`${assetsPath}/css/**/*`, gulp.series('copy-css'));
});

gulp.task('start-dev', gulp.series('development', 'clean-distrib', 'build-dev', gulp.parallel(['watch', 'serve'])));
