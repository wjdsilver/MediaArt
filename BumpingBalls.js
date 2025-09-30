let balls = [];

class Ball {
  constructor(x, y, radius, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.mass = radius; // 질량은 반지름과 비례
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // 벽과 충돌하면 반사되도록 처리
    if (this.x - this.radius <= 0 || this.x + this.radius >= width) {
      this.vx = -this.vx;
      this.x = constrain(this.x, this.radius, width - this.radius);
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= height) {
      this.vy = -this.vy;
      this.y = constrain(this.y, this.radius, height - this.radius);
    }
  }

  display() {
    push();
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = this.color.toString();
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.radius * 2);
    pop();
  }

  checkCollision(other) {
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = sqrt(dx * dx + dy * dy);
    return distance < (this.radius + other.radius);
  }

  collideWith(other) {
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance === 0) return;

    // 충돌 벡터
    let nx = dx / distance;
    let ny = dy / distance;

    // 상대 속도
    let relativeVx = other.vx - this.vx;
    let relativeVy = other.vy - this.vy;

    // 충돌 방향의 상대 속도
    let speed = relativeVx * nx + relativeVy * ny;
    if (speed > 0) return;

    let restitution = 0.8;

    let impulse = (2 * speed) / (this.mass + other.mass) * restitution;

    this.vx += impulse * other.mass * nx;
    this.vy += impulse * other.mass * ny;
    other.vx -= impulse * this.mass * nx;
    other.vy -= impulse * this.mass * ny;
  }
}

function setup() {
  createCanvas(800, 600);
  background(0);
  let radii = [50, 50, 40, 30, 30];
  let colors = [
    color(255, 0, 0),
    color(255, 255, 0),
    color(0, 255, 0),
    color(255, 100, 200),
    color(0, 0, 255)
  ];
  for (let i = 0; i < radii.length; i++) {
    let r = radii[i];
    let angle = random(TWO_PI);
    let vx = cos(angle) * 5;
    let vy = sin(angle) * 5;
    let x = random(r, width - r);
    let y = random(r, height - r);
    let c = colors[i];
    balls.push(new Ball(x, y, r, vx, vy, c));
  }
}

function draw() {
  background(0);

  // 공들 사이 충돌 검사
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      if (balls[i].checkCollision(balls[j])) {
        balls[i].collideWith(balls[j]);
      }
    }
  }

  for (let ball of balls) {
    ball.update();
    ball.display();
  }
}
