// ========= VARS ========== //
// ========= VARS ========== //


var liveData = true;
// fill in kinectron ip address here ie. "127.16.231.33"
var kinectronIpAddress = "10.3.208.70";
// declare kinectron
var kinectron = null;
var lastX;
var lastY;
// drawHand variables
var start = 30;
var target = 100;
var diameter = start;
var light = 255;
var dark = 100;
var hueValue = light;
var lerpAmt = 0.3;
var state = "ascending";
//brush selection
var brushcounter = {};
var brushes = [];
//hands maken
var handColors = {};
var newHands = {};
// recorded data variables
var sentTime = Date.now();
var currentFrame = 0;
var recorded_skeleton;
var recorded_data_file = "./recorded_skeleton.json";
var brushindex = [];
// Timer voor refresh variables
var timer = 15;

console.log(brushcounter);

function preload() {
  if (!liveData) {
    recorded_skeleton = loadJSON(recorded_data_file);
  }
}




// ========= SETUP ========== //
// ========= SETUP ========== //
function setup() {
  colorMode(RGB, 255, 255, 255, 100);
  createCanvas(innerWidth, innerHeight);
  background(255);
  frameRate(100);
  imageMode(CENTER);
  noStroke();

  if (liveData) {
    initKinectron();

  }
}

function draw() {
  if (!liveData) loopRecordedData();

}


// ========= RECORD THE DATA ========== //
// ========= RECORD THE DATA ========== //
function loopRecordedData() {
  // send data every 20 seconds
  if (Date.now() > sentTime + 20) {
    bodyTracked(recorded_skeleton[currentFrame]);
    sentTime = Date.now();

    if (currentFrame < Object.keys(recorded_skeleton).length - 1) {
      currentFrame++;
    } else {
      currentFrame = 0;
    }
  }
}

// ========= INIT THE KINECTRON ========== //
// ========= INIT THE KINECTRON ========== //
function initKinectron() {
  // define and create an instance of kinectron
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to "azure" or "windows"
  // kinectron.setKinectType("windows");

  // connect with application over peer
  kinectron.makeConnection();
  // 
  // request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);
  // kinectron.startTrackedJoint(kinectron.HANDRIGHT,makeArray);
}



// ========= TRACK THE BODY ========== //
// ========= TRACK THE BODY ========== //
function bodyTracked(body) {
  for (let key in newHands) {
    let trackedHand = newHands[key];
    if (body.trackingId in newHands) {
    }
    //size of brush
    trackedHand.rightHandState = translateHandState(trackedHand.rightHandState);
    drawHands(trackedHand);
  }
  newHands[body.trackingId] = body;


}


// ========= TRANSLATE THE HAND STATE ========== //
// ========= TRANSLATE THE HAND STATE ========== //
// make handstate more readable
function translateHandState(handState) {
  switch (handState) {
    case 0:
      return "unknown";

    case 1:
      return "notTracked";

    case 2:
      return "open";

    case 3:
      return "closed";

    case 4:
      return "lasso";
  }

}

// draw hands
function drawHands(hands) {
  updateHandState(hands.rightHandState, hands.joints[11]);
}
// ========= UPDATE HAND STATE ========== //
// ========= UPDATE HAND STATE ========== //
// find out state of hands
function updateHandState(handState, handh) {
  switch (handState) {
    case "closed":
      drawHand(hand, 1);
      break;

    case "open":
      drawHand(hand, 0);
      break;

    case "lasso":
      // drawHand(hand, 0, size);
      break;



  }
}




// ========= DRAW ON CANVAS ========== //
// ========= DRAW ON CANVAS ========== //
// draw the hands based on their state
function drawHand(hand, handState, size, brush) {
  if (handState === 1) {
    clear();
    noStroke();
    fill(0, 255, 0);
    rect(hand.depthX * width,hand.depthY * height, 40,50);
  }

  if (handState === 0) {
    clear();
    noStroke();
    fill(0, 255, 0);
    rect(hand.depthX * width,hand.depthY * height, 40,50);
  }
}




