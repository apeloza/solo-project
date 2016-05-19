
//Many variables are initialized here to be manipulated globally.

var speechDelay;
var substringIndex = 0;
var characterList;
var sceneList;
var Character = function(params) {
  this.name = params.name;
  this.emotions = params.emotions;
  this.sound = params.defaultSound;
  this.text = params.defaultText;
};
Character.prototype.speak = function(message, emotion, speechtype){
  var $textbox = $('.textbox');
      $textbox.empty();
      $textbox.attr('class', 'textbox ' + (speechtype || this.text));
      blip = new Audio ('../assets/audio/sfx/sfx-' + this.sound + '.wav');
      showText(message, 0, 50, blip);
};

$(document).ready(function () {


fetchChar('isaac');
fetchScene('opening');

//The starting music is initialized. It is set to loop, and then it plays.
//var courtroomLobby = new Audio('../assets/audio/bgm/courtroomlobby.mp3');
//courtroomLobby.loop = true;
//courtroomLobby.play();

});

//This function takes in a .txt file with an ajax request. It splits it into individual lines, which are then fed to a text parser.
function fetchChar(){
  $.ajax({
      type: 'get',
      url: '/jsonserver/characters/',
      success: function(character) {
console.log(character);
        characterList = character;
        checkLoad();
      }
  });
}
function fetchScene(){
  $.get('/jsonserver/scene/', function(linedata){
    console.log(linedata);
sceneList = linedata;
checkLoad();
  });
}

function checkLoad(){
  if (characterList && sceneList){
    console.log("Yep");
    var currScene = sceneList.opening;
    var currChar =  new Character(characterList[currScene.character]);
  //  $('.portrait').attr('src', '../assets/sprites/' + currChar.emotions.default.talking + '.gif');
  currChar.speak('Hello world');

  }
}
function parseText(text){

  for (var i = 0; i < text.length; i++){
    parsedText.push(text[i].split('::'));
  }
}

function advanceText(message, options){
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
}
