
// https://github.com/gulpjs/gulp
let gulp = require('gulp');

// https://www.npmjs.com/package/gulp-image-resize
let imageResize = require('gulp-image-resize');
var imageOptim  = require('gulp-imageoptim');

let parallel = require("concurrent-transform");
let os = require("os");

const SIZES = [384, 512, 768, 1024, 1536, 2048];  // These can be any numbers you like! These particular sizes were chosen since they’re
                                                  // device-agnostic and multiples of 256, which may make the maths easier for your processor.

// const ASPECT_RATIO = '10/8';

let sizesCursor;
let sourceImagePath;
let generatedImagePath;

// Create a copy of each image, at the requested size
function generateImages({ width, aspectRatio }) {
  if (!width) return;

  let folder = `${generatedImagePath}/${width}-wide`;
  let options = {
    filter: 'Catrom',
    // background: '#ffffff',
    // flatten: true,
    quality: 1,
    width: width,
    format: 'jpg',
    imageMagick: true
  }

  if (aspectRatio) {
    folder += `-with-aspect-${String(aspectRatio).replace('/', '-')}`;
    let ratio = Number(aspectRatio.split('/')[0])
                /
                Number(aspectRatio.split('/')[1])
    options.height = Math.round(options.width / ratio);
    options.crop = true;
    options.upscale = false;
  }

  console.dir(options);

  console.log('Generating images at width: ' + options.width + ' a pixels, in the folder: ' + folder);

  gulp.src(sourceImagePath + "/*.{jpg,jpeg,JPEG,JPG,png,PNG}")
    .pipe(parallel(
      imageResize(options), // https://www.npmjs.com/package/gulp-image-resize
      os.cpus().length
    ))
    // .pipe(imageOptim.optimize()) // https://www.npmjs.com/package/gulp-imageoptim
    .pipe(gulp.dest(folder))
    .on('end', generateNext);
}

function generateNext() { // https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/
  if (sizesCursor < SIZES.length) {
    let width = SIZES[sizesCursor];
    generateImages({width: width, aspectRatio: null});
    // generateImages({width: width, aspectRatio: ASPECT_RATIO});
    sizesCursor++;
  }
}

gulp.task("default", function() {
  // sizesCursor = 0;
  // sourceImagePath     = '../_uploads/Beach=Culture';
  // generatedImagePath  = '../uploads-optimized/Beach=Culture';
  // generateNext();

  // sizesCursor = 0;
  // sourceImagePath     = '../_uploads/camera-obscura-art-lab';
  // generatedImagePath  = '../uploads-optimized/camera-obscura-art-lab';
  // generateNext();

  // sizesCursor = 0;
  // sourceImagePath     = '../_uploads/miles-memorial-playhouse';
  // generatedImagePath  = '../uploads-optimized/miles-memorial-playhouse';
  // generateNext();

  // sizesCursor = 0;
  // sourceImagePath     = '../_uploads/coast';
  // generatedImagePath  = '../uploads-optimized/coast';
  // generateNext();

  // sizesCursor = 0;
  // sourceImagePath     = '../_uploads/dia-de-los-muertos';
  // generatedImagePath  = '../uploads-optimized/dia-de-los-muertos';
  // generateNext();
});
