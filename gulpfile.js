const gulp = require('gulp');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

gulp.task('styles', function() {
    return gulp.src(['src/css/bootstrap.dialog.scss'])
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('default', ['styles']);
