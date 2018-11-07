
// the snake is divided into small segments, which are drawn and edited on each 'draw' call
var numSegments = 10;
var direction = 'right';

var xStart = 0; //starting x coordinate for snake
var yStart = 250; //starting y coordinate for snake
var diff = 10;

var xCor = [];
var yCor = [];

var xFruit = 0;
var yFruit = 0;
var scoreElem;

function setup() {
  scoreElem = createDiv('Score = 0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'brown');

  createCanvas(1000, 500);
  frameRate(15);
  stroke(255);
  strokeWeight(10);
  r = random(255);
  g = random(255);
  b = random(255);
  updateFruitCoordinates();

  for (var i = 0; i < numSegments; i++) {
    xCor.push(xStart + (i * diff));
    yCor.push(yStart);
  }
}

function draw() {
  background(0);
  for (var i = 0; i < numSegments - 1; i++) {
    line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
  }

  updateSnakeCoordinates();
  checkForFruit();
  checkGameStatus();

}

/*
 The segments are updated based on the direction of the snake.
 All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
 gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
 and this results in the movement of the snake.

 The last segment is added based on the direction in which the snake is going,
 if it's going left or right, the last segment's x coordinate is increased by a
 predefined value 'diff' than its second to last segment. And if it's going up
 or down, the segment's y coordinate is affected.
*/
function updateSnakeCoordinates() {

  for (var i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
  }
  switch (direction) {
    case 'right':
      xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'up':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
      break;
    case 'left':
      xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'down':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  };



}

/*
 I always check the snake's head position xCor[xCor.length - 1] and
 yCor[yCor.length - 1] to see if it touches the game's boundaries
 or if the snake hits itself.
*/
function checkGameStatus() {
  if (xCor[xCor.length - 1] > width ||
      xCor[xCor.length - 1] < 0 ||
      yCor[yCor.length - 1] > height ||
      yCor[yCor.length - 1] < 0 ||
      checkSnakeCollision()) {
    noLoop();
    var scoreVal = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Game ended! Your score was : ' + scoreVal);
    gameoverSound()
  }
}

/*
 If the snake hits itself, that means the snake head's (x,y) coordinate
 has to be the same as one of its own segment's (x,y) coordinate.
*/
function checkSnakeCollision() {
  var snakeHeadX = xCor[xCor.length - 1];
  var snakeHeadY = yCor[yCor.length - 1];
  for (var i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
      return true;
    }
  }
}

/*
 Whenever the snake consumes a fruit, I increment the number of segments,
 and just insert the tail segment again at the start of the array (basically
 I add the last segment again at the tail, thereby extending the tail)
*/
function checkForFruit() {
  point(xFruit, yFruit);
  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    var prevScore = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Score = ' + (prevScore + 1));
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    numSegments++;

    r = random(255);
    g = random(255);
    b = random(255);
    stroke(r, g, b);
    eatFruitSound();
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  /*
    The complex math logic is because I wanted the point to lie
    in between 100 and width-100, and be rounded off to the nearest
    number divisible by 10, since I move the snake in multiples of 10.
  */

  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;

}

function keyPressed() {
playSound();

  switch (keyCode) {

    case 37:
      if (direction != 'right') {
        direction = 'left';
      }
      break;
    case 39:
      if (direction != 'left') {
        direction = 'right';
      }
      break;
    case 38:
      if (direction != 'down') {
        direction = 'up';
      }
      break;
    case 40:
      if (direction != 'up') {
        direction = 'down';
      }
      break;


  }


}

function eatFruitSound(event){
  var fmSynth = new Tone.FMSynth (
    {harmonicity  : 7 ,
    modulationIndex  : 10 ,
    detune  : 0 ,
    envelope  : {
      attack  : 0.01 ,
  decay  : 0.01 ,
  sustain  : 0.02 ,
  release  : 0.5
  }  ,
  modulationEnvelope  : {
  attack  : 0.2 ,
  decay  : 0.02 ,
  sustain  : 0.03 ,
  release  : 0.5
}


}).toMaster()


fmSynth.triggerAttackRelease('C4', '4n');
fmSynth.harmonicity.value = 0.5;

}

function playSound() {


  //create a synth and connect it to the master output (your speakers)
  var synth = new Tone.Synth(
    {
      envelope: {
        attack  : 0.0004 ,
        decay  : 0.1,
        sustain  : 0.0002 ,
        release  : 0.0001
      }
  }).toMaster()

  switch (keyCode) {
    case 37:
        synth.triggerAttackRelease('C4', '1n');
        break;
    case 38:
        synth.triggerAttackRelease('D4', '1n');
        break;
    case 39:
        synth.triggerAttackRelease('Eb4', '1n');
        break;
    case 40:
        synth.triggerAttackRelease('F#4', '1n');
        break;
  }
}

function gameoverSound(){

    var chorus = new Tone.Chorus(4, 2.5, 0.5);

    var synth = new Tone.PolySynth(4, Tone.MonoSynth).connect(chorus);


    synth.toMaster()


    synth.triggerAttackRelease(["C4","E4","G#4"], "5n");


}

function background(){
  var noise = new Tone.Noise("pink").start();
  var autoFilter = new Tone.AutoFilter({
	"frequency" : "8m",
	"min" : 800,
	"max" : 15000
}).connect(Tone.Master);



  noise.connect(autoFilter);

 autoFilter.volume.value = -11;

  autoFilter.start().toMaster()

}
