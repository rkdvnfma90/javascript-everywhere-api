require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
const gravatar = require('../../util/gravatar')
const { model } = require('mongoose')

module.exports = {
  newNote: async (parent, args, { models }) => {
    return await models.Note.create({
      content: args.content,
      author: 'aB',
    })
  },
  deleteNote: async (parent, { id }, { models }) => {
    try {
      await models.Note.findOneAndRemove({ _id: id })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  updateNote: async (parent, { content, id }, { models }) => {
    // 첫 번째 파라미터 : 데이터베이스에서 업데이트할 데이터를 찾는 조건
    // 두 번째 파라미터 : $set을 통해 업데이트할 내용
    // 세 번째 파라미터 : 업데이트된 노트 내용을 반환하도록 함
    return await models.Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content,
        },
      },
      { new: true }
    )
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase()
    // 패스워드 해쉬
    const hashed = await bcrypt.hash(password, 10)
    // 아바타 생성
    const avatar = gravatar(email)

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      })

      // JWT 생성 후 반환
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error('계정생성중 에러가 발생하였습니다.')
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase()
    }

    // email or username으로 사용자 검색
    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    })

    if (!user) {
      throw new AuthenticationError('해당 사용자를 찾을 수 없습니다.')
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      throw new AuthenticationError('비밀번호가 일치하지 않습니다.')
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  },
}
