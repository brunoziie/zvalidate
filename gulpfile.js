const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');

gulp.task('js', () => {
    return gulp.src('src/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('zvalidate.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', () => {
    return gulp.src('src/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('zvalidate.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('src/*.scss', ['sass']);
    gulp.watch('src/*.js', ['js']);
});

gulp.task('default', ['js', 'sass', 'watch']);