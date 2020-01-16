// ========= VARS ========== //
// ========= VARS ========== //
"use strict"
//NIEUWE CANVAS AANMAKEN
let canvas;

let liveData = true;
// fill in kinectron ip address here ie. "127.16.231.33"
let kinectronIpAddress = "10.3.208.29";
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

//colors
let colors=[];
colors[0] = [114, 160, 96] ;
colors[1] = [202, 80, 93];
colors[2] = [229, 139, 79];
colors[3] = [244, 234, 94];
colors[4] = [111, 127, 193];


// KLEUR VARIABELE

// // (BLUE) #6F7FC1 rgb(111, 127, 193)
// // (YELLOW) #F4EA5E rgb(244, 234, 94)
// // (ORANGE) #E58B4F  rgb(229, 139, 79)
// // (RED) #CA505D rgb(202, 80, 93)
// // (GREEN) #72A060 rgb(114, 160, 96)

//index voor brush te kiezen
let brushindex = [];
// Timer voor refresh variables
let timer = 90;
//preload the images to use
function preload() {
  if (!liveData) {
    recorded_skeleton = loadJSON(recorded_data_file);
  }
  brushes[0] = loadImage("img/greenBrush.png");
  brushes[1] = loadImage("img/redBrush.png");
  brushes[2] = loadImage("img/orangeBrush.png");
  brushes[3] = loadImage("img/yellowBrush.png");
  brushes[4] = loadImage("img/blueBrush.png");
}

// ========= SETUP ========== //
// ========= SETUP ========== //

function setup() {
  colorMode(RGB, 255, 255, 255, 100);
  createCanvas(innerWidth, innerHeight);
  background(255,255,255,100);
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
  $("nav li").removeClass("hoverBrush");
  for (let key in newHands) {
    let trackedHand = newHands[key];
    if (body.trackingId in newHands) {
      if (typeof brushindex[key] === "undefined") {
        brushindex[key] = 0
      }
      //BLUE BRUSH//
      //BLUE BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width < (width / 2 - 200) && trackedHand.joints[11].depthX * width > (width / 2 - 300))) {
        brushindex[key] = 0;
        $("nav li.green").addClass("hoverBrush");
      }
      //YELLOW BRUSH//
      //YELLOW BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width < (width / 2 - 100) && trackedHand.joints[11].depthX * width > (width / 2 - 200))) {
        brushindex[key] = 1;
        $("nav li.gold").addClass("hoverBrush");
      }
      //ORANGE BRUSH//
      //ORANGE BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width < (width / 2) && trackedHand.joints[11].depthX * width > (width / 2 - 100))) {
        brushindex[key] = 2;
        $("nav li.blue").addClass("hoverBrush");
      }
      //RED BRUSH//
      //RED BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width > (width / 2) && trackedHand.joints[11].depthX * width < (width / 2 + 100))) {
        brushindex[key] = 3;
        $("nav li.pink").addClass("hoverBrush");
      }
      //GREEN BRUSH//
      //GREEN BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width > (width / 2 + 100) && trackedHand.joints[11].depthX * width < (width / 2 + 200))) {
        brushindex[key] = 4;
        $("nav li.orange").addClass("hoverBrush");
      }
    }
    //size of brush + Check handstate + draw hands
    let size = (trackedHand.joints[11].cameraZ * 4) * 10;
    trackedHand.rightHandState = translateHandState(trackedHand.rightHandState);
    drawHands(trackedHand, size, brushindex[key]);

  }
  //zet body in hands object
  newHands[body.trackingId] = body;
  
  //count users
  var count = Object.keys(newHands).length;
  if (count == 1) {
    $("#firstPlayer").addClass("popupUser")
  } else if (count == 2) {
    $("#secondPlayer").addClass("popupUser")
  } else if (count > 2) {
  }

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
function drawHands(hands, size, brush,key) {
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
    canvas.draw(hand,brush,size)
  }

  if (handState === 0) {  

  
    image(brushes[brush], hand.depthX * width, hand.depthY * height, size, size);
  }
}

let cursorSketch = function (cs) {
  cs.setup = function () {
    cs.colorMode(RGB, 255, 255, 255, 100);
    cs.createCanvas(innerWidth, innerHeight);
    cs.background(255, 255, 255, 0);
    cs.smooth(10);
  }
  cs.draw = function (hand,brush,size) {
    cs.clear();
    cs.fill(colors[brush][0],colors[brush][1],colors[brush][2]);
    cs.stroke(0,0,0,70);
    cs.strokeWeight(0.3);
    cs.ellipse(hand.depthX * width, hand.depthY * height,30,30);
    cs.fill(colors[brush][0],colors[brush][1],colors[brush][2],40);
    cs.noStroke();
    cs.ellipse(hand.depthX * width +2, hand.depthY * height+2,30,30);
  }
}
canvas = new p5(cursorSketch);
console.log(canvas);
jQuery(document).ready(function () {
  setInterval(() => {
    let barWidth = $("#timeBar").width() - ($("#timeBar").width()/timer);
    $("#timerClock").html(timer);
    $("#timeBar").css({ "width": barWidth });
    timer--;
    
    if (timer == 0) {
      timer = 20;
      $("#timeBar").css({"width": "100%"});
      // CODE VOOR RESULTAAT OP TE SLAAN
      // downloadCanvas();
    }
  }, 1000);



  function downloadCanvas() {
    console.log('downloadCanvas');

    var canvas = document.getElementById("defaultCanvas0");
    var base64String = canvas.toDataURL("image/jpg");
    //  download(base64String);
    $(".downloadImage").submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/uploadImage",
        data: {
          "photo": base64String
        }, // serializes the form's elements.
        success: function (data) {
          console.log(data);
          window.location.replace("pages/result.html");
          // background(255); // show response from the php script.
        }
      });
    });
    $(".downloadImage").submit();
  }

  
});