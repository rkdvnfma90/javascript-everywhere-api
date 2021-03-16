module.exports = {
  // 요청이 오면 note의 author 정보를 resolve 한다.
  author: async (note, args, { models }) => {
    return await models.User.findById(note.author)
  },

  // 요청이 오면 note의 favoritedBy 정보를 resolve
  // 즐겨찾기 한 사람의 정보를 반환
  favoritedBy: async (note, args, { models }) => {
    return await models.User.find({ _id: { $in: note.favoritedBy } })
  },
}
