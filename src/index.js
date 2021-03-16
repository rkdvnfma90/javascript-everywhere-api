require('dotenv').config()

const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('./db')
const models = require('./models')
const helmet = require('helmet')
const cors = require('cors')

const DB_HOST = process.env.DB_HOST
const PORT = process.env.PORT || 4000

const typeDefs = require('./graphQL/schema')
const resolvers = require('./graphQL/resolver')

const app = express()

app.use(helmet())
app.use(cors())

db.connect(DB_HOST)

const getUser = (token) => {
  if (token) {
    try {
      // 토큰에서 얻은 사용자 정보 반환
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error('Session invalid!')
    }
  }
}

// 아폴로 서버 설정
// 리졸버 모듈은 데이터베이스 모델을 참조하지만 접근할 수 없다.
// 이 문제를 해결하기 위해서 아폴로 서버가 context를 호출한다는 개념을 사용하여
// 서버 코드가 각 요청과 함께 개별 리졸버에 특정 정보를 전달하게 할 수 있다.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // 헤더에서 사용자 토큰 가져오기
    const token = req.headers.authorization
    // 토큰에서 사용자 정보 얻기
    const user = getUser(token)
    // context에 db models 추가
    return { models, user }
  },
})

// 아폴로 그래프ql 미들웨어 적용후 경로를 /api로 설정
server.applyMiddleware({ app, path: '/api' })

app.get('/', (req, res) => res.send('Hello Wcccccorld'))
app.listen(PORT, () => {
  console.log(
    `GraphQL Server Running at the http://localhost:${PORT}${server.graphqlPath}`
  )
})
