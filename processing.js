var model;

async function loadModel() {
  model = await tf.loadGraphModel("TFJS/model.json");
}

function predictImage() {
  //   console.log("Processing...");

  let image = cv.imread(canvas);

  // convert to gray color
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  // increase the contrast in which all gray colors above 125 to white 255
  cv.threshold(image, image, 125, 255, cv.THRESH_BINARY);
  // find contours
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // You can try more different parameters
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  let cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  // crop the image based on the bounding rect
  image = image.roi(rect);

  var img_width = image.cols;
  var img_height = image.rows;

  if (img_height > img_width) {
    //   Thin and long image
    img_height = 20;
    const scaleFactor = image.rows / img_height;
    img_width = Math.round(image.cols / scaleFactor);
  } else {
    //   Fat and short image
    img_width = 20;
    const scaleFactor = image.cols / img_width;
    img_height = Math.round(image.rows / scaleFactor);
  }

  let dsize = new cv.Size(img_width, img_height);
  cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

  // Padding
  const LEFT = Math.ceil(4 + (20 - img_width) / 2);
  const RIGHT = Math.floor(4 + (20 - img_width) / 2);
  const TOP = Math.ceil(4 + (20 - img_height) / 2);
  const BOTTOM = Math.floor(4 + (20 - img_height) / 2);

  const BLACK = new cv.Scalar(0, 0, 0, 0); // alpha = 0 : transparent
  cv.copyMakeBorder(
    image,
    image,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
    cv.BORDER_CONSTANT,
    BLACK
  );

  // Finding the Centre of Mass - Centroid of the image
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );
  cnt = contours.get(0);

  const Moments = cv.moments(cnt, false);
  const cx = Moments.m10 / Moments.m00;
  const cy = Moments.m01 / Moments.m00;
  const X_SHIFT = Math.round(image.cols / 2.0 - cx);
  const Y_SHIFT = Math.round(image.rows / 2.0 - cy);

  newSize = new cv.Size(image.cols, image.rows);

  //   Translation is the shifting of image location to the centroid (X_SHIFT, Y_SHIFT)
  const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
  cv.warpAffine(
    image,
    image,
    M,
    newSize,
    (flags = cv.INTER_LINEAR),
    (borderMode = cv.BORDER_CONSTANT),
    (borderValue = new cv.Scalar())
  );

  // Get pixel values of the image
  let pixelValues = image.data;
  pixelValues = Float32Array.from(pixelValues, function (item) {
    return item / 255.0;
  });

  // Prepare inputs for prediction. The inputs X is a 2-dim tensor.
  const X = tf.tensor([pixelValues]);
  //   console.log(`Shape of Tensor X: ${X.shape}`);
  //   console.log(`dtype of Tensor X: ${X.dtype}`);

  const pred = model.predict(X);
  //   pred.print();

  const predVal = pred.dataSync()[0];

  // Checking memory leak in using tensorflowjs
  //   console.log(tf.memory());

  // Testing purpose. Remove soon
  //   const outputCanvas = document.createElement("CANVAS");
  //   cv.imshow(outputCanvas, image);
  //   document.body.appendChild(outputCanvas);

  // clean the variables
  cnt.delete();
  hierarchy.delete();
  contours.delete();
  image.delete();

  pred.dispose();
  X.dispose();

  return predVal;
}
