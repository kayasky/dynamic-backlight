import * as NodeWebcam from "node-webcam";
import * as getColors from "get-image-colors";
import * as path from "path";

// Webcam options
const opts = {
  width: 1280,
  height: 720,
  quality: 100,
  delay: 0,
  saveShots: true,
  output: "jpeg",
  device: false,
  callbackReturn: "location",
  verbose: false
};

// Create webcam instance
const Webcam = NodeWebcam.create(opts);

// Function to capture image and get average color
function captureAndAnalyze() {
  Webcam.capture("current_view", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      getColors.default(path.resolve(`${__dirname}/../`, "current_view.jpg")).then(colors => {
        let r = 0, g = 0, b = 0;
        colors.forEach(color => {
          r += color._rgb[0];
          g += color._rgb[1];
          b += color._rgb[2];
        });
        r /= colors.length;
        g /= colors.length;
        b /= colors.length;
        console.log(`Average color is rgb(${r}, ${g}, ${b})`);
      });
    }
  });
}

// Capture and analyze every second
setInterval(captureAndAnalyze, 1000);