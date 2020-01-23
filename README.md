# Project JameSensor

## Benodigdheden
Voor het goed werken van ons project, zijn er een paar nodige software en hardware die je moet hebben zodat alles vlot gaat:
- Krachtige computer met __Windows 10 1903__, HDMI poort & __USB 3.0__ aansluiting
- __Kinect v2__ camera
- __Kinectron__ software
- Text editor (zoals [Visual Studio code](https://code.visualstudio.com/))

## Getting started!
Dit is de stappenplan om het op te zetten van de prototype om demo's te geven:
### Setup
1) Installeer de officiële [Kinect V2 SDK](https://kinectron.github.io/docs/server.html) 
2) Download de [Kinectron server](https://github.com/kinectron/kinectron/releases/tag/0.3.1) 
3) Clone/dowload de files van deze git 
4) Voor dit project is er een Python environment nodig. Volg de tutorial __[hier](https://douglasduhaime.com/posts/identifying-similar-images-with-tensorflow.html )__ om de te onderganen stappen te volgen.
### Uitvoeren van het prototype
1) Server opstarten van Kinectron & het IP address kopiëren
![IP Address van Kinectron](https://imgur.com/fZwaA0j)
2) IP adres veranderen in __js/skeleton.js__
    ```javascript
    let kinectronIpAddress = "IP_ADDRESS_VAN_KINECT";
    ```
3) [node](https://nodejs.org/en/download/) installeren 
4) Terminal openen in __backEnd__ folder
5) NPM modules installeren: 
    ```node
    npm install
    ```
6) Server opstarten via Node
    ```node
    node server.js
    ```
7) Openen van __index.html__
8) __Enjoy!__

## Bronnen
- NPM v6.13.6
    - https://www.npmjs.com/
- P5.js v0.10.2
    - https://p5js.org/
- Python v3.8.1
    - https://www.python.org/
- Anaconda v2019.10
    - https://www.anaconda.com/distribution/
- jQuery v3.4.1
    - https://jquery.com/
-  Python Shell JS node module v1.0.8
    - https://www.npmjs.com/package/python-shell
- Tensorflow v2
    - https://www.tensorflow.org/install/
- Tensorflow comparing images tutorial
  - https://douglasduhaime.com/posts/identifying-similar-images-with-tensorflow.html 
- Reset.css v2.0
    - https://meyerweb.com/eric/tools/css/reset/
- Kinectron
    - https://kinectron.github.io/
- Kinectron server v0.3.1
    - https://github.com/kinectron/kinectron/releases/tag/0.3.1




&copy; JameSensor
Julien Menten, Toon Raskin, Andres Vergauwen, Wouter Vertonghen & Tom Verheirstraeten 
