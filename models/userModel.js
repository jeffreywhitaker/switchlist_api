const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  password: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)