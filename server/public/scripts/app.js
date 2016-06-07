//Many variables are initialized here to be manipulated globally.
var isTalking = false;
var speechDelay;
var substringIndex = 0;
var characterList;
var sceneList;
var evidenceList;
var currChar;
var currScene;
var ruby;
var isaac;
var opening;
var court;
var sceneIndex = 0;
var testimonyone;
var lineIndex = -1;
var textLocation;


//This is the character prototype.
var Character = function(params) {
    this.name = params.name;
    this.emotions = params.emotions;
    this.emotion = 'default';
    this.sound = params.defaultSound;
    this.text = params.defaultText;
};

//This is the scene prototype.
var Scene = function(params) {
    this.lines = params.lines;
    this.background = params.background;
    this.character = params.character;
    this.lineIndex = -1;
    this.defaultText = params.defaultText;
    this.defaultMusic = params.defaultMusic;
};

//This is the evidence prototype.
var Evidence = function(params) {
    this.name = params.name;
    this.description = params.description;
    this.image = params.image;
    this.info = params.info;

};


//This function outputs text onto the DOM and handles gifs/sound effects.
Character.prototype.speak = function(message, emotion, speechType) {

    if (isTalking === false) {
        isTalking = true;
        this.emotion = emotion || 'default';

        var $textbox = $('.textbox');
        $textbox.empty();
        $textbox.attr('class', 'textbox ' + (speechType || this.defaultText));
        $('.namebox').text(this.name);
        blip = new Audio('../assets/audio/sfx/sfx-' + this.sound + '.wav');
        displaySprite(this.emotions[this.emotion].talking);

        this.showText(message, 0, 20, blip);
    }
  };

//This function is in charge of appending to the DOM one letter at a time.
Character.prototype.showText = function(message, index, interval, sound) {
    if (index < message.length) {

        $('.textbox').append(message[index++]);
        sound.play();
        var self = this;
        setTimeout(function() {
            self.showText(message, index, interval, sound);
        }, interval);
    } else {
      $('.textbox').append('<img class="pointer" src="../assets/interfaceimages/pointer.gif" />');
      if(currScene.defaultText == 'testimony' && currScene.lineIndex >= 1){
        $('.textbox').append('<img class="pointer-prev" src="../assets/interfaceimages/pointer.gif" />');
      }
        displaySprite(this.emotions[this.emotion].finished);
        isTalking = false;
    }
};

//This function goes backwards in the current text. Only used for testimony.
Scene.prototype.prevText = function() {
currScene.lineIndex--;
var line = currScene.lines[currScene.lineIndex];
var emotion = line.emotion;
var texttype = line.text || currScene.defaultText;
currChar = (characterList[line.character]) || currChar;
currChar.speak(line.line || currScene.lines[currScene.lineIndex], emotion, texttype);
currScene.changeBG(line.background || currScene.background);
currScene.changeMusic(line.music || currScene.defaultMusic);
};

Scene.prototype.advanceText = function(event) {
  lineIndex++;
console.log(textLocation);
  if (currScene.lines.length <= lineIndex) {
    console.log("Change scene!");
      currScene.nextScene();
      textLocation = currScene.lines;
      lineIndex = 0;
  }
    var line = textLocation[lineIndex];
    console.log(line);
    var emotion = line.emotion;
    var texttype = line.text || currScene.defaultText;
    currChar = (characterList[line.character]) || currChar;
    currChar.speak(line.line || textLocation[lineIndex], emotion, texttype);
    currScene.changeBG(line.background || currScene.background);
    currScene.changeMusic(line.music);
  };
Scene.prototype.changeMusic = function (music) {
  if(music){
  $("#gamemusic").attr('src', '../assets/audio/bgm/' + music + '.mp3').trigger('play');

}
};
Scene.prototype.changeBG = function(bg) {
  if(bg) {
    $('.gamecontainer').css({
        'backgroundImage': 'url(../assets/backgrounds/' + bg + '.png'
    });
    if(bg == "defenseempty"){
    $('.defensebench').removeClass('hidden');
    } else {
    $('.defensebench').addClass('hidden');
    }
    if(bg == "prosecutorempty"){
      $('.prosecutionbench').removeClass('hidden');
    } else {
      $('.prosecutionbench').addClass('hidden');
    }
    if(bg == "witnessempty"){
    $('.witness_stand').removeClass('hidden');
    } else {
      $('.witness_stand').addClass('hidden');
    }
  }
};

//Displays the press text when using 'press' in testimony.
Scene.prototype.pressText = function(){
  console.log(lineIndex);
  var pressIndex = 0;
  textLocation = currScene.lines[lineIndex].presstext.lines;

console.log(textLocation);

  lineIndex = 0;
currChar.speak(textLocation[0].line, textLocation[0].emotion, textLocation[0].texttype);

};
Scene.prototype.nextScene = function(){
  sceneIndex++;
currScene = sceneList[sceneIndex];
};

$(document).ready(function() {


    fetchChar();
    fetchScene();
    fetchEvidence();
var gamemusic = document.getElementById("gamemusic");
gamemusic.play();


});

//This function fetches all of our characters in a json file.
function fetchChar() {
    $.ajax({
        type: 'get',
        url: '/jsonserver/characters/',
        success: function(character) {
            characterList = character;

            //New characters are made for each character in the json file. They are then put into a container object.
            ruby = new Character(characterList.witnessOne);
            isaac = new Character(characterList.detective);
            dawn = new Character(characterList.defense);
            characterList = {
                ruby: ruby,
                isaac: isaac,
                dawn: dawn
            };
            checkLoad();
        }
    });
}

//This function fetches all of our scenes in a json file.
function fetchScene() {
    $.get('/jsonserver/scene/', function(linedata) {
        sceneList = linedata;
        opening = new Scene(sceneList.opening);
        courtroom = new Scene(sceneList.courtroom);
        testimonyOne = new Scene(sceneList.testimonyone);
        sceneList = [
             opening, courtroom, testimonyOne
        ];
        checkLoad();
    });
}

//This function populates our evidence from the json file.
function fetchEvidence() {
    $.get('/jsonserver/evidence/', function(evidence) {
        badge = new Evidence(evidence.badge);
        autopsyreport = new Evidence(evidence.autopsyreport);
        evidenceList = {
            badge: badge,
            autopsyreport: autopsyreport
        };
        checkLoad();
    });
}
//This function alters the sprite displayed to a new URL.
function displaySprite(path) {
    $('.portrait').attr('src', '../assets/sprites/' + path + '.gif');

}

function displayEvidence() {
  if(currScene.defaultText == 'testimony'){
    $('#press').removeClass('hidden');
    $('#present').removeClass('hidden');
  } else {
    $('#present').addClass('hidden');
    $('#press').addClass('hidden');
  }
    $('.evidencebox').removeClass('hidden');
    $('.portrait').addClass('hidden');
    $('.witness_stand').addClass('hidden');

}

function hideEvidence() {
    $('.evidencebox').addClass('hidden');
    $('.portrait').removeClass('hidden');
}

function setActiveEvidence() {
  $('.evidence').removeClass('active');
    $(this).addClass('active');
    active = $(this).attr('id');
    $('.textbox').text(evidenceList[active].description);
}

function showInfo() {
    if (active) {
        $('.textbox').text(evidenceList[active].info);
    }
}
function objection() {
  hideEvidence();
  $('.overlay').removeClass('hidden');
  $('.overlay').attr('src', '../assets/interfaceimages/objection.gif');
  var overlayHide = setTimeout(hideOverlay, 1500);
}


function hideOverlay(){
  $('.overlay').addClass('hidden');
}

//This function ensures all our JSON files are ready before the game begins.
function checkLoad() {
    if (characterList && sceneList && evidenceList) {

        currScene = (sceneList[0]);
        currChar = (characterList[currScene.character]);
        textLocation = currScene.lines;
console.log("Click handlers setting up!");
        $('.textbox').on('click', '.pointer', currScene.advanceText);
        $('.textbox').on('click', '.pointer-prev', currScene.prevText);
        $('#openev').on('click', displayEvidence);
        $('.close').on('click', hideEvidence);
        $('.evidence').on('click', setActiveEvidence);
        $('#check').on('click', showInfo);
        $('#present').on('click', objection);
        $('#press').on('click', currScene.pressText);
    }
}
