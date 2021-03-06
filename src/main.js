/* 
Title: RYB
A game by Kai Turner, Daghan Koc, Julian Liaw, & Nathan Tejeda
Completed: June 2nd 2021

RYB, the prototype of our final game ‘CMYK’ was an absolute challenge to create. Notably, we 
are using Phaser tile maps in a way that Phaser never intended tile maps to be used, actively 
swapping out the contents of map objects every so often to keep map order random and continuous. 
In addition, we created entirely custom hit detection code that compares the value of the pixel 
underneath the player with the player itself. This code ended up being substantially more 
complicated to make work than we had for-seen, thus pushing us behind majorly with the game. 
However once we got it working, we were surprised to see that it performed much better than we were 
expecting. Possibly the single greatest technical achievement with the game.

We are very proud of the aesthetic style of the game. We focused heavily on making the game clean, 
minimal, and simple to play and understand, utilizing an art style inspired from mobile puzzle games 
and graphic design theory. Th game score counter displays the score in binary, allowing the player to 
visually see their progress, but not distract them with numbers. Lastly, we think that the color 
switching mechanic, while simple, is a reasonably unique mechanic that sets our game apart. Levels 
can be traversed in a number of different ways, and the player can master the game over time by 
learning the patterns of the different maps and mastering the controls.

Shoutout tutor Jameson for supporting us when we were down and helping us get the chance to accomplish what we wanted to 
with both RYB and CMYK. <3
*/



var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    margin: 0,
    transparent: true,
    scene : [Menu, Play, Gameover],
    parent: 'phaser_canvas',
    //autoCenter: true,
    //debug: true
};


let game = new Phaser.Game(config);

// reserving conrols
let spaceBar, keyLeft, keyRight, keyPause;

// set Global variables

//map variables (sorry Adam, but .this aint it <3)
let playerShip = null;
let newMap = null;
let visualsNew = null;
let botLayerNew = null;
let topLayerNew = null;
var mapToRemove = null;
let laneNumber = 1;
let map1 = null;
let map2 = null;
let visuals1 = null;
let visuals2 = null;
let botLayer1 = null;
let topLayer1 = null;
let botLayer2 = null;
let topLayer2 = null;

//maps that lane change happens
let thirdLane = 8;
let secondLane = 3;

// Screen Centers
const screenCenterY = game.config.height/2;
const screenCenterX = game.config.width/2;

//Size and Scale
const tilemapScale = 0.6;
const arrowScale = 0.5;

//Map horizontal offet to make sure it's always centered
const mapX = screenCenterX - (tilemapScale * 300);

//Arrow Y pos
const arrowY = screenCenterY + (screenCenterY / 2); //720
const arrowHeight = game.config.height - arrowY; //240

//Arrow left right travel distance
const arrowDist = 200 * tilemapScale;
const arrowMovementR = '+=' + (200 * tilemapScale);
const arrowMovementL = '-=' + (200 * tilemapScale);

//map movement variables
let map1Pos = 0;
let map2Pos = 0;
const map1relative = ((8000 * tilemapScale) * -1);  //  -4800
const map2relative = ((8000 * tilemapScale) * -2);  //  -9600
let map1dist = map1relative;
let map2dist = map2relative;

//player color
let playerColor = 'red'; //starting color is red

//tile color (under player)
let tileColor

//total distance traveled, to be used for score later
let scoreCount = 0;
let rawDist = -arrowY;

//scrolling rate (start)
let scrollSpeed = 5;
const speedIncrease = 3; // number of maps that pass before the scroll speed is increased.

//current lane of the player
let currentLane = 1;

//score UI spacing paramters:
const dotVertSpacing = 50;
const dotHorizSpacing = 50;

const dotPaddingRight = game.config.width - 50;
const dotPaddingTop = 50;

//let there be music
let music;

//data structures and stuff for maps

//map name arrays, must be updated when new maps are added
let mapsEasy = ['easy1', 'easy2', 'easy3'];
let mapsMid = ['mid1', 'mid2', 'mid3', 'mid4'];
let mapsHard = ['hard1', 'hard2', 'hard3', 'hard4', 'hard5', 'hard6', 'hard7', 'hard8', 'hard9', 'hard10', 'hard11', 'hard12'];

//future function that defines a random map order for each game, but still conforms to tutorial order and difficulty.
function createMapOrder() {
    return mapsEasy.concat(mapsMid, shuffle(mapsHard)); //currently puts maps in order.
}

let mapNames = createMapOrder(); //populate map names order
let mapData = [];
let nextMap = 2; //counter used to index through mapNames array, change to start on a particular map (after maps 1 and 2 pass) (DEFUALT IS 2)

// if (nextMap >= mapNames.length) { //puts you on the last map even if nextMap is set to a number greater than the number of maps loaded. (safety net)
//     nextMap = mapNames.length - 1;
// }

//Fisher–Yates array shuffle function, written by Mike Bostock, retrieved from https://bost.ocks.org/mike/shuffle/

function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }