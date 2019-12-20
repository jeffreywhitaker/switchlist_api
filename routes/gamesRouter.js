const express = require('express')
const router = express.Router()
require('../models/publisherModel')
require('../models/directorModel')
require('../models/composerModel')
const Game = require('../models/gameModel')

router.get('/all', (req, res) => {
  Game.find({})
    .populate('publishers')
    .populate('directors')
    .populate('composers')
    .exec((err, games) => {
      if (err) throw err
      console.log('endpoint hit')
      res.status(200).json(games)
    })
})

router.get('/id/:id', (req, res) => {
  Game.find({ id: req.params.id })
    .populate('publishers')
    .populate('directors')
    .populate('composers')
    .exec((err, game) => {
      if (err) throw err
      res.status(200).json(game)
    })
})

module.exports = router
