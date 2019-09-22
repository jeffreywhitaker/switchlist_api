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
    // map through users and check password


    if (username === 'Jeff' && password === 'jeff') {
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

server.get('/gamelist', authenticator, (req, res) => {
    res.status(200).json(data.state.games)
})

// users API

server.post('/users', (req, res) => {
    if (!req.body.name) {
        return res.status(400).send("There needs to be a name in the name field.")
    }
    if (data.users.find(user => {
        return user.name === req.body.name
    })) {
        return res.status(400).send("There is already a user with this name. Please use another name.")
    }
    const newUser = req.body
    newUser.id = userId
    data.users.push(newUser)
    ++userId
    res.status(201).json(token)
})

server.put('/users/:id', authenticator, (req, res) => { // add in authorization later
    if (!req.params.id)
        return res.status(400).send("Your request is missing the user id.")
    if (
        !req.body.name ||
        !req.body.password
    ) {
        return res.status(422).send("Make sure your request body has all the fields it needs.")
    }
    data.users = data.users.map(user => {
        if (user.id === parseInt(req.params.id)) {
            return req.body
        }
        return user
    })
    res.status(200).send(req.body)
})

server.delete('/users/:id', authenticator, (req, res) => {  // add in authorization later
    if (!req.params.id)
        res.status(400).send('Your request is missing the user id')
    data.users = data.users.filter(user => `${user.id}` !== req.params.id)
    res.status(202).send("User has been deleted.")
})

// server port

server.listen(port, () => {
    console.log(`server listening on http://${port}`)
})