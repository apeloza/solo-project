var express = require('express');
var characters = require('../public/assets/text/characters');
var router = express.Router();
var scenes = require('../public/assets/text/scenes');
var evidence = require('../public/assets/text/evidence');
router.get('/characters/', function(req, res) {
res.send(characters);
});

router.get('/scene/', function(req, res) {
res.send(scenes);
});

router.get('/evidence/', function(req, res) {
  res.send(evidence);
});
module.exports = router;
