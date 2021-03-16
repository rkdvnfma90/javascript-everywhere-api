module.exports = {
  notes: async (parent, args, { models }) => await models.Note.find(),

  // 3번째 파라미터는 context인데 src/index.js의 ApolloServer 에서 넘겨주고 있다.
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id)
  },

  user: async (parent, { username }, { models }) => {
    // 파라미터의 username과 일치하는 user 검색
    return await models.User.findOne({ username })
  },

  users: async (parent, args, { models }) => {
    // 모든 사용자 검색
    return await models.User.find({})
  },

  me: async (parent, args, { models, user }) => {
    // 현재 사용자 찾기
    return await models.User.findById(user.id)
  },
}
