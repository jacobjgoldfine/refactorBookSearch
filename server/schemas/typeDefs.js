const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookID: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getSingleUser(params: ID): User
  }

  input bookInput {
    bookID: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(name: String!, email: String!, password: String!): Auth
    saveBook(input: bookInput): User
    deleteBook(bookID: ID): User
  }
`;

module.exports = typeDefs;
