const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

gulp.task('styles', function() {
    return gulp.src(['src/css/bootstrap.dialog.scss'])
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('scripts', function() {
    return gulp.src(['src/js/BootstrapModalDom.js', 'src/js/modal.js', 'src/js/dialog.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-object-assign', 'add-module-exports', 'transform-es2015-modules-umd']
        }))
        .pipe(concat('dialog.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/'));
});

gulp.task('default', ['styles', 'scripts']);
