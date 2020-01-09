// ========= VARS ========== //
// ========= VARS ========== //
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
let brushcounter=[];
let brushes = [];
//hands maken
var handColors = {};
let newHands = {};
// recorded data variables
let sentTime = Date.now();
let currentFrame = 0;
let recorded_skeleton;
let recorded_data_file = "./recorded_skeleton.json";
let  img, img1;
function preload() {
  if (!liveData) {
    recorded_skeleton = loadJSON(recorded_data_file);
  }
  brushes[0] = loadImage("img/gras.png");
  brushes[1] = loadImage("img/cursor1.png");
}



// ========= SETUP ========== //
// ========= SETUP ========== //
function setup() {
  colorMode(RGB,255,255,255,100);
  createCanvas(innerWidth, innerHeight);
  background(255);
  frameRate(60);
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


// // ========= COUNT THE USERS ========== //
// // ========= COUNT THE USERS ========== //
// function countUser(){
//   for(userKey in newHands){
//     if(counter == 1){
//      users = 1;
//     }else if(counter == 2){
//       users = 2;
//     }else if(counter > 2){
//       users = 2;
//     }
//     // console.log(users);
//     counter++;
// }
// return users;
// }



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
  // console.log(newHands);
  if (body.trackingId in handColors) {
    // Create color property and give the hand its assigned color
    body.color = handColors[body.trackingId];
  } else {
    // If we don't have a color for the hand yet
    // Create a random RGB color
    var randomColor = [random(255), random(255), random(255)];
    // Create color property on the hand and assign it a random color
    body.color = randomColor;
    // Add it to an array for easy look up
    handColors[body.trackingId] = body.color;
  }
  newHands[body.trackingId] = body;
  
  for(let key in newHands){
    brushcounter[key] = 0;
    let trackedHand = newHands[key];
    //size of brush
    let size = (trackedHand.joints[11].cameraZ *2 ) * 25;
    fill(trackedHand.color[0],trackedHand.color[1],trackedHand.color[2]);
    trackedHand.rightHandState = translateHandState(trackedHand.rightHandState);
    if(trackedHand.rightHandState == "lasso"){
      console.log(brushcounter[key]);
      brushcounter[key] +=1;
      if(brushcounter[key] == 2){
        brushcounter[key] = 0;
      }
    }
    drawHands(trackedHand, size,brushcounter[key]);
  // console.log(newHands[key].bodyIndex);
  }
  var count = Object.keys(newHands).length;
  
  if(count == 1 ){
    document.getElementById("firstPlayer").classList.add('popupUser');
  }else if(count == 2){
    document.getElementById("secondPlayer").classList.add('popupUser');
  
    
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
function drawHands(hands, size,brush) {
  updateHandState(hands.rightHandState, hands.joints[11], size,brush);
}
// ========= UPDATE HAND STATE ========== //
// ========= UPDATE HAND STATE ========== //
// find out state of hands
function updateHandState(handState, hand, size,brush) {
  switch (handState) {
    case "closed":
      drawHand(hand, 1, size,brush);
      break;

    case "open":
      drawHand(hand, 0, size);
      break;

    case "lasso":
      // drawHand(hand, 0, size);
      break;

    
    
  }
}




// ========= DRAW ON CANVAS ========== //
// ========= DRAW ON CANVAS ========== //
// draw the hands based on their state
function drawHand(hand, handState, size,brush) {
  if (handState === 1) {
    image(brushes[brush],hand.depthX * width, hand.depthY * height, size,size);
  }

  if (handState === 0) {
    state = "descending";
    //  image(brushes[1],hand.depthX * width, hand.depthY * height, size,size);
  }










  

}