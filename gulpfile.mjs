import gulp from 'gulp';
import nodeSass from 'node-sass';
import gulpSass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import rev from 'gulp-rev';
import uglify from 'gulp-uglify-es';
import imagemin from 'gulp-imagemin';
import { deleteAsync } from 'del';

const sass = gulpSass(nodeSass);

// Clean the public/assets directory
gulp.task('clean:assets', function(done) {
    deleteAsync('./public/assets/**/*').then(() => done()).catch(err => {
        console.error('Error cleaning assets:', err);
        done();
    });
});

gulp.task('css', function(done) {
    console.log('minifying css...');
    gulp.src('./assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError)) // Error handling
        .pipe(cssnano())
        .pipe(gulp.dest('./public/assets/css')) // Output to css folder

    gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('js', function(done) {
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
        .pipe(uglify.default().on('error', function(err) {
            console.error('JavaScript minification error:', err.toString());
            this.emit('end'); // Prevent Gulp from crashing
        }))
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    
    done();
});

gulp.task('images', function(done) {
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
        .pipe(imagemin().on('error', function(err) {
            console.error('Image minification error:', err.toString());
            this.emit('end'); // Prevent Gulp from crashing
        }))
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done) {
    console.log('Building assets');
    done();
});
