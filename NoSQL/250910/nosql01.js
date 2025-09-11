// 1. users 문서에 commentsCount 필드를 추가하고 댓글 개수계산
// 2. 댓글 길이를 기준으로 100자 이상 => LONG COMMENT
// 100자 미만 => SHORT COMMENT
// array = 배열 = list
// iterable = 반복순회가능한 자료구조
// for in => .js => 반복순회가능한 자료구조를 찾아와서 내부에있는
// 값을 하나씩 빼서 연산처리 후 다시 새로운 배열 반환해주는 문법
// map

db.users.find().limit(1)
db.comments.find().limit(1)

db.users.aggregate([
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
      commentsCount: {$size: "$c"},
      commentsAnnotated: {
        $map: {
          input: "$c",
          as: "x",
          in: {
            text: "$$x.text",
            date: "$$x.date",
            movie_id: "$$x.movie_id",
            commentType: {
              $cond: [
                {$gte: [{$strLenCP: {$ifNull:["$$x.text", ""]}}, 100]},
                "LONG COMMENT",
                "SHORT COMMENT"
              ]
            }
          }
        }
      }
    }
  }
])