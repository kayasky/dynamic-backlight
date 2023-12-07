import express from 'express';
import * as getColors from "get-image-colors";
import * as http from 'http';
import * as NodeWebcam from "node-webcam";
import * as path from "path";
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  // Webcam options
  const opts = {
    width: 640,
    height: 480,
    quality: 50,
    delay: 0,
    saveShots: false,
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
          let red = 0, green = 0, blue = 0;
          colors.forEach(color => {
            red += color._rgb[0];
            green += color._rgb[1];
            blue += color._rgb[2];
          });
          red /= colors.length;
          green /= colors.length;
          blue /= colors.length;
          console.log(`Average color is rgb(${red}, ${green}, ${blue})`);

          io.emit('updatedColours', { red, green, blue });
        });
      }
    });
  }

  setInterval(captureAndAnalyze, 3000);

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
