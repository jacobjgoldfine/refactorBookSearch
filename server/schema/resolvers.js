const { User, Book } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return User.findOne(params);
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      return user;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorect login credentails!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect login credentails!");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { userID, book }, context) => {
      if (context.user) {
        return (
          User.findOneAndUpdate({ _id: userID }, { $addToSet: { savedbooks: book } }),
          { new: true, runValidators: true }
        );
      }
    },
    deleteBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: book } }, { new: true });
      }
      throw new AuthenticationError("You need to be logged in to do this.");
    },
  },
};

module.exports = resolvers;
