const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')

require('dotenv').config()

const db = require('./db')
const DB_HOST = process.env.DB_HOST
const PORT = process.env.PORT || 4000

// 기본 스키마 구성
const typeDefs = gql`
  type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`

// 값을 반환하는 리졸버
const resolvers = {
  Query: {
    hello: () => 'hello world! in resolver',
    notes: () => notes,
    note: (parent, args) => {
      return notes.find((note) => note.id === args.id)
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'aB',
      }
      notes.push(noteValue)
      return noteValue
    },
  },
}

const app = express()

db.connect(DB_HOST)

// 아폴로 서버 설정
const server = new ApolloServer({ typeDefs, resolvers })

let notes = [
  { id: '1', content: '안녕하세요', author: 'aB' },
  { id: '2', content: '이건 뭐죵', author: 'rkdvnfma90' },
  { id: '3', content: '헤헤', author: '강푸름' },
]

// 아폴로 그래프ql 미들웨어 적용후 경로를 /api로 설정
server.applyMiddleware({ app, path: '/api' })

app.get('/', (req, res) => res.send('Hello Wcccccorld'))
app.listen(PORT, () => {
  console.log(
    `GraphQL Server Running at the http://localhost:${PORT}${server.graphqlPath}`
  )
})
