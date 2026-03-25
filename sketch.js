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
    if (pose.nose && pose.left_shoulder && pose.right_shoulder && pose.left_ear) {
      // 1. Calcul Postură Gât
      let dV = ((pose.left_shoulder.y + pose.right_shoulder.y) / 2) - pose.nose.y; 
      // 2. Calcul Tensiune Umeri (distanța ureche-umăr)
      let tensiune = pose.left_shoulder.y - pose.left_ear.y;

      timpTotal++;
      let aplecat = dV < 105;
      let incordat = tensiune < 50;

      if (!aplecat && !incordat) timpDrept++;

      // Update UI
      let scor = (timpDrept / timpTotal) * 100;
      document.getElementById('ui-scor').innerText = floor(scor) + "%";
      
      // Update Card Status
      let st = document.getElementById('ui-status');
      st.innerText = aplecat ? "⚠️ APLECAT" : "CORECT ✅";
      document.getElementById('card-status').className = aplecat ? "card error" : "card";
      st.className = aplecat ? "value bad" : "value";

      // Update Card Umeri
      let um = document.getElementById('ui-umeri');
      um.innerText = incordat ? "🚨 INCORDATI" : "OPTIMĂ";
      document.getElementById('card-umeri').className = incordat ? "card error" : "card";
      um.className = incordat ? "value bad" : "value";

      // Desenăm linia umerilor
      stroke(aplecat || incordat ? "#ff4444" : "#00ff88");
      strokeWeight(5);
      line(pose.left_shoulder.x, pose.left_shoulder.y, pose.right_shoulder.x, pose.right_shoulder.y);
    }
  }
}
