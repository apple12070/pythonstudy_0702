db.users.aggregate([
  { $limit: 1 }, // 싱글턴 입력 → 이후는 facet로 병렬 분석

  {
    $facet: {

      // 1) 사용자-댓글 조인 + 댓글 길이 분류(LONG/SHORT) + 사용자별 댓글 수
      user_comments_overview: [
        {
          $lookup: {
            from: "users",
            pipeline: [
              {
                $lookup: {
                  from: "comments",
                  localField: "email",
                  foreignField: "email",
                  as: "user_comments"
                }
              },
              {
                $addFields: {
                  commentsCount: { $size: "$user_comments" },
                  // 각 댓글에 commentType 부여 ($cond)
                  commentsAnnotated: {
                    $map: {
                      input: "$user_comments",
                      as: "c",
                      in: {
                        text: "$$c.text",
                        date: "$$c.date",
                        movie_id: "$$c.movie_id",
                        commentType: {
                          $cond: [
                            { $gte: [ { $strLenCP: { $ifNull: ["$$c.text", ""] } }, 100 ] },
                            "LONG COMMENT",
                            "SHORT COMMENT"
                          ]
                        }
                      }
                    }
                  }
                }
              },
              { $project: { _id: 0, name: 1, email: 1, commentsCount: 1, commentsAnnotated: 1 } }
            ],
            as: "users_with_comments"
          }
        },
        { $project: { _id: 0, users_with_comments: 1 } }
      ],

      // 2) 영화 다각 분석을 한 번에 ($facet in $lookup)
      movies_report: [
        {
          $lookup: {
            from: "movies",
            pipeline: [
              {
                $facet: {
                  latest5: [
                    { $sort: { year: -1 } },
                    { $limit: 5 },
                    { $project: { _id: 0, title: 1, year: 1 } }
                  ],
                  highRatedCount: [
                    { $match: { "imdb.rating": { $gte: 8 } } },
                    { $count: "count" }
                  ],
                  genresByCount: [
                    { $unwind: "$genres" },
                    { $group: { _id: "$genres", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                  ]
                }
              },
              {
                // highRatedCount는 배열로 나오므로 0번째를 꺼내거나 0 기본값
                $project: {
                  _id: 0,
                  latest5: 1,
                  highRatedCount: { $ifNull: [ { $arrayElemAt: [ "$highRatedCount.count", 0 ] }, 0 ] },
                  genresByCount: 1
                }
              }
            ],
            as: "movies_report"
          }
        },
        { $project: { _id: 0, movies_report: { $arrayElemAt: [ "$movies_report", 0 ] } } }
      ],

      // 3) 사용자 활동: 댓글 수 TOP3 / 평균 댓글 길이 TOP3 / 댓글 없는 사용자
      user_activity: [
        {
          $lookup: {
            from: "users",
            pipeline: [
              {
                $lookup: {
                  from: "comments",
                  localField: "email",
                  foreignField: "email",
                  as: "c"
                }
              },
              {
                $addFields: {
                  totalComments: { $size: "$c" },
                  avgTextLen: {
                    $avg: {
                      $map: {
                        input: "$c",
                        as: "x",
                        in: { $strLenCP: { $ifNull: [ "$$x.text", "" ] } }
                      }
                    }
                  }
                }
              },
              {
                $facet: {
                  topByComments: [
                    { $sort: { totalComments: -1 } },
                    { $limit: 3 },
                    { $project: { _id: 0, name: 1, email: 1, totalComments: 1 } }
                  ],
                  topByAvgLen: [
                    { $sort: { avgTextLen: -1 } },
                    { $limit: 3 },
                    { $project: { _id: 0, name: 1, email: 1, avgTextLen: { $round: [ "$avgTextLen", 2 ] } } }
                  ],
                  noCommentUsers: [
                    { $match: { totalComments: 0 } },
                    { $project: { _id: 0, name: 1, email: 1 } }
                  ]
                }
              }
            ],
            as: "user_activity"
          }
        },
        { $project: { _id: 0, user_activity: { $arrayElemAt: [ "$user_activity", 0 ] } } }
      ],

      // 4) $$KEEP / $$PRUNE: imdb.rating >= 7 영화에 달린 댓글만 유지
      comments_filtered_by_rating: [
        {
          $lookup: {
            from: "comments",
            pipeline: [
              {
                $lookup: {
                  from: "movies",
                  localField: "movie_id",
                  foreignField: "_id",
                  as: "m"
                }
              },
              { $unwind: "$m" },
              {
                $redact: {
                  $cond: [
                    { $gte: [ "$m.imdb.rating", 7 ] },
                    "$$KEEP",
                    "$$PRUNE"
                  ]
                }
              },
              { $project: { _id: 0, email: 1, movie_id: 1, text: 1, rating: "$m.imdb.rating", date: 1 } }
            ],
            as: "kept_comments"
          }
        },
        // 결과가 많을 수 있으니 미리보기만
        { $project: { _id: 0, sample: { $slice: [ "$kept_comments", 10 ] } } }
      ],

      // 5) theaters에서 state = "CA"만 남기기 ($redact + $$PRUNE/$$DESCEND)
      theaters_in_CA: [
        {
          $lookup: {
            from: "theaters",
            pipeline: [
              {
                $redact: {
                  $cond: [
                    { $eq: [ "$location.address.state", "CA" ] },
                    "$$KEEP",
                    // 주소 트리를 더 내려가 볼 필요 없으면 PRUNE.
                    // (필요 시 구조에 맞춰 $$DESCEND로 내려가며 조건 검사 가능)
                    "$$PRUNE"
                  ]
                }
              },
              { $project: { _id: 0, theaterId: 1, "location.address": 1 } }
            ],
            as: "theaters_CA"
          }
        },
        { $project: { _id: 0, theaters_CA: 1 } }
      ]

    } // facet end
  }
]);