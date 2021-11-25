let serial; // variabel der skal indeholde Serial objektet
let data = 0; // variabel der indeholder vores data der er sendt
let black
let white;

  // http://p5-serial.github.io/p5.serialport/docs/classes/p5.serialport.html
  // hvordan man laver en ny serial port
var serialPortName = '/dev/cu.usbserial-0001'; //Udskift teksten med egen port for at kunne sende data til esp32  
function setup() {
  createCanvas(512, 512);
  black = color(0);
  white = color(255);
  serial = new p5.SerialPort()
  serial.open(serialPortName);
}

//https://p5js.org/examples/color-linear-gradient.html bruges til at forklare hvordan man kan lave noget gradient
function drawGradient(c1, c2) {
  noFill();
  for (let y = 0; y < height; y++) {
    let interp = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, interp);
    stroke(c);
    line(0, y, width, y);
  }
}

function draw() {
  drawGradient(black, white);
  stroke(255);
  strokeWeight(3);
  noFill();
  ellipse(mouseX, mouseY, 10, 10);
}

function mouseDragged(){
 
  data = floor(map(mouseY, 0, 512, 0, 255));
  data = constrain(data, 0, 255);
  serial.write(data);
  console.log(data);
  serial.read();
}