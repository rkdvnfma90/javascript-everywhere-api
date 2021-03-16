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
    id: ID
    content: String
    author: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Mutation {
    newNote(content: String!): Note!
    deleteNote(id: ID!): Boolean!
    updateNote(id: ID!, content: String!): Note!
  }
`
