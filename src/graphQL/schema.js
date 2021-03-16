const { gql } = require('apollo-server-express')

// 기본 스키마 구성
module.exports = gql`
  type Query {
    hello: String
    notes: [Note]
    note(id: ID): Note
  }

  type Note {
    id: ID
    content: String
    author: String
  }

  type Mutation {
    newNote(content: String!): Note
  }
`
