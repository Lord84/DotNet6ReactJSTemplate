/// <binding ProjectOpened='default' />

const gulp = require('gulp'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    envify = require('gulp-envify'),
    terser = require('gulp-terser'),
    less = require('gulp-less'),
    cleanCss = require('gulp-clean-css'),
    merge = require('merge-stream'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    uglifyify = require('uglifyify')

const wwwroot = 'wwwroot',
    cssFolder = wwwroot + '/css',
    jsFolder = wwwroot + '/js',
    scriptsFolder = 'scripts',
    lessFolder = scriptsFolder + '/less',
    jsxFolder = scriptsFolder + '/jsx',
    cssFiles = [cssFolder + '/*.css', '!' + cssFolder + '/**/*.min.css'],
    jsFiles = [jsFolder + '/*.js', '!' + jsFolder + '/**/*.min.js'],
    lessFiles = lessFolder + '/*.less',
    jsxFiles = jsxFolder + '/**/*.jsx',
    mainJsxFile = 'site';

function lessCompile() {
    return gulp.src(lessFiles)
        .pipe(plumber({ errorHandler: function (e) { console.log(e); } }))
        .pipe(less())
        .pipe(gulp.dest(cssFolder));
}

function minifyCss() {
    return gulp.src(cssFiles)
        .pipe(plumber({ errorHandler: function (e) { console.log(e); } }))
        .pipe(cleanCss({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssFolder));
}

function jsxCompile() {
    return browserify(jsxFolder + '/' + mainJsxFile + '.jsx', { debug: true })
        .on('error', function (e) { console.log(e); this.emit('end'); })
        .transform(babelify, {
            presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                {
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-transform-runtime'
                    ]
                }
            ],
            sourceMaps: true
        })
        .on('error', function (e) { console.log(e); this.emit('end'); })
        .bundle()
        .on('error', function (e) { console.log(e); this.emit('end'); })
        .pipe(plumber({ errorHandler: function (e) { console.log(e); } }))
        .pipe(source(mainJsxFile + '.js'))
        .pipe(gulp.dest(jsFolder));
}

function jsxCompileUglify() {
    return browserify(jsxFolder + '/' + mainJsxFile + '.jsx', { debug: true })
        .on('error', function (e) { console.log(e); this.emit('end'); })
        .transform(babelify, {
            presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                {
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-transform-runtime'
                    ]
                }
            ],
            sourceMaps: true
        })
        .on('error', function (e) { console.log(e); this.emit('end'); })
        .transform(uglifyify)
        .on('error', function (e) { console.log(e); this.emit('end'); })
        .bundle()
        .on('error', function (e) { console.log(e); this.emit('end'); })
        .pipe(plumber({ errorHandler: function (e) { console.log(e); } }))
        .pipe(source(mainJsxFile + '.js'))
        .pipe(gulp.dest(jsFolder));
}

function minifyJs() {
    return gulp.src(jsFiles)
        .pipe(plumber({ errorHandler: function (e) { console.log(e); } }))
        //.pipe(sourcemaps.init({ loadMaps: false }))
        .pipe(envify({
            NODE_ENV: 'production'
        }))
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        //.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsFolder));
}

function watchChanges() {
    gulp.watch(lessFiles, lessCompile);
    gulp.watch(jsxFiles, jsxCompile);
}

exports.lessCompile = lessCompile;
exports.minifyCss = lessCompile;
exports.minifyCss = gulp.series(lessCompile, minifyCss);
exports.jsxCompile = jsxCompile;
exports.minifyJs = gulp.series(jsxCompileUglify, minifyJs);
exports.default = gulp.series(lessCompile, jsxCompile, watchChanges);

//**********************************************************//
//  This section will copy npm Dependencies to wwwroot/lib  //
//**********************************************************//
const deps = {
    "jquery": {
        src: "jquery/dist/*",
        dst: "wwwroot/lib/jquery/"
    },
    "bootstrap": {
        src: "bootstrap/dist/**/*",
        dst: "wwwroot/lib/bootstrap/"
    },
    "mdi-font": {
        src: "@mdi/font/**/*",
        dst: "wwwroot/font/mdi/"
    }
};

function copyLibraries() {
    let streams = [];

    for (let prop in deps) {
        console.log("Prepping Scripts for: " + prop);
        streams.push(gulp.src("node_modules/" + deps[prop].src)
            .pipe(gulp.dest(deps[prop].dst)));
    }

    return merge(streams);
}

exports.copyLibraries = copyLibraries;
//**********************************************************//