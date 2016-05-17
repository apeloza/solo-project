var textIndex = 0;
var linebyLine;
var parsedText = [];
$(document).ready(function () {
  $('.switchanim').on('click', function () {
    $('.character').toggleClass('gumshoetalk');
  });
  $('.textbox').on('click', advanceText);
fetchText();

});

function fetchText(){
  $.get('/assets/text/dummytext.txt', function(data){
    console.log(data);
    linebyLine = data.split("\n");
    console.log(linebyLine[1]);
parseText(linebyLine);
  });
}
function parseText(text){
  for (var i = 0; i < linebyLine.length; i++){
    parsedText.push(linebyLine[i].split('::'));
    console.log(parsedText);
  }
}

function advanceText(){
  if (linebyLine.length <= textIndex + 1 ){
    return true;
  } else {
$('.textbox').text(parsedText[textIndex][1]);
$('.portrait').attr('src', '../assets/sprites/' + parsedText[textIndex][0] + '.gif')
console.log(parsedText.length);
console.log(textIndex);
textIndex++;
}
}
