/*
 * Writed by
 * (c) 2020 
 * Toon, Wouter, Julien, Tom, Andres
 * JQUERY: https://code.jquery.com/jquery-3.4.1.min.js
 */
"use strict"

let liveData = true;
// fill in kinectron ip address here ie. "127.16.231.33"
let kinectronIpAddress = "10.3.208.27";
// declare kinectron
let kinectron = null;
let newHands = {};

//preload the images to use


// ========= SETUP ========== //
// ========= SETUP ========== //

function setup() {
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
      
      
    }
   
    
   

  }
  newHands[body.trackingId] = body;
  var count = Object.keys(newHands).length;
  if (count == 1) {
    window.location.replace("pages/tutorial.html");
  } 

}

















