const initialState = require('./data')

const express = require('express')

const port = 5000
const server = express()

server.get('/gamelist', (req, res) => {
    res.status(200).json(initialState.games)
})

server.listen(port, () => {
    console.log(`server listening on http://${port}`)
})