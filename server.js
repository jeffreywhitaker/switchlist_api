const data = require('./data')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const port = process.env.PORT || 5000
const server = express()

server.use(cors())
server.use(bodyParser.json())

let gameId = data.state.games.length
let userId = data.users.length

// authenticator function

function authenticator(req, res, next) {
    const { authorization } = req.headers
    if (authorization === token) {
        next()
    } else {
        res.status(403).json({ error: 'You must be logged in to access this section.' })
    }
}

// login API  

server.post('/login', (req, res) => {
    const { username, password } = req.body
    if (username === 'Jeff' && password === 'jeff') {
        req.loggedIn = true
        res.status(200).json({
            payload: token
        })
    } else {
        res
            .status(403)
            .json({ error: 'Username or Password incorrect. Please fix.' })
    }
})

// games API

server.get('/gamelist', (req, res) => {
    res.status(200).json(data.state.games)
})

// users API

server.get('/users/:id', (req, res) => {
    res.status(200).json(data.users)
})

server.post('/users', (req, res) => {
    if (req.body.name !== undefined) {
        const newUser = req.body
        newUser['id'] = userId
        data.users.push(newUser)
    }
    ++movieId
    res.status(201).json(data.users)
})

server.put('/users/:id', (req, res) => {
    if (!req.params.id)
        res.status(400).send("Your request is missing the user id")
    if (
        req.body.id === undefined ||
        !req.body.name ||
        !req.body.password
    ) {
        res
            .status(422)
            .send("Make sure your request body has all the fields it needs")
    }
    users = users.map(user => {
        if (`${us.id}` === req.params.id) {
            return req.body
        }
        return user
    })
    res.status(200).send(req.body)
})

server.delete('/users/:id', (req, res) => {
    if (!req.params.id)
        res.status(400).send('Your request is missing the user id')
    data.users = data.users.filter(user => `${user.id}` !== req.params.id)
    res.status(202).send(req.params.id)
})

// server port

server.listen(port, () => {
    console.log(`server listening on http://${port}`)
})