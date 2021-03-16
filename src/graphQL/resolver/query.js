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

  noteFeed: async (parent, { cursor }, { models }) => {
    // 한번에 불러올 데이터 수의 제한
    const limit = 10
    let hasNextPage = false
    // 전달된 커서가 없으면 기본 쿼리는 빈 객체로 할당하여 DB에서 최신 노트 목록을 가져옴
    let cursorQuery = {}

    // 현재 커서 미만의 ObjectId를 가진 노트를 검색
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } }
    }

    // limit + 1 개의 노트를 가져오고 최신순으로 정렬함
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1)

    // limit + 1 개의 데이터를 가져왔기 때문에 limit 개 만큼 데이터를 반환해 준다.
    // 마지막 데이터는 커서로 사용함
    if (notes.length > limit) {
      hasNextPage = true
      notes = notes.slice(0, -1)
    }

    // 새로운 커서는 조회해온 노트의 마지막 데이터의 _id 값
    const newCursor = notes[notes.length - 1]._id

    return {
      notes,
      cursor: newCursor,
      hasNextPage,
    }
  },
}
