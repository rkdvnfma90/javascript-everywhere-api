module.exports = {
  // 요청이 오면 user의 notes 정보를 resolve 한다.
  notes: async (user, args, { models }) => {
    return await models.Note.find({ author: user._id }).sort({ _id: -1 })
  },

  // 요청이 오면 note의 favorites 정보를 resolve
  favorites: async (user, args, { models }) => {
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 })
  },
}
