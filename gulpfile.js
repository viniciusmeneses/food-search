const gulp = require('gulp')
const concat = require('gulp-concat')
const env = require('gulp-environment')
const watch = require('gulp-watch')
const rename = require('gulp-rename')
const wait = require('gulp-wait')

const cleancss = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify')

const babel = require('gulp-babel')
const sass = require('gulp-sass')

const jshint = require('gulp-jshint');
const htmlhint = require("gulp-htmlhint")

const webserver = require('gulp-webserver')
const nodemon = require('gulp-nodemon')

gulp.task('default', ['html', 'scss', 'js', 'img'], () => {
  if (env.is.development()) {
    gulp.start('front-end')
  }
})

gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(htmlhint())
    .pipe(htmlhint.failAfterError())
    .pipe(gulp.dest('public'))
})

gulp.task('scss', () => {
  return gulp.src('src/assets/scss/index.scss')
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(cleancss())
    .pipe(gulp.dest('public/assets/css'))
})

gulp.task('js', () => {
  return gulp.src('src/assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }))
    // .pipe(jshint.reporter('fail'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename((path) => {
      path.basename += '.min'
    }))
    .pipe(gulp.dest('public/assets/js'))
})

gulp.task('img', () => {
  return gulp.src('src/assets/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/assets/img'))
})

gulp.task('back-end', () => {
  return nodemon({
    script: 'server/app.js'
  })
})

gulp.task('watch', () => {
  watch('src/**/*.html', () => gulp.start('html'))
  watch('src/assets/scss/**/*.scss', () => gulp.start('scss'))
  watch('src/assets/js/**/*.js', () => gulp.start('js'))
  watch('src/assets/img/**/*.*', () => gulp.start('img'))
})

gulp.task('front-end', ['back-end', 'watch'], () => {
  return gulp.src('public')
    .pipe(webserver({
      livereload: {
        enable: true
      },
      port: 8080,
      open: true
    }))
})
