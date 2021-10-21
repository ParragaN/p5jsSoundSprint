/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

let osc;
let playing = false;
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
let splitter;
let diameter0 = 0, diameter1 = 0, diameter2 = 0;

let osc1, osc2, osc3, fft;

// anycode using hsb is an attempt to get the potentiometer to be mapped to the hue of the visuals
// let h, s, b;




// from https://p5js.org/examples/math-sine-wave.html
let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 75.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave





function setup() {
  
  createCanvas(windowWidth, windowHeight);

 
  // colorMode(HSB, 255, 255, 255);
  // h = random(255);
  // s = random(255);
  // b = random(255);

  

// for sine wave
  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));

///////////////////////////////////////////////////////////////////
    //Begin serialport library methods, this is using callbacks
///////////////////////////////////////////////////////////////////    
    

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();
  console.log("serial.list()   ", serial.list());

  //////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("COM3");
 /////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////
  // Here are the callbacks that you can register

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);

 
}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////


// osc1 = new p5.SawOsc(); 
// osc1 = new p5.SqrOsc();
osc1 = new p5.TriOsc();
osc1.amp(10);
osc2 = new p5.SinOsc(); // set frequency and type
osc2.amp(1);  
osc3 = new p5.TriOsc(); // set frequency and type
osc3.amp(5);    

fft = new p5.FFT();
osc1.start();
osc2.start(); 
osc3.start();

// We are connected and ready to go
function serverConnected() {
  console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log("currentString  ", currentString);             // println the string
  latestData = currentString;            // save it for the draw method
  console.log("latestData" + latestData);   //check to see if data is coming in
  splitter = split(latestData, ',');       // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  diameter0 = splitter[0];                 //put the first sensor's data into a variable
  diameter1 = splitter[1];
  diameter2 = splitter[2]; 



}

// We got raw data from the serial port
function gotRawData(thedata) {
  println("gotRawData" + thedata);
}



function draw() {
  

  fill(250,250,0,15);

if (diameter0== 0){
  background(random, random, random);
  calcWaveRect();
  renderWaveRect();
}
else {
  background(3, 252, 248);
  calcWave();
  renderWave();
}
  ellipseMode(RADIUS);
  noStroke(); 
  fill(0,0,0,15);
  ellipse(windowWidth/2, windowHeight/2, diameter2*50, diameter2*50);
    

// played with mapping the freq to be a lower pitch 
  
  var freq = map(diameter0*500, 0, width, 40, 580);    
    osc1.freq(freq);
    //console.log(freq);
    
  var freq2 = map(diameter1, 0, width, 00, 1000);    
    osc2.freq(freq2);
    //console.log(freq2);
    
 var freq3 = map(diameter2*100, 0, width, 40, 880);    
    osc3.freq(freq3);
    console.log(freq3); 

  //   for (var i = 0; i < 360; i++) {

  //     h = map(i, 0, diameter1, 0, 255); //map the hue to the i value
  
  // note: in arduino, I changed the number mapping to be from 0-360, instead of 0-1023, but this didnt work therfore all colour values are in rgb
  
     
  // }
}


// sine wav code from https://p5js.org/examples/math-sine-wave.html

function calcWaveRect() {
  
  theta += 0.03;


  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * diameter1*.5;
    x += dx;
  }
}

function renderWaveRect() {
  noStroke();
  fill(90, 232, 53);
  
  for (let x = 0; x < yvalues.length; x++) {
    rect(x * xspacing, height / 2 + yvalues[x], 16, 16);
  }
}

function calcWave() {
 
  theta += 0.03;

  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * diameter1*.5;
    x += dx;
  }
}

function renderWave() {
  noStroke();
  fill(90, 232, 53);
  
  for (let x = 0; x < yvalues.length; x++) {
    ellipse(x * xspacing, height / 2 + yvalues[x], 16, 16);
  }
}





function mouseClicked(){
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    console.log("getAudioContext().state" + getAudioContext().state);
  }
  };
  


  

 