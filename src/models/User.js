const mongoose = require('mongoose')

// 노트의 스키마 정의
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    // Date 자료형으로 createAt과  updatedAt 필드 할당한다.
    timestamps: true,
  }
)

// 스키마와 모델 정의
const User = mongoose.model('User', userSchema)
module.exports = User
