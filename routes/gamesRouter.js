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
  console.log('query object', queryObject)
  const criteria = {}
  let pageSize = 10
  let page = 1

  // handle publisher query
  if (queryObject['publisher'] !== undefined) {
    criteria['publishers'] = queryObject['publisher']
  }

  // handle title query
  if (queryObject['title'] !== undefined) {
    criteria['title'] = { $regex: queryObject['title'], $options: 'i' }
  }

  // handle multiplayer
  if (queryObject['multiplayer'] !== undefined) {
    criteria['multiplayer'] = queryObject['multiplayer']
  }

  // pagination
  if (queryObject['pageSize'] !== undefined) {
    pageSize = queryObject['pageSize']
  }

  if (queryObject['page'] !== undefined) {
    page = queryObject['page']
  }

  console.log('criteria', criteria)
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
