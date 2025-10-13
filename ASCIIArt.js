// 온라인 랜덤 이미지를 불러와 6단계 명도로 아스키아트 생성
let img;
let asciiChars = ['@', '#', '&', '+', ':', '.'];
let asciiArt = [];
let cellSize = 12;

function preload() {
  // 랜덤 이미지를 불러오기
  img = loadImage('https://picsum.photos/800/600?random=' + Math.floor(Math.random() * 100));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textSize(cellSize);
  textAlign(CENTER, CENTER);
  generateAsciiArt();
}

function generateAsciiArt() {
  img.loadPixels();
  asciiArt = [];

  let cols = img.width;
  let rows = img.height;
  let step = 8; // 샘플링 간격(간단하게)

  for (let y = 0; y < rows; y += step) {
    let line = '';
    for (let x = 0; x < cols; x += step) {
      let idx = 4 * (x + y * cols);
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];
      let bright = (r * 0.299 + g * 0.587 + b * 0.114);
      let level = floor(map(bright, 0, 255, 0, asciiChars.length - 1));
      line += asciiChars[level];
    }
    asciiArt.push(line);
  }
}

function draw() {
  background(0);
  fill(255);
  let totalH = asciiArt.length * cellSize;
  let startY = (height - totalH) / 2;
  for (let i = 0; i < asciiArt.length; i++) {
    text(asciiArt[i], width / 2, startY + i * cellSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateAsciiArt();
}
