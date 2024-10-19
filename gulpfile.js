const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // Ensure you're using the Dart Sass implementation
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');

gulp.task('css', function () {
    console.log('Minifying CSS...');

    // Create a stream for SASS compilation and minification
    const sassStream = gulp.src('./assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError)) // Log errors to the console
        .pipe(cssnano())
        .pipe(gulp.dest('./assets/css')); // Ensure this is the correct destination for compiled CSS

    // Create a stream for revving CSS files
    const revStream = gulp.src('./assets/css/**/*.css') // Ensure you're targeting the correct path for revving
        .pipe(rev())
        .pipe(gulp.dest('./public/assets')) // Destination for revved files
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets')); // Save the manifest file

    // Return both streams in an array to ensure they run correctly
    return Promise.all([sassStream, revStream]);
});
