db.movies.find().limit(1)
db.users.find({name: "홍길동"})

db.movies.find(
  {year: {$gte: 2010}, genres: "Action"}
//  {_id: 1, title: 1, year: 1, genres: 1}
)

db.movies.aggregate([
  {$match: {year: {$gte: 2010}, genres: "Action"}},
  {$project: {_id: 0, title: 1, year: 1, genres: 1}}
])

db.users.insertOne({
  name: "홍길동",
  email: "hong@test.com",
  password: "test123",
  preference: ["Action", "Comedy"],
  createdAt: new Date()
})

db.users.aggregate([
  {$documents: [
    {
      name: "홍길동1",
      email: "hong@test.com",
      password: "test123",
      preference: ["Action", "Comedy"],
      createdAt: new Date()
    }
  ]},
  {$merge: {into: "users"}}
])

db.comments.find().limit(5)



// 573a13adf29313caabd2b765

db.comments.insertOne({
    name: "홍길동",
    email: "hong@test.com",
    movie_id: "573a13adf29313caabd2b765",
    text: "Action 영화 최고",
    date: new Date()
})

db.comments.find({name: "홍길동1"})

// Javascript => 변수를 선언할 때, const, let, var
// const => 재선언, 재할당 불가 // 엄격한 변수
// let => 재선언 불가, 재할당 가능 // 상대적으로 덜 엄격한 변수
// var => 재선언, 재할당 가능

const m = db.movies.findOne(
  {year: {$gte: 2010}, genres: "Action"},
  {_id: 1, title: 1}
)

m._id

db.comments.insertOne({
    name: "홍길동1",
    email: "hong@test.com",
    movie_id: m._id,
    text: "Action 영화 최고",
    date: new Date()
})

db.comments.updateOne(
  {email: "hong@test.com", movie_id: m._id},
  {$set: {text: "Action 영화 진짜 재밌다!", editedAt: new Date()}}
)

db.movies.aggregate([
  {$unwind: "$genres"},
  {$group: {_id: "$genres", count: {$sum: 1} }},
  {$sort: {count: -1}},
  {$limit: 3}
])

db.movies.find(
  {"imdb.rating": {$gte: 8.5}},
  {_id: 0, title: 1, year: 1, "imdb.rating": 1}
).sort({year: -1})

db.movies.aggregate([
  {$match: {"imdb.rating": {$gte: 8.5}}},
  {$project: {_id: 0, title: 1, year: 1, "imdb.rating": 1}},
  {$sort: {year: -1}}
])

db.comments.aggregate([
  {
    $addFields: {
      textStr: {
        $convert: {
          input: "$text",
          to: "string",
          onError: "",
          onNull: ""
        }
      }
    }
  },
  {
    $addFields: {
      textLen: {$strLenCP: "$textStr"}
    }
  },
  {
    $group: {
      _id: "$email",
      totalComments: {$sum: 1},
      avgTextLength: {$avg: "$textLen"}
    }
  },
  {
    $sort: { totalComments: -1, avgTextLength: -1}
  },
  {
    $limit: 5
  }
])

db.comments.aggregate([
  {
    $addFields: {
      textLen: { $strLenCP: {$ifNull: ["$text", ""]} }
    }
  },
  {
    $group: {
      _id: "$email",
      totalComments: {$sum: 1},
      avgTextLength: {$avg: "$textLen"}
    }
  },
  {
    $sort: { totalComments: -1, avgTextLength: -1}
  },
  {
    $limit: 5
  }
])














