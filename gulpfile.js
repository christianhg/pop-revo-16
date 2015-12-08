(function() {
    'use strict';

    var angularFilesort = require('gulp-angular-filesort');
    var autoprefixer = require('gulp-autoprefixer');
    var browserSync = require('browser-sync');
    var concat = require('gulp-concat');
    var flatten = require('gulp-flatten');
    var gulp = require('gulp');
    var inject = require('gulp-inject');
    var jshint = require('gulp-jshint');
    var minifyCSS = require('gulp-minify-css');
    var minifyHTML = require('gulp-minify-html');
    var ngAnnotate = require('gulp-ng-annotate');
    var plumber = require('gulp-plumber');
    var rename = require('gulp-rename');
    var sass = require('gulp-ruby-sass');
    var sourcemaps = require('gulp-sourcemaps');
    var stripDebug = require('gulp-strip-debug');
    var stylish = require('jshint-stylish');
    var templateCache = require('gulp-angular-templatecache');
    var uglify = require('gulp-uglify');
    var using = require('gulp-using');

    var vendor = {
        css: [

        ],
        fonts: [

        ],
        js: [
            'bower_components/angular/angular.min.js',
            'bower_components/angular-moment/angular-moment.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        ],
    };

    gulp.task('graphics', function() {
      gulp.src(['./src/assets/graphics/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('./build/graphics'));
    });

    gulp.task('fonts-app', function() {
      gulp.src(['./src/assets/fonts/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('./build/fonts'));
    });

    gulp.task('fonts-vendor', function() {
      gulp.src(vendor.fonts)
        .pipe(plumber())
        .pipe(gulp.dest('./build/fonts'));
    });

    gulp.task('fonts', ['fonts-app', 'fonts-vendor'], function() {

    });

    gulp.task('assets', ['fonts', 'graphics'], function() {

    });

    gulp.task('views', function() {
        gulp.src(['./src/app/**/*.html'])
            .pipe(plumber())
            .pipe(templateCache('templates.js', {
              module: 'poprevo.templates',
              standalone: true
            }))
            .pipe(gulp.dest('./build/js/templates'));
    });

    gulp.task('css-app', function() {
        return sass('./src/scss/app.scss', { sourcemap: true})
            .pipe(plumber())
            .pipe(sourcemaps.write())
            .pipe(autoprefixer('last 2 versions'))
            .pipe(gulp.dest('./build/css'))
    });

    gulp.task('css-vendor', function() {
        return gulp.src(vendor.css)
            .pipe(plumber())
            .pipe(concat('vendor.css'))
            .pipe(gulp.dest('./build/css'));
    });

    gulp.task('css', ['css-app', 'css-vendor'], function() {

    });

    gulp.task('index', function() {
        return gulp.src('./src/index.html')
            .pipe(plumber())
            .pipe(gulp.dest('./build'));
    });

    gulp.task('js-app', function() {
        return gulp.src(['./src/app/**/*.js'])
            .pipe(plumber())
            .pipe(flatten())
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(ngAnnotate({add: true, single_quotes: true}))
            .pipe(angularFilesort())
            .pipe(concat('app.js'))
            .pipe(gulp.dest('./build/js/app'));
    });

    gulp.task('js-vendor', function() {
        return gulp.src(vendor.js)
            .pipe(plumber())
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest('./build/js/vendor'));
    });

    gulp.task('js', ['js-app', 'js-vendor'], function() {

    });

    gulp.task('inject', ['css', 'index', 'js', 'views'], function() {
        return gulp.src('./build/index.html')
            .pipe(plumber())
            .pipe(inject(
                gulp.src(['./build/css/app.css']),
                {relative: true, name: 'app'}
            ))
            .pipe(inject(
                gulp.src(['./build/css/vendor.css']),
                {relative: true, name: 'vendor'}
            ))
            .pipe(inject(
                gulp.src(['./build/js/app/**/*']),
                {relative: true, name: 'app'}
            ))
            .pipe(inject(
                gulp.src(['./build/js/templates/**/*']),
                {relative: true, name: 'templates'}
            ))
            .pipe(inject(
                gulp.src(['./build/js/vendor/**/*']),
                {relative: true, name: 'vendor'}
            ))
            .pipe(gulp.dest('./build'));
    });

    gulp.task('serve', ['build'], function() {
        browserSync.init({
            server: './build',
            notify: false,
            open: false,
            ghostMode: false
        });
    });

    gulp.task('build', ['assets', 'inject'], browserSync.reload);

    gulp.task('dev', ['serve'], function() {
        gulp.watch('./src/**/*', ['build']);
    });

    gulp.task('dist-index', function() {
      return gulp.src('./src/index.html')
        .pipe(plumber())
        .pipe(gulp.dest('./dist'));
    });

    gulp.task('dist-fonts', ['build'], function() {
      gulp.src(['./build/fonts/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/fonts'));
    });

    gulp.task('dist-graphics', ['build'], function() {
      gulp.src(['./build/graphics/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/graphics'));
    });

    gulp.task('dist-assets', ['dist-fonts', 'dist-graphics'], function() {

    });

    gulp.task('dist-css-app', ['build'], function() {
      return gulp.src(['./build/css/app.css'])
        .pipe(plumber())
        .pipe(minifyCSS())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./dist/css'));
    });

    gulp.task('dist-css', ['dist-css-app'], function() {

    });

    gulp.task('dist-js-app', ['build'], function() {
      return gulp.src(['./build/js/app/**/*', './build/js/templates/**/*'])
        .pipe(plumber())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
    });

    gulp.task('dist-js-vendor', function() {
      return gulp.src(['./build/js/vendor/**/*'])
        .pipe(plumber())
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
    });

    gulp.task('dist-js', ['dist-js-app', 'dist-js-vendor'], function() {

    });

    gulp.task('dist-inject', ['dist-css', 'dist-index', 'dist-js'], function() {
      return gulp.src('./dist/index.html')
        .pipe(plumber())
        .pipe(inject(
          gulp.src('./dist/css/app.min.css'),
          {relative: true, name: 'app'}
        ))
        .pipe(inject(
          gulp.src('./dist/js/app.min.js'),
          {relative: true, name: 'app'}
        ))
        .pipe(inject(
          gulp.src(['./dist/js/vendor.min.js']),
          {relative: true, name: 'vendor'}
        ))
        .pipe(minifyHTML())
        .pipe(gulp.dest('./dist'));
    });

    gulp.task('dist', ['dist-assets', 'dist-inject'], function() {

    });
})();
