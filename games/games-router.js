const express = require('express')
const router = express.Router()
const db = require('../data/db-config')

// GET list of all games
router.get("/gamelist", (req, res) => {
    /*db('games')
      .select('*')
      .then(games => {
        res.status(200).json(games);
      })
      .catch(err => {
        console.log(err)
        res.json(err)
      })*/
    db('games')
      .leftJoin('games_directors', 'games.gameId', '=', 'games_directors.gameId')
      .leftJoin('directors', 'games_directors.directorId', '=', 'directors.directorId')
      .select([
        'games.*', 
        // db.raw(`Json_agg(Json_build_object('id', directors.directorId, 'name', directors.name)) AS directors`)
      ])
      .groupBy('games.gameId')
      .then(games => {
        res.status(200).json(games);
      })
      .catch(err => {
        console.log(err)
        res.json(err)
      })
});

module.exports = router