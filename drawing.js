const BACKGROUND_COLOUR = "#000000";
const LINE_COLOUR = "#FFFFFF";
const LINE_WIDTH = 10;

var currentX = 0;
var currentY = 0;
var prevX = 0;
var prevY = 0;
var canvas;
var context;

function prepareCanvas() {
  console.log("Preparing Canvas...");
  canvas = document.getElementById("my-canvas");
  context = canvas.getContext("2d");

  context.fillStyle = BACKGROUND_COLOUR;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  context.strokeStyle = LINE_COLOUR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = "round";

  var drag = false;

  canvas.addEventListener("mousedown", function (event) {
    // console.log('Pressed: X = ' + event.clientX + ', Y = ' + event.clientY);
    currentX = event.clientX - canvas.offsetLeft;
    currentY = event.clientY - canvas.offsetTop;
    drag = true;
  });

  canvas.addEventListener("mouseup", function (event) {
    // console.log('Released: X = ' + event.clientX + ', Y = ' + event.clientY);
    drag = false;
  });

  canvas.addEventListener("mouseleave", function (event) {
    // console.log('Left.');
    drag = false;
  });

  canvas.addEventListener("mousemove", function (event) {
    if (drag) {
      prevX = currentX;
      currentX = event.clientX - canvas.offsetLeft;
      prevY = currentY;
      currentY = event.clientY - canvas.offsetTop;

      draw();
    }
  });

  canvas.addEventListener("touchstart", function (event) {
    // console.log('touchstart: X = ' + event.touches[0].clientX + ', Y = ' + event.touches[0].clientY);
    currentX = event.touches[0].clientX - canvas.offsetLeft;
    currentY = event.touches[0].clientY - canvas.offsetTop;
    drag = true;
  });

  canvas.addEventListener("touchend", function (event) {
    // console.log('touchend.');
    drag = false;
  });

  canvas.addEventListener("touchcancel", function (event) {
    // console.log('touchcancel.');
    drag = false;
  });

  canvas.addEventListener("touchmove", function (event) {
    if (drag) {
      prevX = currentX;
      currentX = event.touches[0].clientX - canvas.offsetLeft;
      prevY = currentY;
      currentY = event.touches[0].clientY - canvas.offsetTop;

      draw();
    }
  });
}

function draw() {
  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(currentX, currentY);
  context.closePath();
  context.stroke();
}

function clearCanvas() {
  currentX = 0;
  currentY = 0;
  prevX = 0;
  prevY = 0;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}
