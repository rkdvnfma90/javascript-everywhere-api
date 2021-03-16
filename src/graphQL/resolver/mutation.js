require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
const gravatar = require('../../util/gravatar')
const mongoose = require('mongoose')

module.exports = {
  // parent, args, context
  newNote: async (parent, args, { models, user }) => {
    // context에 user가 없으면 인증에러
    if (!user) {
      throw new AuthenticationError('작성하려면 로그인 하세요.')
    }

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
    })
  },

  deleteNote: async (parent, { id }, { models, user }) => {
    // context에 user가 없으면 인증에러
    if (!user) {
      throw new AuthenticationError('삭제하려면 로그인 하세요.')
    }

    const note = await models.Note.findById(id)
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError('본인만 삭제할 수 있습니다.')
    }

    try {
      await note.remove()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },

  updateNote: async (parent, { content, id }, { models }) => {
    // context에 user가 없으면 인증에러
    if (!user) {
      throw new AuthenticationError('수정하려면 로그인 하세요.')
    }

    const note = await models.Note.findById(id)
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError('본인만 수정할 수 있습니다.')
    }

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

  toggleFavorite: async (parent, { id }, { models, user }) => {
    // context에 user가 없으면 인증에러
    if (!user) {
      throw new AuthenticationError('즐겨찾기 하려면 로그인 하세요.')
    }

    // 이미 이 노트를 즐겨찾기 했는지 확인
    let noteCheck = await models.Note.findById(id)
    const hasUser = noteCheck.favoritedBy.indexOf(user.id)

    // 이미 즐겨찾기 했다면
    if (hasUser !== -1) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          // 해당 요소 제거
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          // 해당 필드 값 증가
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          // Set new to true to return the updated doc
          new: true,
        }
      )
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          // 해당 요소 삽입
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          // 해당 필드 값 증가
          $inc: {
            favoriteCount: 1,
          },
        },
        {
          new: true,
        }
      )
    }
  },
}
