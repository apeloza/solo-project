
//Many variables are initialized here to be manipulated globally.
var textIndex = 1;
var linebyLine;
var parsedText = [];
var blip;
var speechDelay;
var substringIndex = 0;

$(document).ready(function () {

//When the textbox is clicked on, the text is advanced to the next line.
  $('.textbox').on('click', advanceText);

//fetchText takes in data from a .txt file and parses it.
fetchText();

//The starting music is initialized. It is set to loop, and then it plays.
var courtroomLobby = new Audio('../assets/audio/bgm/courtroomlobby.mp3');
courtroomLobby.loop = true;
courtroomLobby.play();

});

//This function takes in a .txt file with an ajax request. It splits it into individual lines, which are then fed to a text parser.
function fetchText(){
  $.get('/assets/text/dummytext.txt', function(data){
    linebyLine = data.split("\n");
parseText(linebyLine);
  });
}
function parseText(text){

  for (var i = 0; i < text.length; i++){
    parsedText.push(text[i].split('::'));
  }
}

function advanceText(){

  if (linebyLine.length <= textIndex + 1 ){
    return true;
  } else {
    $('.textbox').empty();
    $('.textbox').removeClass(parsedText[textIndex - 1][4]);
    $('.textbox').off('click', advanceText);
    blip = new Audio ('../assets/audio/sfx/sfx-' + parsedText[textIndex][3] + '.wav');
    $('.textbox').addClass(parsedText[textIndex][4]);
    speechDelay = setInterval (typeText, 50);
$('.portrait').attr('src', '../assets/sprites/' + parsedText[textIndex][0] + '.gif');
}
}

function typeText(){
  console.log(parsedText[textIndex][1]);
  $('.textbox').append(parsedText[textIndex][1][substringIndex]);
  substringIndex++;
  blip.play();
  if(substringIndex > parsedText[textIndex][1].length - 1){

    clearInterval(speechDelay);
    substringIndex = 0;
    $('.portrait').attr('src', '../assets/sprites/' + parsedText[textIndex][2] + '.gif');
    $('.textbox').append('<img class="pointer" src="../assets/interfaceimages/pointer.gif" />');
    textIndex++;
    $('.textbox').on('click', advanceText);

  }
}
