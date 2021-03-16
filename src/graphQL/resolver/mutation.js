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
}
