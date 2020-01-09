"use strict";
// Declare Kinectron
var kinectron = null;

// Create P5 Canvas
var myCanvas = null;

// Create objects to store and access hands
var handColors = {};
var hands = {};
var bodies = {};
let timer = 0;

function setup() {
  colorMode(RGB);
  myCanvas = createCanvas(innerWidth, innerHeight);
  frameRate(24);
  background(255);
  noStroke();



  // Define and create an instance of kinectron
  var kinectronIpAddress = "10.3.208.54"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect with application over peer
  kinectron.makeConnection();

  // Request right hand and set callback for received hand

  kinectron.startTrackedBodies(drawbodytracked);
  // kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawRightHand);

}


function drawbodytracked(body) {
  


  // kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawRightHand);
  body.rightHandState = translateHandState(body.rightHandState);
  

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
    bodies.body = body;



  }
  updateHandState(body.rightHandState)
  // draw(body.rightHandState);
  // hands.updateHandState(body.rightHandState);
  




}



let lastY = [];
let lastX = [];


function draw(state) {

  // for (var key in bodies.body) {
  var trackedHand = bodies.body;
  console.log(bodies);

  console.log(translateHandState(state));
  if (state == "open") {
    stroke(trackedHand.color[0], trackedHand.color[1], trackedHand.color[2]);
    // stroke(46);
    strokeWeight(20);
    fill(trackedHand.color[0], trackedHand.color[1], trackedHand.color[2]);
    // fill(34, 46, 36);
    line(trackedHand.joints[11].depthX * myCanvas.width, trackedHand.joints[11].depthY * myCanvas.height, lastX[0] * myCanvas.width, lastY[0] * myCanvas.height);
    lastX[0] = trackedHand.joints[11].depthX;
    lastY[0] = trackedHand.joints[11].depthY;
  } else if (state == "closed") {
    console.log(`hand of ${hands[key]} is closed`);
  }

  // }

  timer++
  if (timer == 30000) {
    timer = 0;
    background(255);
  }
}








// function drawRightHand(hand) {
//   // If we already have a color for incoming hand
//   if (hand.trackingId in handColors) {
//     // Create color property and give the hand its assigned color
//     hand.color = handColors[hand.trackingId];

//   } else {
//     // If we don't have a color for the hand yet
//     // Create a random RGB color
//     var randomColor = [random(255), random(255), random(255)];
//     // Create color property on the hand and assign it a random color
//     hand.color = randomColor;
//     // Add it to an array for easy look up
//     handColors[hand.trackingId] = hand.color;
//   }
//   hands.rightHand[hand.trackingId] = hand;}


function translateHandState(handState) {
  switch (handState) {
    case 0:
      console.log("unknown")
      return "unknown";

    case 1:
      console.log("not")
      return "notTracked";

    case 2:
      console.log("open")
      return "open";

    case 3:
      console.log("closed")
      return "closed";

    case 4:
      console.log("lasso")
      return "lasso";

  }
}

function updateHandState(handState) {
  // console.log(handState,hand);
  switch (handState) {
    case "closed":
      draw("closed");
      break;

    case "open":
      // console.log("open");
      draw("open");
      break;

    // case "lasso":
    //   drawHand(hand, 0, 255);
    //   break;

    // create new state for clapping
    // case "clapping":
    //   drawHand(hand, 1, "red");
  }
}