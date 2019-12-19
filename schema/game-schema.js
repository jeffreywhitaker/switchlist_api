const graphql = require('graphql')
const Game = require('../models/game-model')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean,
} = graphql

const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    releaseDate: { type: GraphQLString },
    series: { type: GraphQLString },
    publisher: { type: GraphQLString },
    developer: { type: GraphQLString },
    directors: { type: new GraphQLList(GraphQLString) },
    composers: { type: new GraphQLList(GraphQLString) },
    caseImg: { type: GraphQLString },
    hdRumble: { type: GraphQLBoolean },
    multiplayer: { type: GraphQLBoolean },
    cloudSaves: { type: GraphQLBoolean },
    genres: { type: new GraphQLList(GraphQLString) },
  }),
})

// field for multiple games query
const GamesField = {
  type: new GraphQLList(GameType),
  resolve() {
    return Game.find({})
  },
}

// field for single game query
const GameField = {
  type: GameType,
  args: {
    title: { type: GraphQLString },
    releaseDate: { type: GraphQLString },
    series: { type: GraphQLString },
    publisher: { type: GraphQLString },
    developer: { type: GraphQLString },
    directors: { type: new GraphQLList(GraphQLString) },
    composers: { type: new GraphQLList(GraphQLString) },
    caseImg: { type: GraphQLString },
    hdRumble: { type: GraphQLBoolean },
    multiplayer: { type: GraphQLBoolean },
    cloudSaves: { type: GraphQLBoolean },
    genres: { type: new GraphQLList(GraphQLString) },
  },
  resolve: async (_, args) => {
    const game = await User.findOne({ title: args.title }).exec()
    // if user doen't exist
    if (!game) {
      // await user creation, then return user
      const gameToSave = await Game.create({
        title: args.title,
        releaseDate: args.releaseDate,
        series: args.series,
        publisher: args.publisher,
        developer: args.developer,
        directors: args.directors,
        composers: args.composers,
        caseImg: args.caseImg,
        hdRumble: args.hdRumble,
        multiplayer: args.multiplayer,
        cloudSaves: args.cloudSaves,
        genres: args.genres,
      })
      return gameToSave
    } else {
      return game
    }
  },
}

module.exports = {
  GameType,
  GamesField,
  GameField,
}
