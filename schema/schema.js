const graphql = require('graphql')
const {
  UsersField,
  UserField,
  addUserField,
  updateUserField,
  deleteUserField,
} = require('./user-schema')
const {
  GamesField,
  GameField,
  // addGameField,
  // updateGameField,
  // deleteGameField,
} = require('./game-schema')
const { GraphQLObjectType, GraphQLSchema } = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: UsersField,
    user: UserField,
    games: GamesField,
    game: GameField,
  },
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // users
    addUser: addUserField,
    updateUser: updateUserField,
    deleteUser: deleteUserField,
    // games
    // addGame: addGameField,
    // updateGame: updateGameField,
    // deleteGame: deleteGameField,
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
