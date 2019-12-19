const graphql = require('graphql')
const User = require('../models/user-model')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = graphql

// define User type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
})

// field for multiple users query
const UsersField = {
  type: new GraphQLList(UserType),
  resolve() {
    return User.find({})
  },
}

// field for single user query
const UserField = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const user = await User.findOne({ email: args.email }).exec()
    // if user doen't exist
    if (!user) {
      // await user creation, then return user
      const savedUser = await User.create({
        email: args.email,
        firstName: args.firstName,
      })
      return savedUser
    } else {
      return user
    }
  },
}

// field to add user mutation
const addUserField = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const createdUser = await User.create({
      email: args.email,
      firstName: args.firstName,
    })
    return createdUser
  },
}

// field to add user mutation
const updateUserField = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
  },
  async resolve(_, args) {
    // Only update the fields which are not undefined
    const fieldsToUpdate = {}
    const fieldNames = ['email', 'firstName']
    for (let i = 0; i < fieldNames.length; i++) {
      let fieldName = fieldNames[i]
      if (typeof args[fieldName] !== 'undefined') {
        fieldsToUpdate[fieldName] = args[fieldName]
      }
    }
    const updatedUser = await Mood.findByIdAndUpdate(args.id, fieldsToUpdate, {
      new: true,
    }).exec()
    return updatedUser
  },
}

// field to delete user mutation
const deleteUserField = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(_, args) {
    const userToRemove = User.findByIdAndRemove(args.id).exec()
    if (!userToRemove) {
      throw new Error('Could not find user for the given ID')
    }
    return userToRemove
  },
}

module.exports = {
  UserType,
  UsersField,
  UserField,
  addUserField,
  updateUserField,
  deleteUserField,
}
