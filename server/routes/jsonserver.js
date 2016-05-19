var express = require('express');
var characters = require('../public/assets/text/characters');
var router = express.Router();
var scenes = require('../public/assets/text/scenes');

router.get('/characters/', function(req, res) {
res.send(characters);
});

router.get('/scene/', function(req, res) {
res.send(scenes);
});
module.exports = router;
