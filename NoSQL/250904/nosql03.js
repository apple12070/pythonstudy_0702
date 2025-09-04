db.movies.aggregate([
  {$project: {
    title: 1,
    year: 1,
    _id: 0, 
    releasedIn: {$concat: ["$title", " / ", {$toString: "$year"}]}
    }
  },
  {$limit: 5}
])