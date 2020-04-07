var gulp = require('gulp');
var browserify = require('browserify');
var fancy_log = require('fancy-log');
var glob = require('glob');
var notify = require("gulp-notify");
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var watchify = require('watchify');

var paths = {
    pages: ['src/html/*.html', 'src/html/*.css']
};

var files = [];
var globFiles = glob.sync("./src/**/*.ts");
for (var i = 0; i < globFiles.length; i++) {
    files.push(globFiles[i]);
}

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: files,
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .on('error', fancy_log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'))
        .pipe(notify("Done"));
}

gulp.task('default', gulp.series(gulp.parallel('copy-html'), bundle));
watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', fancy_log);
