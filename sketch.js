let video, bodyPose, poses = [];
let timpDrept = 0, timpTotal = 0;

function preload() {
  bodyPose = ml5.bodyPose();
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('camera-container');
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  bodyPose.detectStart(video, results => { poses = results; });
}

function draw() {
  image(video, 0, 0, 640, 480);
  if (poses.length > 0) {
    let pose = poses[0];
    if (pose.nose && pose.left_shoulder && pose.right_shoulder) {
      let dV = ((pose.left_shoulder.y + pose.right_shoulder.y) / 2) - pose.nose.y; 
      timpTotal++;
      let aplecat = dV < 105;
      if (!aplecat) timpDrept++;

      let scor = (timpDrept / timpTotal) * 100;
      document.getElementById('ui-scor').innerText = floor(scor) + "%";
      document.getElementById('status').innerText = aplecat ? "⚠️ STAI DREPT!" : "CORECT ✅";
      document.getElementById('status').style.color = aplecat ? "red" : "#00ff88";
      
      stroke(aplecat ? "red" : "#00ff88");
      strokeWeight(5);
      line(pose.left_shoulder.x, pose.left_shoulder.y, pose.right_shoulder.x, pose.right_shoulder.y);
    }
  }
}