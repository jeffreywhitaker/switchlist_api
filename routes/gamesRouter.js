const express = require('express')
const router = express.Router()
const Publisher = require('../models/publisherModel')
const Game = require('../models/gameModel')

router.get('/all', (req, res) => {
  Game.find({})
    .populate('publisherId')
    .exec((err, games) => {
      if (err) throw err
      console.log('endpoint hit')
      res.status(200).json(games)
    })
})

router.get('/id/:id', (req, res) => {
  Game.find({ id: req.params.id })
    .populate('publisherId')
    .exec((err, game) => {
      if (err) throw err
      res.status(200).json(game)
    })
})

module.exports = router
