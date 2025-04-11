//press f to full screen

let leftStache = [];
let rightStache = [];
let leftAngle = 180;
let rightAngle = 0;
let flash = false;
let flashStartTime;
let currentBgColor;
let audio;


function preload() {
  audio = loadSound('passthepeas.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noScroll();
  initStache();
  flashStartTime = millis(); 
}

function noScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initStache();
}

function initStache() {
  leftStache = [];
  rightStache = [];
  let baseY = height / 2 + 20;
  leftStache.push(createVector(width / 2 - 5, baseY));
  rightStache.push(createVector(width / 2 + 5, baseY));
  leftAngle = 180;
  rightAngle = 0;
}

function draw() {
  if (!flash && millis() - flashStartTime > 10000) {
    flash = true;
    currentBgColor = color(random(255), random(255), random(255));
  }

  if (flash) {
    if (frameCount % 33 === 0) {
      currentBgColor = color(random(255), random(255), random(255));
    }
    background(currentBgColor);
  } else {
    background(255);
  }
  if (millis() - flashStartTime > 10000 && !audio.isPlaying()) {
    audio.play();
  }
  drawFace();
  drawTopHat();
  growHandlebar(leftStache, -1);
  growHandlebar(rightStache, 1);
}


function keyPressed() {
  if (keyCode === 70) {
    let full = fullscreen();
    fullscreen(!full); 
  }
}


function drawFace() {
  
  let cx = width / 2;
  let cy = height / 2;
  fill(255, 220, 185);
  noStroke();
  ellipse(cx, cy, 193, 180);
  
  fill(0);
  ellipse(cx - 25, cy - 20, 10, 10);
  ellipse(cx + 25, cy - 20, 10, 10);
  
  push();
  noFill();
  stroke(200,180,0);
  strokeWeight(8);
  ellipse(cx + 25, cy - 20, 40, 40);
  pop();
  
  fill(0);
  stroke(0);
  line(cx, cy - 10, cx, cy + 10);
  
  noFill();
  arc(cx, cy + 35, 30, 15, 0, 180);
}

function drawTopHat() {
  let cx = width / 2;
  let cy = height / 2;

  fill(0);
  rectMode(CENTER);
  rect(cx, cy - 100, 100, 80,20);
  rect(cx, cy - 60, 160, 15,20);
}

function growHandlebar(path, direction) {
 
  stroke(0);
  strokeWeight(14);
  noFill();

  beginShape();
  for (let p of path) {
    vertex(p.x, p.y);
  }
  endShape();

  if (frameCount % 2 === 0) {
    let last = path[path.length - 1];

    if (direction < 0) {
      leftAngle += random(-18, 18); 
      let step = p5.Vector.fromAngle(radians(leftAngle));
      step.setMag(2);
      
      path.push(p5.Vector.add(last, step));
      
    } else {
      
      rightAngle += random(-18, 18);
      let step = p5.Vector.fromAngle(radians(rightAngle));
      step.setMag(2);
      
      path.push(p5.Vector.add(last, step));
    }
  }
}