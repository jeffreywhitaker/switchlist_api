const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
  title: String,
  releaseDate: String,
  series: String,
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  developer: String,
  directors: [String],
  composers: [String],
  caseImg: String,
  hdRumble: Boolean,
  multiplayer: Boolean,
  cloudSaves: Boolean,
  genres: [String],
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Game', gameSchema)
