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

//colors
let colors = [];
colors[0] = [202, 80, 93];
colors[1] = [229, 139, 79];
colors[2] = [244, 234, 94];
colors[3] = [111, 127, 193];
colors[4] = [114, 160, 96];


// KLEUR VARIABELE

// // (BLUE) #6F7FC1 rgb(111, 127, 193)
// // (YELLOW) #F4EA5E rgb(244, 234, 94)
// // (ORANGE) #E58B4F  rgb(229, 139, 79)
// // (RED) #CA505D rgb(202, 80, 93)
// // (GREEN) #72A060 rgb(114, 160, 96)

//index voor brush te kiezen
let brushindex = [];
// Timer voor refresh variables
let timer = 30;
//preload the images to use
function preload() {
  if (!liveData) {
    recorded_skeleton = loadJSON(recorded_data_file);
  }
  brushes[0] = loadImage("../img/redBrush.png");
  brushes[1] = loadImage("../img/orangeBrush.png");
  brushes[2] = loadImage("../img/yellowBrush.png");
  brushes[3] = loadImage("../img/blueBrush.png");
  brushes[4] = loadImage("../img/greenBrush.png");
}

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
  $("nav li").removeClass("hoverBrush");
  for (let key in newHands) {
    let trackedHand = newHands[key];
    if (body.trackingId in newHands) {
      if (typeof brushindex[key] === "undefined") {
        brushindex[key] = 0
      }
      //RED BRUSH//
      //RED BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width < (width / 2 - 300) && trackedHand.joints[11].depthX * width > (width / 2 - 500))) {
        brushindex[key] = 0;
        $(".red").addClass("hoverBrush");
      }
      //ORANGE BRUSH//
      //ORANGE BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width < (width / 2 - 100) && trackedHand.joints[11].depthX * width > (width / 2 - 300))) {
        brushindex[key] = 1;
        $(".orange").addClass("hoverBrush");
      }
      //YELLOW BRUSH//
      //YELLOW BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width < (width / 2 + 100) && trackedHand.joints[11].depthX * width > (width / 2 - 100))) {
        brushindex[key] = 2;
        $(".yellow").addClass("hoverBrush");
      }
      //BLUE BRUSH//
      //BLUE BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width > (width / 2 + 100) && trackedHand.joints[11].depthX * width < (width / 2 + 300))) {
        brushindex[key] = 3;
        $(".blue").addClass("hoverBrush");
      }
      //GREEN BRUSH//
      //GREEN BRUSH//
      else if (trackedHand.joints[11].depthY * height > height - 100 && (trackedHand.joints[11].depthX * width > (width / 2 + 300) && trackedHand.joints[11].depthX * width < (width / 2 + 500))) {
        brushindex[key] = 4;
        $(".green").addClass("hoverBrush");
      }
    }
    //size of brush + Check handstate + draw hands
    let size = (trackedHand.joints[11].cameraZ * 4) * 10;
    trackedHand.rightHandState = translateHandState(trackedHand.rightHandState);
    drawHands(trackedHand, size, brushindex[key], key);

  }
  //zet body in hands object
  newHands[body.trackingId] = body;

  //count users
  var count = Object.keys(newHands).length;
  if (count == 1) {
    $("#firstPlayer").addClass("popupUser")
  } else if (count == 2) {
    $("#secondPlayer").addClass("popupUser")
  } else if (count > 2) {}

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
function drawHands(hands, size, brush, key) {
  updateHandState(hands.rightHandState, hands.joints[11], size, brush, key);
}
// ========= UPDATE HAND STATE ========== //
// ========= UPDATE HAND STATE ========== //
// find out state of hands
function updateHandState(handState, hand, size, brush, key) {
  switch (handState) {
    case "closed":
      drawHand(hand, 1, size, brush, key);
      break;

    case "open":
      drawHand(hand, 0, size, brush, key);
      break;

    case "lasso":
      // drawHand(hand, 0, size);
      break;

  }
}







// ========= DRAW ON CANVAS ========== //
// ========= DRAW ON CANVAS ========== //
// draw the hands based on their state
function drawHand(hand, handState, size, brush, key) {

  if (handState === 1) {
    canvas.draw(hand, brush, size)
    lastX[key]=hand.depthX;
    lastY[key]=hand.depthY;
  }

  if (handState === 0) {
    smooth();
    blendMode(BLEND)
    stroke(colors[brush][0], colors[brush][1], colors[brush][2], 6)
    console.log()
    let randomize = random(5,50);
    
    // line(lastX[key]*width + 10, lastY[key]*height -10, hand.depthX*width + 10, hand.depthY*height - 10);
    // line(lastX[key]*width + 8, lastY[key]*height - 8, hand.depthX*width +8 , hand.depthY*height -8);
    for(let i = 0;i<10;i++){
    line(lastX[key]*width + 10, lastY[key]*height - 10, hand.depthX*width + 10, hand.depthY*height - 10);
    randomize = random(40);
    strokeWeight(randomize);
    line(lastX[key]*width + 6, lastY[key]*height - 6, hand.depthX*width + 6, hand.depthY*height - 6);
    randomize = random(40);
    strokeWeight(randomize);
    line(lastX[key]*width + 3, lastY[key]*height - 3, hand.depthX*width + 3, hand.depthY*height - 3);
    randomize = random(40);
    strokeWeight(randomize);
    line(lastX[key]*width, lastY[key]*height, hand.depthX*width, hand.depthY*height);
    randomize = random(40);
    strokeWeight(randomize);
    line(lastX[key]*width - 3, lastY[key]*height + 3, hand.depthX*width - 3, hand.depthY*height + 3);
    randomize = random(40);
    strokeWeight(randomize);
    line(lastX[key]*width - 6, lastY[key]*height + 6, hand.depthX*width - 6, hand.depthY*height + 6);
    randomize = random(40);
    strokeWeight(randomize);
    line(lastX[key]*width - 10, lastY[key]*height + 10, hand.depthX*width - 10, hand.depthY*height + 10);
    randomize = random(40);
    strokeWeight(randomize);
  }
    // line(lastX[key]*width - 8, lastY[key]*height + 8, hand.depthX*width - 8, hand.depthY*height + 8);
    // line(lastX[key]*width - 10, lastY[key]*height + 10, hand.depthX*width - 10, hand.depthY*height + 10);
    // image(brushes[brush], hand.depthX * width, hand.depthY * height, size, size);
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
  }
  cs.draw = function (hand, brush, size) {
    cs.clear();
    cs.fill(colors[brush][0], colors[brush][1], colors[brush][2]);
    cs.stroke(0, 0, 0, 70);
    cs.strokeWeight(0.3);
    cs.ellipse(hand.depthX * width, hand.depthY * height, 30, 30);
    cs.fill(colors[brush][0], colors[brush][1], colors[brush][2], 40);
    cs.noStroke();
    cs.ellipse(hand.depthX * width + 2, hand.depthY * height + 2, 30, 30);
  }
}


function liveFeedbackPopUp(){
  setTimeout(meesterIn, 5000);
  setTimeout(function(){
      bubbleOut();
      setTimeout(meesterOut, 500);
  }, 12000);
}
function meesterIn(){
  $("#meester img").css("bottom", "0");
  setTimeout(bubbleIn, 1000);
  console.log("popup");
}
function meesterOut(){
  $("#meester img").css("bottom", "-350px");
  console.log("popout");
}

function bubbleIn(){
  $(".speech-bubble").addClass("animate-bubble-in");
  $(".speech-bubble").css("transform", "scale(1)");
}
function bubbleOut(){
  $(".speech-bubble").addClass("animate-bubble-out");
  $(".speech-bubble").css("transform", "scale(0)");
}

canvas = new p5(cursorSketch);
console.log(canvas);
jQuery(document).ready(function () {
  setInterval(() => {
    let barWidth = $("#timeBar").width() - ($("#timeBar").width() / timer);
    $("#timerClock").html(timer);
    $("#timeBar").css({
      "width": barWidth
    });
    timer--;
    if(timer%20 == 0){
      compareDrawing()
    }

    if (timer == 0) {
      timer = 30;
      $("#timeBar").css({
        "width": "100%"
      });
      // CODE VOOR RESULTAAT OP TE SLAAN
      downloadCanvas();
    }
  }, 1000);

  let compareDrawing = () => {
    var canvas = document.getElementById("defaultCanvas0");
    var base64String = canvas.toDataURL("image/jpg");
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/uploadImage",
      data: {
        "photo": base64String
      }, // serializes the form's elements.
      success: function (data) {
        $.ajax({
          type: "post",
          url: "http://localhost:3000/api/pythonVectorScript"
      }).done(function (err) {
          //COMPARE IMAGE WITH DATABASE
          console.log(err);
          $.ajax({
              type: "post",
              url: "http://localhost:3000/api/pythonCompareScript"
          }).done(function (data) {
              console.log(data);
              //GET MOST SIMILAR IMAGE OUT OF DATABASE
              $.ajax({
                  type: "get",
                  url: "http://localhost:3000/api/getSimilarImages"
              }).done(function (data) {
                  console.log(data[4].filename);
                  let imageName = data[4].filename;
                  liveFeedbackPopUp();
                   $("#tijdelijkeImage").attr("src", `../backEnd/artworks/${imageName}.jpg`)
                  
                  
              });
  
          });
      });
        
      }
    });
  }



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
          window.location.replace("../pages/result.html");
          // background(255); // show response from the php script.
        }
      });
    });
    $(".downloadImage").submit();
  }


});