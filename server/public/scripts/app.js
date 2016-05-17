var textIndex = 0;
var linebyLine;
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

  });
}

function advanceText(){
$('.textbox').text(linebyLine[textIndex]);
textIndex++;
}
