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

var Evidence = function(params) {
    this.name = params.name;
    this.description = params.description;
    this.image = params.image;
    this.info = params.info;

};


//This function outputs text onto the DOM and handles gifs/sound effects.
Character.prototype.speak = function(message, emotion, speechtype) {
    if (isTalking === false) {
        isTalking = true;
        this.emotion = emotion || 'default';
        var $textbox = $('.textbox');
        $textbox.empty();
        $textbox.attr('class', 'textbox ' + (speechtype || this.text));
        $('.namebox').text(this.name);
        blip = new Audio('../assets/audio/sfx/sfx-' + this.sound + '.wav');
        console.log(this.emotions);
        displaySprite(this.emotions[this.emotion].talking);
        this.showText(message, 0, 50, blip);
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
        currScene.lineIndex++;
        displaySprite(this.emotions[this.emotion].finished);
        isTalking = false;
    }
};
Scene.prototype.advanceText = function() {
    var line = currScene.lines[currScene.lineIndex];
    var emotion = currScene.lines[currScene.lineIndex].emotion;
    var texttype = currScene.lines[currScene.lineIndex].text;
    console.log(characterList[currScene.lines[currScene.lineIndex].character]);
    currChar = (characterList[currScene.lines[currScene.lineIndex].character]) || currChar;
    console.log(currChar);
    currChar.speak(line.line || currScene.lines[currScene.lineIndex], emotion, texttype);
    currScene.changeBG(line.background || currScene.background);
    if (currScene.lines.length <= currScene.lineIndex + 1) {
        //this.nextScene();
    }
};
Scene.prototype.changeBG = function(bg) {
    $('.gamecontainer').css({
        'backgroundImage': 'url(../assets/backgrounds/' + bg + '.png'
    });

};

$(document).ready(function() {


    fetchChar();
    fetchScene();
    fetchEvidence();

    //The starting music is initialized. It is set to loop, and then it plays.
    var courtroomLobby = new Audio('../assets/audio/bgm/courtroomlobby.mp3');
    courtroomLobby.loop = true;
    courtroomLobby.play();

});

//This function fetches all of our characters in a json file.
function fetchChar() {
    $.ajax({
        type: 'get',
        url: '/jsonserver/characters/',
        success: function(character) {
            characterList = character;

            //New characters are made for each character in the json file. They are then put into a container object.
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
function fetchScene() {
    $.get('/jsonserver/scene/', function(linedata) {
        sceneList = linedata;
        opening = new Scene(sceneList.opening);
        sceneList = {
            opening: opening
        };
        checkLoad();
    });
}

function fetchEvidence() {
    $.get('/jsonserver/evidence/', function(evidence) {
        console.log(evidence);
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
    $('.evidencebox').removeClass('hidden');
    $('.portrait').addClass('hidden');
}

function hideEvidence() {
    $('.evidencebox').addClass('hidden');
    $('.portrait').removeClass('hidden');
}

function setActiveEvidence() {
  $('.evidence').removeClass('active');
    $(this).addClass('active');
    active = $(this).attr('id');
    console.log(active);
    $('.textbox').text(evidenceList[active].description);
}

function showInfo() {
    if (active) {
        $('.textbox').text(evidenceList[active].info);
    }
}

//This function ensures all our JSON files are ready before the game begins.
function checkLoad() {
    if (characterList && sceneList && evidenceList) {
        console.log("Yep");

        currScene = (sceneList.opening);
        currChar = (characterList[currScene.character]);

        $('.textbox').on('click', currScene.advanceText);
        $('.evidencebtn').on('click', displayEvidence);
        $('.close').on('click', hideEvidence);
        $('.evidence').on('click', setActiveEvidence);
        $('.check').on('click', showInfo);
    }
}
