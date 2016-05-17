var textIndex = 0;
var linebyLine;
var parsedText = [];
var blipMale = new Audio ('../assets/audio/sfx/sfx-blipmale.wav');
var speechDelay;
var substringIndex = 0;
$(document).ready(function () {
  $('.switchanim').on('click', function () {
    $('.character').toggleClass('gumshoetalk');
  });
  $('.textbox').on('click', advanceText);
fetchText();
var courtroomLobby = new Audio('../assets/audio/bgm/courtroomlobby.mp3');
courtroomLobby.loop = true;
courtroomLobby.play();

});

function fetchText(){
  $.get('/assets/text/dummytext.txt', function(data){
    console.log(data);
    linebyLine = data.split("\n");
parseText(linebyLine);
  });
}
function parseText(text){
  for (var i = 0; i < linebyLine.length; i++){
    parsedText.push(linebyLine[i].split('::'));
  }
}

function advanceText(){
  if (linebyLine.length <= textIndex + 1 ){
    return true;
  } else {
    $('.textbox').empty();
    speechDelay = setInterval (typeText, 60);
$('.portrait').attr('src', '../assets/sprites/' + parsedText[textIndex][0] + '.gif');
}
}

function typeText(){
  console.log(parsedText[textIndex][1]);
  $('.textbox').append(parsedText[textIndex][1][substringIndex]);
  substringIndex++;
  blipMale.play();
  if(substringIndex > parsedText[textIndex][1].length - 1){
    console.log(substringIndex);
    console.log(parsedText[textIndex][1].length);
    console.log("True");
    clearInterval(speechDelay);
    substringIndex = 0;
    textIndex++;
  }
}
