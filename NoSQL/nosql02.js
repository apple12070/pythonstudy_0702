db.createCollection("users")

db.users.insertOne(
    {subject: "coding", author: "david", views: 50}
)

db.users.find()