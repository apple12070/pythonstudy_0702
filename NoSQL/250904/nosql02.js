db.movies.find()
db.comments.find()

db.movies.aggregate(
  [
    {$match: {year: 1995}}
  ]
)

db.comments.aggregate([
  {
    $group: {
      _id: "$movie_id",
      commentCount:{$sum:1}
    }
  }
])

db.comments.aggregate([
  {
    $group: {
      _id: "$movie_id",
      commentCount:{$sum:1}
    }
  },
  {
    $project: {
      year: "$_id",
      commentCount: 1,
      _id: 0
    }
  }
])

db.movies.aggregate([
  {
    $group: {
      _id: "$year",
      runtime: {$avg: "$runtime"}
//      openMovies: {$sum: 1}
    }
  }
])

db.movies.find().limit(2)

db.movies.aggregate([
  {
    $group: {
      _id: "$year",
      minRating: {$min: "$imdb.rating"}, // "5.2" => string
      maxRating: {$max: "$imdb.rating"} // 4.8 + "5.2" => 
//      averageRating: {$avg: "$imdb.rating"}
    }
  }
])

db.movies.aggregate([
  {
    $group: {
      _id: "$year",
      titles: {$push: "$title"}
    }
  }
])

db.movies.find(
  {"imdb.rating": ""}
).limit(5)

db.movies.aggregate([
  {
    $addFields: {
      ratingNum: {
        $convert: {
          input: "$imdb.rating",
          to: "double", // 실수자료형으로 자료의 값을 변경하는 역할!!!
          onError: null, // "", "abc" -> null
          onNull: null // 진짜 null -> null
        }
      }
    }
  },
  {
    $match: {ratingNum: {$ne: null}}
  },
  {
    $group: {
      _id: "$year",
      minRating: {$min: "$ratingNum"},
      maxRating: {$max: "$ratingNum"}
    }
  }
])

db.movies.aggregate([
  {
    $group: {
      _id: "$year",
      directors: {$push: "$directors"} // 기존 데이터가 배열의 형태 => 다시 배열로 가지고 온 상황
    }
  }
])

// $addToSet : 동일한 중복값을 제거하고 한번만 가져오는 역할
// 동일한 감독의 값을 가지고 있었을 경우, 1번만 출력!!!
db.movies.aggregate([
  {
    $group: {
      _id: "$year",
      directors: {$addToSet: "$directors"} // 기존 데이터가 배열의 형태 => 다시 배열로 가지고 온 상황
    }
  }
])

db.movies.find()

db.movies.aggregate([
  {$unwind: "$genres"},
  {
    $group: {
      _id: "$year",
      genres: {$addToSet: "$genres"} // [스포츠], [스포츠]
      // 객체지향언어 => set함수 => 중복되는 값을 제거하고, 1번만 값을 가져오는 함
    }
  }
])

db.movies.aggregate([
  {
    $group: {
      _id: "$year",
      firstMovie: {$first: "$title"},
      lastMovie: {$last: "$title"}
    }
  }
])

db.movies.aggregate([
  {
    $group: {
      _id: "$year",
      avgTitleLength: {$avg: {$strLenCP: {$toString: "$title"}}}
    }
  }
])

db.movies.aggregate([
  {$match: {year: {$gte: 2000}}},
  {$count: "movies_since_2000"}
])

db.movies.find().limit(5) // 메서드 체이닝 기법

db.movies.aggregate([
  {$sort: {"year": 1, "title": 1}},
  {$limit: 10}
])

db.movies.aggregate([
  {$limit: 5}
])

db.movies.aggregate([
  {$sort: {"imdb.rating": 1}}
//  {$limit: 5}
])

// 1. 2000년 이후로 제작된(*year) 영화의 수는 몇 개인가요?
db.movies.aggregate([
  {$match: {year: {$gte: 2000}}},
  {$count: "total_movies"}
])

// 2. 각 연도별로 출시된 영화의 개수는?
db.movies.aggregate([
  {$group: 
    {_id: "$year", count: {$sum: 1}}
  },
  {$sort: {_id: 1}}
])

// 3. 가장 많은 영화가 출시된 연도는 언제일까?
db.movies.aggregate([
  {$group: {
    _id: "$year",
    count: {$sum: 1}
  }},
  {$sort: {count: -1}},
  {$limit: 1}
])

// 4. 각 연도별 평균 영화 러닝타임은 어떻게 될까요?
db.movies.aggregate([
  {$group:
    {_id: "$year", avgRuntime: {$avg: "$runtime"}}
  },
  {$sort: {avgRuntime: -1}}
])

// 5. 러닝타임이 가장 긴 영화는 어떤 영화인가요?
db.movies.aggregate([
  {$sort: {runtime: -1}},
  {$limit: 1}
])

// 6. 각 영화 장르별 평균 평점은 어떻게 될까요?
db.movies.aggregate([
  {$unwind: "$genres"},
  {$group: {
    _id: "$genres",
    avgRating: {$avg: "$imdb.rating"}
  }},
  {$sort: {avgRating: 1}}
])

// 7. 각 연도별 영화 제목의 평균 길이를 구해주세요!
db.movies.aggregate([
  {$group: {
    _id: "$year",
    avgTitleLength: {$avg: {$strLenCP: {$toString: "$title"}}}
  }},
  {$sort: {avgTitleLength: 1}}
])

// 8. 각 연도별 가장 먼저 출시된(*year) 영화의 제목은 무엇인가요?
db.movies.aggregate([
  {$sort:{"year": 1, "released": 1}},
  {$group: {_id: "$year", firstMovie: {$first: "$title"}}},
  {$sort: {_id: 1}}
])

// 9. 각 연도별 개봉된 영화의 장르들을 출력해주세요. (단, 장르는 1번씩만 출력되어야함)
db.movies.aggregate([
  {$unwind: "$genres"},
  {$group: {_id: "$year", uniqueGenres: {$addToSet: "$genres"}}},
  {$sort: {_id: 1}}
])





