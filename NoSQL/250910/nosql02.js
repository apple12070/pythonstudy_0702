// 3. 아래 3개의 내용을 $facet (*파이프 라인의 순서와 상관없이 동시 실행)
// 1) 최신영화 Top5
// 2) 고평점 영화 개수 (*8점 이상)
// 3) 장르별 영화 분포

db.movies.aggregate([
  {
    $facet: {
      latest5: [
        {$sort: {year: -1}},
        {$limit: 5},
        {$project: {_id: 0, title: 1, year: 1}}
      ],
      highRatedCount: [
        {$match: {"imdb.rating": {$gte: 8}}},
        {$count: "count"}
      ],
      genresByCount: [
        {$unwind: "$genres"},
        {$group: {_id: "$genres", count: {$sum: 1}}},
        {$sort: {count: -1}}
      ]
    }
  },
  {
    $project: {
      latest5: 1,
      highRatedCount: {$ifNull: [{$arrayElemAt: ["$highRatedCount.count", 0]}, 0]},
      genresByCount: 1
    }
  }
])