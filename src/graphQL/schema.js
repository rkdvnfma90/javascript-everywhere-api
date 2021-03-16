const { gql } = require('apollo-server-express')

// 기본 스키마 구성
module.exports = gql`
  scalar DateTime

  type Query {
    hello: String
    notes: [Note]
    note(id: ID): Note
  }

  type Note {
    id: ID!
    content: String!
    author: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    notes: [Note]!
  }

  type Mutation {
    newNote(content: String!): Note!
    deleteNote(id: ID!): Boolean!
    updateNote(id: ID!, content: String!): Note!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
  }
`
