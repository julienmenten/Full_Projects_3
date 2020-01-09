// ========= VARS ========== //
// ========= VARS ========== //

console.log("jquery ready")
let liveData = true;
// fill in kinectron ip address here ie. "127.16.231.33"
let kinectronIpAddress = "10.3.208.54";
// declare kinectron
let kinectron = null;
let lastX;
let lastY;
// drawHand variables
let start = 30;
let target = 100;
let diameter = start;
let light = 255;
let dark = 100;
let hueValue = light;
let lerpAmt = 0.3;
let state = "ascending";
//brush selection
let brushcounter = {};
let brushes = [];
//hands maken
var handColors = {};
let newHands = {};
// recorded data variables
let sentTime = Date.now();
let currentFrame = 0;
let recorded_skeleton;
let recorded_data_file = "./recorded_skeleton.json";
let brushindex=[];

console.log(brushcounter);


function preload() {
  if (!liveData) {
    recorded_skeleton = loadJSON(recorded_data_file);
  }
  brushes[0] = loadImage("img/green.png");
  brushes[1] = loadImage("img/gold.png");
  brushes[2] = loadImage("img/blue.png");
  brushes[3] = loadImage("img/pink.png");
  brushes[4] = loadImage("img/orange.png");
  brushes[5] = loadImage("img/black.png");
}



// ========= SETUP ========== //
// ========= SETUP ========== //
function setup() {
  colorMode(RGB, 255, 255, 255, 100);
  createCanvas(innerWidth, innerHeight);
  background(255);
  frameRate(60);
  imageMode(CENTER);
  noStroke();

  if (liveData) initKinectron();
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
      // console.log("user bestaat al")
      if (trackedHand.joints[11].depthX * width < 100 && (trackedHand.joints[11].depthY * height > 100 && trackedHand.joints[11].depthY * height < 150)) {
        brushindex[key]=2;
      }else if (typeof brushindex[key] === "undefined") {
        // console.log("is er al");
        brushindex[key]=0
      }
    } else {
      // console.log("user bestaat nog niet")
      
    }
    //size of brush
    let size = (trackedHand.joints[11].cameraZ * 2) * 25;
   
    trackedHand.rightHandState = translateHandState(trackedHand.rightHandState);
    drawHands(trackedHand, size, brushindex[key]);
    
  }
  newHands[body.trackingId] = body;
  
  //count users
  var count = Object.keys(newHands).length;

  if (count == 1) {
    $("nav li").first().find(".color-user").addClass("blackBG");
    $("#firstPlayer").find(".color-user").addClass("blackBG");
    $("#firstPlayer").addClass("popupUser");
  } else if (count == 2) {
    $("#secondPlayer").addClass("popupUser");
    $("#secondPlayer").find(".color-user").addClass("redBG");
    $("nav li:nth-child(2)").find(".color-user").addClass("redBG");
  }
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
function drawHands(hands, size, brush) {

  updateHandState(hands.rightHandState, hands.joints[11], size, brush);
}
// ========= UPDATE HAND STATE ========== //
// ========= UPDATE HAND STATE ========== //
// find out state of hands
function updateHandState(handState, hand, size, brush) {
  switch (handState) {
    case "closed":
      drawHand(hand, 1, size, brush);
      break;

    case "open":
      drawHand(hand, 0, size, brush);
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
    // console.log(brushes[brush]);
    //  image(brushes[1],hand.depthX * width, hand.depthY * height, size,size);
  }

  if (handState === 0) {
    state = "descending";
    image(brushes[brush], hand.depthX * width, hand.depthY * height, size, size);

  }
}