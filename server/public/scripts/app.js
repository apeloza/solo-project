
//Many variables are initialized here to be manipulated globally.

var speechDelay;
var substringIndex = 0;
var characterList;
var sceneList;
var currChar;
var currScene;
var ruby;
var isaac;
var opening;

//This is the character prototype.
var Character = function(params) {
  this.name = params.name;
  this.emotions = params.emotions;
  this.emotion = 'default';
  this.sound = params.defaultSound;
  this.text = params.defaultText;
};

var Scene = function(params) {
  this.lines = params.lines;
  this.background = params.background;
  this.character = params.character;
  this.lineIndex = 0;
};



//This function outputs text onto the DOM and handles gifs/sound effects.
Character.prototype.speak = function(message, emotion, speechtype){
  this.emotion = emotion || 'default';
  var $textbox = $('.textbox');
      $textbox.empty();
      $textbox.attr('class', 'textbox ' + (speechtype || this.text));
      $('.namebox').text(this.name);
      blip = new Audio ('../assets/audio/sfx/sfx-' + this.sound + '.wav');
      console.log(this.emotions);
      displaySprite(this.emotions[this.emotion].talking);
      this.showText(message, 0, 50, blip);
};

//This function is in charge of appending to the DOM one letter at a time.
Character.prototype.showText = function (message, index, interval, sound) {
  if (index < message.length) {
    $('.textbox').append(message[index++]);
    sound.play();
    var self = this;
    setTimeout(function () { self.showText(message, index, interval, sound); }, interval);
  } else {
    currScene.lineIndex ++;
    displaySprite(this.emotions[this.emotion].finished);
  }
};
Scene.prototype.advanceText = function(){
  var line = currScene.lines[currScene.lineIndex];
  var emotion = currScene.lines[currScene.lineIndex].emotion;
  var texttype = currScene.lines[currScene.lineIndex].text;
  console.log(characterList[currScene.lines[currScene.lineIndex].character]);
currChar = (characterList[currScene.lines[currScene.lineIndex].character]) || currChar;
console.log(currChar);
currChar.speak(line.line || currScene.lines[currScene.lineIndex], emotion, texttype);
currScene.changeBG(line.background || currScene.background);
if(currScene.lines.length <= currScene.lineIndex + 1){
  //this.nextScene();
}
};
Scene.prototype.changeBG = function(bg){
  console.log("Fired changeBG");
$('.gamecontainer').css({'backgroundImage' : 'url(../assets/backgrounds/' + bg + '.png'});

};

$(document).ready(function () {


fetchChar('isaac');
fetchScene('opening');

//The starting music is initialized. It is set to loop, and then it plays.
var courtroomLobby = new Audio('../assets/audio/bgm/courtroomlobby.mp3');
courtroomLobby.loop = true;
courtroomLobby.play();

});

//This function fetches all of our characters in a json file.
function fetchChar(){
  $.ajax({
      type: 'get',
      url: '/jsonserver/characters/',
      success: function(character) {
console.log(character);
        characterList = character;
        ruby = new Character(characterList.ruby);
        isaac = new Character(characterList.isaac);
        characterList = {
          ruby: ruby,
          isaac: isaac
        };
        checkLoad();
      }
  });
}

//This function fetches all of our scenes in a json file.
function fetchScene(){
  $.get('/jsonserver/scene/', function(linedata){
    console.log(linedata);
sceneList = linedata;
opening = new Scene(sceneList.opening);
sceneList = {
  opening: opening
};
checkLoad();
  });
}

//This function alters the sprite displayed to a new URL.
function displaySprite(path){
$('.portrait').attr('src', '../assets/sprites/' + path + '.gif');

}

//This function ensures all our JSON files are ready before the game begins.
function checkLoad(){
  if (characterList && sceneList){
    console.log("Yep");

     currScene = (sceneList.opening);
     currChar = (characterList[currScene.character]);
     console.log(currScene.character);
     console.log(currChar);
    $('.textbox').on('click', currScene.advanceText);
  }
}


/*function advanceText(message, options){
var $textbox = $('.textbox');
    $textbox.empty();
    $textbox.attr('class', 'textbox ' + options.textType);
    blip = new Audio ('../assets/audio/sfx/sfx-' + options.textSound + '.wav');
    showText(message, 0, 50, blip);
}

function typeText(){
  console.log(parsedText[textIndex][1]);
  $('.textbox').append(parsedText[textIndex][1][substringIndex]);
  substringIndex++;
  blip.play();
  if(substringIndex > parsedText[textIndex][1].length - 1){

    clearInterval(speechDelay);
    substringIndex = 0;
    $('.textbox').append('<img class="pointer" src="../assets/interfaceimages/pointer.gif" />');
    textIndex++;
    $('.textbox').on('click', advanceText);

  }
}

function showText (message, index, interval, sound) {
  if (index < message.length) {
    $('.textbox').append(message[index++]);
    sound.play();
    setTimeout(function () { showText(message, index, interval, sound); }, interval);
  }
}*/
