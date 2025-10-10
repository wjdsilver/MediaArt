let cols = 10;
let rows = 20;
let textStr = 'Hello';
let fontSize = 12;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  textFont('Arial Black');
  textSize(fontSize);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(200, 30, 90); // 소라색(연한 하늘색)
  const t = millis() * 0.001;
  let cellW = width / cols;
  let cellH = height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = c * cellW + cellW / 2;
      let y = r * cellH + cellH / 2;
      let hue = (t * 60 + (r + c) * 10) % 360;
      stroke(0);
      strokeWeight(1);
      fill(hue, 80, 100);
      text(textStr, x, y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}