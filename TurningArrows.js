// 마우스를 향해 도는 화살표 배경
// 33x33 그리드의 화살표들이 마우스 방향을 향해 8방향으로 스냅하며 회전

let arrows = [];
let cols, rows;
let cellSize;

class Arrow {
  constructor(x, y, col, row) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.row = row;
    this.currentAngle = 0;
    this.targetAngle = 0;
    this.angularVelocity = 0;
    this.delay = random(0, 10); // 0-10ms 랜덤 지연 (빠른 반응)
    this.delayTimer = 0;
    this.isMoving = false;
    
    // 물리 파라미터 (빠른 반응)
    this.maxAngularVelocity = 720; // 720°/s (2배 빠르게)
    this.angularAcceleration = 2400; // 2400°/s² (2배 빠르게)
    this.snapThreshold = 2; // 2° 이내면 스냅
    this.decelerationThreshold = 20; // 20° 이내면 감속
  }
  
  update() {
    // 마우스 방향 계산
    let mouseAngle = atan2(mouseY - this.y, mouseX - this.x) * 180 / PI;
    
    // 8방향으로 스냅 (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
    let snappedAngle = round(mouseAngle / 45) * 45;
    
    // 새로운 목표 각도가 설정되면 지연 타이머 시작
    if (snappedAngle !== this.targetAngle) {
      this.targetAngle = snappedAngle;
      this.delayTimer = this.delay;
      this.isMoving = false;
    }
    
    // 지연 처리
    if (this.delayTimer > 0) {
      this.delayTimer -= 16.67; // 약 60fps 기준
      return;
    }
    
    this.isMoving = true;
    
    // 최단 경로 계산 (-180° ~ 180° 범위로 정규화)
    let angleDiff = this.targetAngle - this.currentAngle;
    while (angleDiff > 180) angleDiff -= 360;
    while (angleDiff < -180) angleDiff += 360;
    
    // 스냅 체크
    if (abs(angleDiff) < this.snapThreshold) {
      this.currentAngle = this.targetAngle;
      this.angularVelocity = 0;
      return;
    }
    
    // 가속도 적용
    let direction = angleDiff > 0 ? 1 : -1;
    this.angularVelocity += this.angularAcceleration * direction * (1/60); // 60fps 기준
    
    // 감속 구간
    if (abs(angleDiff) < this.decelerationThreshold) {
      let slowVelocity = map(abs(angleDiff), 0, this.decelerationThreshold, 120, this.maxAngularVelocity);
      this.angularVelocity = constrain(abs(this.angularVelocity), 0, slowVelocity) * direction;
    } else {
      // 최대 속도 제한
      this.angularVelocity = constrain(this.angularVelocity, -this.maxAngularVelocity, this.maxAngularVelocity);
    }
    
    // 각도 업데이트
    this.currentAngle += this.angularVelocity * (1/60); // 60fps 기준
    
    // 각도 정규화
    while (this.currentAngle >= 360) this.currentAngle -= 360;
    while (this.currentAngle < 0) this.currentAngle += 360;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.currentAngle));
    
    // 화살표 스타일
    stroke(255);
    noFill();
    strokeWeight(max(1, cellSize * 0.04));
    
    // 화살표 크기 계산 (작게 조정)
    let shaftLength = 0.6 * cellSize;
    let arrowheadLength = 0.5 * cellSize;
    
    // 화살표 몸통 (선)
    line(-shaftLength/2, 0, shaftLength/2, 0);
    
    // 화살촉 (ㄱ자 모양) - 더 길게
    let headX = shaftLength/2;
    let headSize = arrowheadLength * 0.5; // 0.3에서 0.5로 증가
    line(headX, 0, headX - headSize, -headSize);
    line(headX, 0, headX - headSize, headSize);
    
    pop();
  }
}

function setup() {
  // 정사각형 캔버스 크기 계산
  let canvasSize = min(windowWidth, windowHeight);
  createCanvas(canvasSize, canvasSize);
  
  // 33x33 그리드 설정 (2/3으로 줄임)
  cols = 33;
  rows = 33;
  cellSize = canvasSize / cols;
  
  // 화살표 생성
  arrows = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = (col + 0.5) * cellSize;
      let y = (row + 0.5) * cellSize;
      arrows.push(new Arrow(x, y, col, row));
    }
  }
}

function draw() {
  background(0);
  
  // 모든 화살표 업데이트 및 그리기
  for (let arrow of arrows) {
    arrow.update();
    arrow.display();
  }
  
  // 그리드 라인 표시 (디버그용, 선택사항)
  if (keyIsPressed && key === 'g') {
    stroke(50);
    strokeWeight(1);
    for (let i = 0; i <= cols; i++) {
      line(i * cellSize, 0, i * cellSize, height);
    }
    for (let i = 0; i <= rows; i++) {
      line(0, i * cellSize, width, i * cellSize);
    }
  }
}

function windowResized() {
  // 정사각형 캔버스로 리사이즈
  let canvasSize = min(windowWidth, windowHeight);
  resizeCanvas(canvasSize, canvasSize);
  
  // 그리드 재계산
  cellSize = canvasSize / cols;
  
  // 화살표 위치 재조정
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index < arrows.length) {
        arrows[index].x = (col + 0.5) * cellSize;
        arrows[index].y = (row + 0.5) * cellSize;
        index++;
      }
    }
  }
}
