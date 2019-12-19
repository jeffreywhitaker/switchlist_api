const express = require('express')
const router = express.Router()

const Game = require('../models/gameModel')

router.get('/all', (req, res) => {
  Game.find({}, (err, games) => {
    if (err) throw err
    console.log('endpoint hit')
    res.status(200).json(games)
  })
})

router.get('/id/:id', (req, res) => {
  Game.find({ id: req.params.id }, (err, game) => {
    if (err) throw err
    res.status(200).json(game)
  })
})

module.exports = router
