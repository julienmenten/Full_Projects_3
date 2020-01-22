/*
 * Writed by
 * (c) 2020 
 * Toon, Wouter, Julien, Tom, Andres
 * JQUERY: https://code.jquery.com/jquery-3.4.1.min.js
 */
"use strict"
// ========= CONSTANTS ========== //
// ========= CONSTANTS ========== //
//NIEUWE CANVAS AANMAKEN
let canvas;

let liveData = true;
// fill in kinectron ip address here ie. "127.16.231.33"
let kinectronIpAddress = "10.3.208.27";
// declare kinectron
let kinectron = null;
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
//position
let lastX = [];
let lastY = [];



//preload the images to use


// ========= SETUP ========== //
// ========= SETUP ========== //

function setup() {
  colorMode(RGB, 255, 255, 255, 100);
  createCanvas(innerWidth, innerHeight);
  background(255, 255, 255, 100);
  frameRate(100);
  imageMode(CENTER);
  noStroke();

  if (liveData) {
    initKinectron();

  }
}
// ========= INIT THE KINECTRON ========== //
// ========= INIT THE KINECTRON ========== //
function initKinectron() {
  kinectron = new Kinectron(kinectronIpAddress);
  kinectron.makeConnection();
  // request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);
}



// ========= TRACK THE BODY ========== //
// ========= TRACK THE BODY ========== //
function bodyTracked(body) {
  for (let key in newHands) {
    let trackedHand = newHands[key];
    if (body.trackingId in newHands) {
       if (trackedHand.joints[11].depthX * width > width - 100 && (trackedHand.joints[11].depthY * height < (height/2 + 60) && trackedHand.joints[11].depthY * height > (height/2 ))) {
        window.location.replace("../pages/paint.html");
        console.log("werkt");
      }
      
    }
   
    trackedHand.rightHandState = translateHandState(trackedHand.rightHandState);
    drawHands(trackedHand, key);

  }
  //zet body in hands object
  newHands[body.trackingId] = body;


}


// ========= TRANSLATE THE HAND STATE ========== //
// ========= TRANSLATE THE HAND STATE ========== //
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
function drawHands(hands, key) {
  updateHandState(hands.rightHandState, hands.joints[11], key);
}
// ========= UPDATE HAND STATE ========== //
// ========= UPDATE HAND STATE ========== //
// find out state of hands
function updateHandState(handState, hand, key) {
  switch (handState) {
    case "closed":
      // drawHand(hand, 1, key);
      break;

    case "open":
      drawHand(hand, 0, key);
      break;

    case "lasso":
      // drawHand(hand, 0, size);
      break;

  }
}







// ========= DRAW ON CANVAS ========== //
// ========= DRAW ON CANVAS ========== //
// draw the hands based on their state
function drawHand(hand, handState, key) {

  if (handState === 1) {
    canvas.draw(hand)
    lastX[key]=hand.depthX;
    lastY[key]=hand.depthY;
  }

  if (handState === 0) {
    canvas.draw(hand)
    lastX[key]=hand.depthX;
    lastY[key]=hand.depthY;
    
  }
}

let cursorSketch = function (cs) {
  cs.setup = function () {
    cs.colorMode(RGB, 255, 255, 255, 100);
    cs.createCanvas(innerWidth, innerHeight);
    cs.background(255, 255, 255, 0);
    cs.smooth(10);
    $("#defaultCanvas1").addClass("result")
  }
  cs.draw = function (hand) {
    cs.clear();
    cs.fill(0,0,0);
    cs.stroke(0, 0, 0, 70);
    cs.strokeWeight(0.3);
    cs.ellipse(hand.depthX * width, hand.depthY * height, 30, 30);
    cs.fill(0,0,0, 40);
    cs.noStroke();
    cs.ellipse(hand.depthX * width + 2, hand.depthY * height + 2, 30, 30);
  }
}




canvas = new p5(cursorSketch);
console.log(canvas);
