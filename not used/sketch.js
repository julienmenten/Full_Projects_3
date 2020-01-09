var myCanvas = null;
var mode = -1;

// Declare kinectron 
var kinectron = null;

function setup() {
  canvas = createCanvas(500, 500);
  background(0);

  // kinectron = new Kinectron("myusername", {  // enter the username to connect to
  //   "host": "myserver.com", // your personal peer server
  //   "port": "9001", // your portnumber
  //   "path": "/", // your path
  //   "secure": "true" // include parameters per peer.js documentation
  // });

  // Define and create an instance of kinectron
  kinectron = new Kinectron("10.3.208.54");
  // kinectron.setKinectType("windows");
  // kinectron.setKinectType("windows");
  // CONNECT TO MIRCROSTUDIO
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect with application over peer
  kinectron.makeConnection();
  // kinectron.startMultiFrame(["color", "depth", "body"], multiFrameCallback);

  // Set callbacks
  kinectron.setColorCallback(drawFeed);
  kinectron.setDepthCallback(drawFeed);
  kinectron.setInfraredCallback(drawFeed);
}

function draw() {

}

// Choose camera to start based on key pressed
function keyPressed() {
  if (keyCode == TAB) {
    mode++;
    mode%=3;
    //kinectron.stopAll();
    background(0);
  }
  switch(mode){
    case 0:
	    kinectron.startRGB();
      break;
    case 1:      	
    	kinectron.startDepth();
      break;
    case 2:
      kinectron.startInfrared();
      break;
  }
}

function drawFeed(img) {
    console.log(kinectron);

  // Draws feed using p5 load and display image functions  
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0);
  });
}

