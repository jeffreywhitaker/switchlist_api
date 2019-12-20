const JwtStrategy = require('passport-jwt').Strategy
const GoogleStrategy = require('passport-google-oauth20')
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('User')
const opts = {}
const passport = require('passport')
const { BACKEND_ROOT_DOMAIN } = require('./envConfig')

passport.serializeUser(function(user, done) {
  done(null, user)
})
passport.deserializeUser(function(user, done) {
  done(null, user)
})

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_TOKEN_SECRET

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findOne({ email: jwt_payload.email })
        .then((user) => {
          console.log('user in JWT strategy', user)
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch((err) => console.log(err))
    }),
  )
}
