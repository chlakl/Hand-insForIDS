let data = 0;
let serial;
let video;
let handPose;
let hands;

var serialPortName = "COM3"; //Udskift teksten med egen port for at kunne sende data til esp32

function setup() {
  //vinduet til videon
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  // handpose model
  handpose = ml5.handpose(video, modelReady);
  // ting til at snakke sammen med serial control programmet
  serial = new p5.SerialPort();
  serial.open("COM3");
  serial = new p5.SerialPort();
  serial.open(serialPortName);
}

function modelReady() {
  console.log("hand pose loaded");
  handpose.on("predict", gotPose);
}

function gotPose(results) {
  hands = results;
}

// tegner hånden og makerer led
function drawHand(hand) {
  let landmarks = hand.landmarks;
  colorMode(RGB);
  fill(255, 100);
  stroke(255);
  for (let i = 0; i < landmarks.length; i++) {
    let [x, y, z] = landmarks[i];
    ellipse(x, y, 24);
  }
  // averagedepth er summen af z værdien på tommel og pegefinger divideret i 2 bruges i nedenstående if statement til at "aktiverer" den, selvom hånden er tæt på kameraret eller lagt fra
  var averageDepth =
    (hand.annotations.thumb[3][2] + hand.annotations.indexFinger[3][2]) / 2;
  // send data til serial control hvis hånden er i den angivne position
  if (
    hand.annotations.thumb[3][1] < hand.annotations.indexFinger[3][1] - 2.0 &&
    hand.annotations.thumb[3][0] >
      hand.annotations.indexFinger[3][0] + averageDepth
  ) {
    data = 100;
    serial.write(data);
    console.log(data);
  }

  let annotations = hand.annotations;
  let parts = Object.keys(annotations);
  let count = 0;
  for (let part of parts) {
    for (let position of annotations[part]) {
      colorMode(HSB);
      stroke(count * 20, 255, 255);
      count++;
      strokeWeight(8);
      noFill();
      beginShape();
      for (let position of annotations[part]) {
        let [x, y, z] = position;
        vertex(x, y);
      }
      endShape();
    }
  }
}

function draw() {
  
  //specificere synlig kamera vinkel
  translate(width, 0);
  //scale justere zoom image window
  scale(-1, 1);
  background(150);
  //data til serial controller application
  data = 0;
  //sender data til serial controller application
  serial.write(data);
  console.log(data);
  if (video) {
    image(video, 0, 0);
  }
  if (hands && hands.length > 0) {
    let hand = hands[0];
    drawHand(hand);
  }

  
}
