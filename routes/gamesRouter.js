const express = require('express')
const router = express.Router()
require('../models/publisherModel')
require('../models/directorModel')
require('../models/composerModel')
const Game = require('../models/gameModel')

// use query params
const url = require('url')

router.get('/', (req, res) => {
  // get query params from the url
  const queryObject = url.parse(req.url, true).query
  const criteria = {}
  const pageSize
  const page

  // handle publisher query
  if (queryObject['publisher'] !== undefined) {
    criteria['publisher'] = queryObject['publisher']
  }

  // handle title query
  if (queryObject['title'] !== undefined) {
    criteria['title'] = { '$regex': queryObject['title'], '$options': 'i' }
  }

  // handle multiplayer
  if (queryObject['multiplayer'] !== undefined) {
    criteria['multiplayer'] = { '$regex': queryObject['multiplayer'], '$options': 'i' }
  }

  // pagination
  if (queryObject['pageSize'] !== undefined) {
    pageSize = queryObject['pageSize']
  } else {
    pageSize = 10
  }

  if (queryObject['page'] !== undefined) {
    page = queryObject['page']
  } else {
    page = 1
  }

  Game.find(criteria)
    .populate('publishers')
    .populate('directors')
    .populate('composers')
    .limit(pageSize + 1)
    .skip((page - 1) * pageSize)
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
