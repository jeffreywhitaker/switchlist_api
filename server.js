const initialState = require('./data')
const cors = require('cors')
const express = require('express')

const port = process.env.PORT || 5000
const server = express()

server.use(cors())

server.get('/gamelist', (req, res) => {
    res.status(200).json(initialState.games)
})

server.listen(port, () => {
    console.log(`server listening on http://${port}`)
})