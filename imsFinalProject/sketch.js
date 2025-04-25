
const CAP_W       = 640;      
const CAP_H       = 480;
const LERP_FACTOR = 0.08;      
const BBOX_MARGIN = 1.4;      
const SCAN_LINES  = 4;       

let video;
let detections   = [];         
let cx=0, cy=0, zoom=1;       
let tx=0, ty=0, ts=1;          

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(
    { video: { width: CAP_W, height: CAP_H } },
    camReady
  );
  video.hide();

  textFont('monospace');
  textSize(12);
}

function camReady() {
  const opts = { withLandmarks:false, withDescriptors:false, minConfidence:0.5 };
  // faceapi   = ml5.faceApi(video, opts, modelReady);
}

function windowResized(){ resizeCanvas(windowWidth, windowHeight); }

function draw() {
  background(0);

  updateCameraTarget();
  cx = lerp(cx, tx, LERP_FACTOR);
  cy = lerp(cy, ty, LERP_FACTOR);
  // zoom = lerp(zoom, ts, LERP_FACTOR);

  const cover = max(width/CAP_W, height/CAP_H);  

  push();
  translate(width/2, height/2);
  scale(cover * zoom);
  translate(-cx, -cy);
  image(video, 0, 0, CAP_W, CAP_H);
  drawBoxes();          
  pop();

  tintGreen();
  drawHUD();
}

function updateCameraTarget() {
  if(!detections.length){ tx=CAP_W/2; ty=CAP_H/2; ts=1; return; }

  let l=1e6,r=0,t=1e6,b=0;
  detections.forEach(d=>{
    const b0=d.alignedRect._box;
    l=min(l,b0._x); r=max(r,b0._x+b0._width);
    t=min(t,b0._y); b=max(b,b0._y+b0._height);
  });
  const w=r-l, h=b-t, cx0=l+w/2, cy0=t+h/2;
  const s=min(CAP_W/(w*BBOX_MARGIN), CAP_H/(h*BBOX_MARGIN));
  tx=cx0; ty=cy0; ts=constrain(s,1,5);
}

function tintGreen(){
  loadPixels();
  for(let i=0;i<pixels.length;i+=4){
    const g=(pixels[i]+pixels[i+1]+pixels[i+2])/3;
    pixels[i]=g*0.4; pixels[i+1]=g*0.9; pixels[i+2]=g*0.4;
  }
  updatePixels();
}

function drawBoxes(){
  noFill(); stroke(0,255,0,160); strokeWeight(2/zoom);
  detections.forEach(d=>{
    const b=d.alignedRect._box;
    rect(b._x,b._y,b._width,b._height);
  });
}

function drawHUD(){

  stroke(0,90); strokeWeight(1);
  for(let y=0;y<height;y+=SCAN_LINES) line(0,y,width,y);

  noStroke(); fill(0,255,0);
  const t=nf(hour(),2)+':'+nf(minute(),2)+':'+nf(second(),2);
  text('CAM 01  '+t,10,height-10);
  fill(frameCount%30<15?color(255,0,0):color(0,255,0));
  text('REC',width-46,20);
}
