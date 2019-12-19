const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load input validation
// const validateRegisterInput = require('../validation/register-validation');
// const validateLoginInput = require('../validation/login-validation');

// Load User model
const User = require('../models/user-model')

// function to help with login, used in both endpoints
const sendToken = (user, res) => {
  let payload = {
    email: user.email,
    firstName: user.firstName,
  }

  // Sign token
  jwt.sign(
    payload,
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: 60 * 60 * 24 * 1, // 24 hours in sec, min, hr, days
    },
    (err, token) => {
      if (err) throw err
      res.json({
        success: true,
        token: 'Bearer ' + token,
      })
    },
  )
}

// @route POST api/users/register
// @desc Register user and return JWT token
// @access Public
router.post('/register', (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' })
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        email: req.body.email,
        password: req.body.password,
      })

      // Hash password before saving in database
      bcrypt.genSalt(12, (err, salt) => {
        if (err) throw err
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then((user) => sendToken(user, res))
            .catch((err) => console.log(err))
        })
      })
    }
  })
})

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
  // Form validation
  //   const { errors, isValid } = validateLoginInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }
  const email = req.body.email
  const password = req.body.password

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' })
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        sendToken(user, res)
      } else {
        return res.status(400).json({ passwordincorrect: 'Password incorrect' })
      }
    })
  })
})

module.exports = router
