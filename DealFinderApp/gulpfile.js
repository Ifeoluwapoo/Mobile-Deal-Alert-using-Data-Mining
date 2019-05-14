const {
  src,
  dest,
  parallel,
  watch
} = require('gulp');
const rev = require('gulp-rev');
const minifyJS = require('gulp-minify');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');


function css() {
  return src(['www/apps.css', 'www/packages/**/*.css', 'www/components/**/*.css'])
    // .pipe(minifyCSS())
    .pipe(concat("style.css"))
    // .pipe(rev())
    // .pipe(gulp.dest('www/assets/css'))
    // .pipe(rev.manifest())
    .pipe(dest('www/assets/css'))
}

function js() {
  return src(['www/packages/**/*.js', 'www/components/**/*.js'], {
      sourcemaps: false
    })
    .pipe(concat('main.js'))
    // .pipe(minifyJS())
    .pipe(dest('www/assets/js', {
      sourcemaps: false
    }))
}

exports.js = js;
exports.css = css;
exports.default = parallel(css, js);
watch(['www/packages/**/*.js', 'www/components/**/*.js'], js);
watch(['www/apps.css', 'www/packages/**/*.css', 'www/components/**/*.css'], css);