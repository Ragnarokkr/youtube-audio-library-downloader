let gulp = require('gulp');
let gulpCopy = require('gulp-copy');

let filesToCopy = ['src/js/**', 'src/css/**', 'src/img/**', 'src/_locales/**', 'manifest.json'];
gulp.task('copy', () =>
	gulp.src(filesToCopy)
		.pipe(gulpCopy('dist', {prefix: 1}))
);

