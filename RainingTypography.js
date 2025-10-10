let letters = [];
let word = "sunlight";
let nextLetterIndex = 0;
let gravity = 0.4;
let damping = 0.35;
let rotationDamping = 0.95;
let mouseHeld = false;
let dropInterval = 20;
let lastDropTime = 0;
let spreadRadius = 0;
let mousePressX = 0;
let spreadSpeed = 5;

function setup() {
  createCanvas(800, 600);
  background(0);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);

  if (mouseHeld && millis() - lastDropTime > dropInterval) {
    dropLetter();
    lastDropTime = millis();
    spreadRadius = min(spreadRadius + spreadSpeed, width / 2);
  }

  for (let i = letters.length - 1; i >= 0; i--) {
    let l = letters[i];

    // 물리 효과 적용
    l.vy += gravity;
    l.x += l.vx;
    l.y += l.vy;
    l.rotation += l.rotationSpeed;

    // 바닥 충돌
    if (l.y + l.size / 2 > height) {
      l.y = height - l.size / 2;
      l.vy *= -damping;
      if (l.vx === 0) l.vx = random(-3, 3);
      else l.vx *= 0.9;
      l.rotationSpeed *= rotationDamping;
      if (abs(l.vy) < 0.5) l.vy = 0;
    }

    // 벽 충돌
    if (l.x - l.size / 2 < 0 || l.x + l.size / 2 > width) {
      l.vx *= -damping;
      l.rotationSpeed *= -1;
      if (l.x - l.size / 2 < 0) l.x = l.size / 2;
      else l.x = width - l.size / 2;
    }

    // 천장 충돌
    if (l.y - l.size / 2 < 0) {
      l.y = l.size / 2;
      l.vy *= -damping;
      l.rotationSpeed *= rotationDamping;
    }

    // 글자 그리기
    push();
    translate(l.x, l.y);
    rotate(l.rotation);
    fill(0, 149, 255, l.opacity);
    noStroke();
    textSize(l.size);
    text(l.char, 0, 0);
    pop();

    // 바닥에 멈춘 후 페이드아웃
    if (l.y === height - l.size / 2 && l.vy === 0) {
      l.opacity -= 2;
      if (l.opacity <= 0) letters.splice(i, 1);
    }
  }
}

function dropLetter() {
  if (nextLetterIndex < word.length) {
    let xPos = mousePressX + random(-spreadRadius, spreadRadius);
    xPos = constrain(xPos, 0, width);
    let newLetter = {
      char: word[nextLetterIndex],
      x: xPos,
      y: 50,
      vx: 0,
      vy: 0,
      size: random(15, 25),
      opacity: 255,
      rotation: 0,
      rotationSpeed: random(-0.1, 0.1)
    };
    letters.push(newLetter);
    nextLetterIndex++;
    if (nextLetterIndex >= word.length) nextLetterIndex = 0;
  }
}

function mousePressed() {
  mouseHeld = true;
  mousePressX = mouseX;
  spreadRadius = 0;
  dropLetter();
  lastDropTime = millis();
}

function mouseReleased() {
  mouseHeld = false;
  spreadRadius = 0;
}

function keyPressed() {
  if (key === ' ') {
    letters = [];
    nextLetterIndex = 0;
    background(0);
  }
}