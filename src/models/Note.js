const mongoose = require('mongoose')

// 노트의 스키마 정의
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    // Date 자료형으로 createAt과  updatedAt 필드 할당한다.
    timestamps: true,
  }
)

// 스키마와 모델 정의
const Note = mongoose.model('Note', noteSchema)
module.exports = Note
