module.exports = {
  notes: async (parent, args, { models }) => await models.Note.find(),

  // 3번째 파라미터는 context인데 src/index.js의 ApolloServer 에서 넘겨주고 있다.
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id)
  },
}
