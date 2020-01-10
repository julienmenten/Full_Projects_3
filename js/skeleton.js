// ========= VARS ========== //
// ========= VARS ========== //

console.log("jquery ready")
let liveData = true;
// fill in kinectron ip address here ie. "127.16.231.33"
let kinectronIpAddress = "10.3.208.104";
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
let brushindex = [];

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
  $("nav li").removeClass("hoverBrush");

  for (let key in newHands) {
    let trackedHand = newHands[key];
    
    if (body.trackingId in newHands) {
      if (typeof brushindex[key] === "undefined") {        
        brushindex[key] = 0
      }
      //GREEN BRUSH//
      //GREEN BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX *width< (width / 2 - 200) && trackedHand.joints[11].depthX * width > (width / 2 - 300))) {
        brushindex[key] = 0;
        $("nav li.green").addClass("hoverBrush");
      } 
      //GOLD BRUSH//
      //GOLD BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width < (width / 2 - 100) && trackedHand.joints[11].depthX * width > (width / 2 - 200))) {
        brushindex[key] = 1;
        $("nav li.gold").addClass("hoverBrush");
      }
      //BLUE BRUSH//
      //BLUE BRUSH//
       else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width < (width / 2) && trackedHand.joints[11].depthX *width> (width / 2 - 100))) {
        brushindex[key] = 2;
        $("nav li.blue").addClass("hoverBrush");
      } 
      //PINK BRUSH//
      //PINK BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX *width> (width / 2) && trackedHand.joints[11].depthX *width< (width / 2 + 100))) {
        brushindex[key] = 3;
        $("nav li.pink").addClass("hoverBrush");
      } 
      //ORANGE BRUSH//
      //ORANGE BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX *width> (width / 2 + 100) && trackedHand.joints[11].depthX * width<(width / 2 + 200))) {
        brushindex[key] = 4;
        $("nav li.orange").addClass("hoverBrush");
      }
      //BLACK BRUSH//
      //BLACK BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX *width> (width / 2 + 200) && trackedHand.joints[11].depthX *width< (width / 2 + 300))) {
        brushindex[key] = 5;
        $("nav li.black").addClass("hoverBrush");
      }
    }
    //size of brush
    let size = (trackedHand.joints[11].cameraZ * 2) * 15;
    trackedHand.rightHandState = translateHandState(trackedHand.rightHandState);
    drawHands(trackedHand, size, brushindex[key]);

  }
  newHands[body.trackingId] = body;

  //count users
  var count = Object.keys(newHands).length;
  // console.log(count);

  if (count == 1) {
    $(".user").removeClass("popupUser");
    $("nav li").first().find(".color-user").addClass("blackBG");
    $("#firstPlayer").find(".color-user").addClass("blackBG");
    $("#firstPlayer").addClass("popupUser");
  } else if (count == 2) {
    $("#secondPlayer").addClass("popupUser");
    $("#secondPlayer").find(".color-user").addClass("redBG");
    $("nav li:nth-child(2)").find(".color-user").addClass("redBG");
  }else if (count > 2){
    console.log("meer dan 2");
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
    //  image(brushes[1],hand.depthX * width, hand.depthY * height, size,size);
  }

  if (handState === 0) {
    
    image(brushes[brush], hand.depthX * width, hand.depthY * height, size, size);

  }
}