// 로컬컴퓨터 내 db 목록 확인
show dbs

// 특정 db에 접속
use funcoding
use nosql01

// 특정 db안에 컬렉션을 보고자 할 때
show collections

// 특정 컬렉션안에 데이터를 확인하고자 할 때
db.test.find()

// 특정 db의 상태정보를 확인할 때
db.stats()

// 특정 db를 삭제하고자 할 때 -> 주의해야할 사항
// db가 삭제된다는 것은 당연히 db안에 있는 컬렉션도 같이 삭제가 된다는 의미
db.dropDatabase()

// 특정 db > 컬렉션 삭제
db.test.drop()

// 컬렉션 생성 -> CLI 방식 VS GUI 방식
db.createCollection("test")

use funcoding

// 컬렉션을 생성하는 2가지 방식

/*

1) 특정 옵션 없이 단순 컬렉션 생성 방식
2) 별도의 옵션을 설정해서 컬렉션 생성 방식
- capped : true => 고정된 크기의 컬렉션을 갖도록 하겠다는 의미
- size : byte의 단위로 입력하게끔 되어있음
- 2진수로 데이터를 처리 => 2진법 => 데이터 처리.저장 단위의 최소 단위
- bit
- 1byte = 8bit
- 1kb = 2^10 = 1024
1 x 1000
- 1mb = 1 x 1024 x 1024 = 1,048,576 bytes
- 5mb = 5 x 1024 x 1024 = 5,242,880 bytes


- max : 해당 컬렉션 안에 저장할 수 있는 데이터 (*= 문서), 몇 개의 문서를 허용할 것인가
- autoIndexId : true => 모든 문서를 생성할 때마다 _id 필드에 대한 값을 자동으로 설정할 것인가

*/

db.createCollection("log", {
    capped: true,
    size: 5242880,
    max: 5000
})

db.log.isCapped()
db.test.isCapped()

// 이미 생성된 컬렉션 이름을 수정하고자 할 때
db.log.renameCollection("test01")

// db > collection > document
/*

SQL :
INSERT INTO tablename(field name) VALUES (value);

NoSQL :
db.collectionname.insertOne(
    {
        name: "David",
        age: 20,
        status: "pending"
    }
)

db.collectionname.insertMany(
    [
        {subject: "coffee", author: "abc", views: 50},
        {subject: "shopping", author: "def", views: 100}
    ]
)

*/

db.createCollection("users")

db.users.insertOne(
    {subject: "coding", author: "funcoding", views: 50}
)

// 해당 컬렉션 내부에 있는 값을 확인하고자 할 때
db.users.find()

// 해당 컬렉션 내부에 여러개 문서를 동시에 입력
db.users.insertMany(
    [
        {subject: "coffee", author: "xyz", views: 50},
        {subject: "Coffee Shopping", author: "efg", views: 5},
        {subject: "Baking a cake", author: "abc", views: 90},
        {subject: "baking", author: "xyz", views: 100},
        {subject: "Cafe", author: "abc", views: 200},
    ]
)

// NoSQL 구문/문법은 SQL 대비 상대적으로 유연한 문법 체계를 가지고 있음
// {subject: "coffee02", author: 123, views: "zyt"},

// SQL 내 Schema를 정의했던 것처럼 NoSQL에서도 사전에 Schema Validation 유효성 기능설정
db.createCollection("users2", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["subject", "author", "views"],
            properties: {
                subject: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                author: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                views: {
                    bsonType: "int",
                    description: "must be a integer and is required"
                },
            }
        }
    },
    validationAction: "error"
})

db.users.drop()

// users 컬렉션 생성
// 다음과 같은 데이터를 삽입

/*
컬렉션 내 size는 100000로 생성
name, age, hobby, address 키

David, 45, "서울"
Dave, 25, "경기도"
Andy, 50, "골프", "경기도"
Kate, 35, "수원시"
Brown, 8
*/

db.createCollection("users", {
  capped: true, size: 100000
})

db.users.insertMany(
  [
    {name: "David", age: 45, address: "서울"},
    {name: "Dave", age: 25, address: "경기"},
    {name: "Andy", age: 50, hobby: "골프", address: "경기도"},
    {name: "Kate", age: 35, address: "수원시"},
    {name: "Brown", age: 8}
  ]
)

// find() : 해당 컬렉션 안에 있는 모든 데이터를 읽기 위한 목적 함
db.users.find()

/*
만약, 특정 조건에 해당되는 값을 찾아오고 싶다면?

SELECT * FROM users;
db.users.find()

SELECT _id, name, address FROM users
db.users.find({}, {name: 1, address: 1})

> truthy, falsy : python => 0 / 1
> {} : 직접 입력 및 삽입한 값 뿐만 아니라 자동적으로 내장되어있는 값까지 모두 찾아온다는 의미 = all
> {특정 값을 입력} : 조건

SELECT name, address FROM users
db.users.find({}, {name: 1, address: 1, _id: 0})

SELECT * FROM users WHERE address = "서울";
db.users.find({address: "서울"})

*/

// findOne() : 매칭되어지는 한개의 document 문서를 검색해서 찾아온다

// 어떤 쿼리의 조건을 의미하는 명칭 : query criteria (*기준)

/*

db.users.find(
  {age: {$gt: 18}}, -> query criteria
  {name: 1, address: 1} -> projection
).limit(5) -> cursor modifier

*/

// users Collection에서 Dave인 문서의 name, age, address, _id를 출력!!!

db.users.find(
  {name: "Dave"},
  {name: 1, age: 1, address: 1}
)

db.users.find(
  {name: "Kate"},
  {name: 1, age: 1, address: 1, _id: 0}
)

// $gt : 18 -> age > 25

// 비교연산자
/*
$eq : =
$gt : >
$gte : >=
$lt : <
$lte : <=
$nin : 특정 값을 갖고있지 않은경우
$in : 특정 값을 갖고있는 경우 (*배열의 자료형태 -> 복수의 값을 기준으로 검색)
$ne : not enough (*단일 값의 형태)

SELECT * FROM users WHERE age > 25;
db.users.find({age: {$gt: 25}})

SELECT * FROM users WHERE age < 25;
db.users.find({age: {$lt: 25}})

SELECT * FROM users WHERE age > 25 AND age <= 50;
db.users.find({age: {$lte: 50, $gt: 25}})

*/

db.users.find(
  {age: {$gt: 65}}
)

db.users.find(
  {age: {$lt: 25}}
)

db.users.find(
  {age: {$gt: 25, $lt: 50}}
)

db.users.find(
  {age: {$in:[45, 50]}}
)

db.users.find(
  {age: {$nin:[45, 50]}}
)

db.users.find(
  {age: {$nin:[25, 45]}}
)

db.users.find(
  {age: {$ne:25}}
)

// 특정조건에 해당되지 않으면 전체데이터를 출력하는 경우 있음
// 특수조건 함수의 경우, 전체데이터 출력함!!!

/*

1) age가 20보다 큰 문서의 name만 출력
2) age가 50이고, address가 경기도인 문서의 name만 출력
3) age가 30보다 작은 문서의 name과 age 출력

*/

db.users.find(
  {age: {$gt: 20}},
  {name: 1, _id: 0}
)

db.users.find(
  {age:{$eq: 50}, address: "경기도"},
  {name: 1, _id: 0}
)

db.users.find(
  {age:50, address: "경기도"},
  {name: 1, _id: 0}
)

db.users.find(
  {age: {$lt: 30}},
  {name: 1, age: 1, _id: 0}
)

// 논리연산 문법
/*

SELECT * FROM users WHERE address = "서울" AND age = 45;
db.users.find(
  {$and: [{address: "서울"}, {age: 45}]}
)

SELECT * FROM users WHERE address = "경기도" OR age = 45;
db.users.find(
  {$or: [{address: "경기도"}, {age: 45}]}
)

SELECT * FROM users WHERE age != 45
db.users.find({age: {$not: {$eq: 45}}}) 
db.users.find({age: {$ne: 45}})

*/

db.users.find(
  {$and:[{address: "서울"}, {age: {$eq:45}}]}
)

// name이 Brown이거나, age가 35인 모든 값 출력!!!
db.users.find(
  {$or:[{name: "Brown"}, {age: 35}]}
)

// 정규표현식 -> 어떤 특정 문자열을 찾아오도록 설정 => 패턴
// 해당 패턴에 부가적으로 옵션 -> 플래그

// SELECT * FROM users WHERE name like "%Da%"

db.users.find(
  {name: {$regex:/Da/}}
)

/*

name 키(*필드명) > 값이 "Da"로 시작하는 모든 문서를 찾아라!!!
db.users.find(
  {name: {$regex: /^Da/ }}
)

db.users.find(
  {name: /^Da/}
)

*/

// 정렬 (sort)

/*
SELECT * FROM users WHERE address = "경기도"
ORDER BY age ASC

db.users.find(
  {address: "경기도"}
).sort({age: 1})

db.users.find(
  {address: "경기도"}
).sort({age: -1})

*/

db.users.find(
  {address:"경기도"}
).sort({age: -1})

// 현재 컬렉션 내 문서의 개수 확인하고자 할 때 : count()
db.users.find().count() // 정석적인 구문
db.users.count()

// 현재 컬렉션 내 필드 존재 여부로 문서 개수 확인하고자 할 때 : $exists => 속성

// $가 붙어있다는 것은 NoSQL 문법에서 예약어로 사용되고 있다
// $가 붙어있는 예약어 중에서 연산자, 속성

db.users.count(
  {address:{$exists:false}}
)

db.users.find({address:{$exists:true}}).count()
db.users.find({address:{$exists:false}}).count()

// 중복제거 : distinct
/*
SELECT DISTINCT(address) FROM users;
db.users.distinct("address")

결과값이 같은 비슷한 구문!!!!
db.users.findOne()
db.users.find().limit(1)

*/

db.users.distinct("address")
db.users.find()

// 데이터 수정!!!! =>

// 이미 생성된 컬렉션 안에 신규값을 추가!!!!

db.users.insertMany(
  [
    {name: "유진", age: 25, hobbies: ["독서", "영화", "요리"]},
    {name: "동현", age: 30, hobbies: ["축구", "음악", "영화"]},
    {name: "혜", age: 35, hobbies: ["요리", "여행", "독서"]}
  ]
)

// $all : 배열 자료구조를 갖고 있는 필드에서 조건에 충족되는 모든 값을 포함하는 문서를 찾아올 
db.users.find(
  {hobbies: {$all: ["축구", "음악"]}}
)

// SELECT * FROM users WHERE hobbies LIKE "%축구%" AND "%음악%"

// Document 수정
/*
1) updateOne(*정석) // update
- 매칭되는 1개의 문서를 업데이트 할 때 사용

2) updateMany
- 매칭되는 모든 문서를 업데이트 할 때 사용

db.users.updateMany(
  {age: {$gt: 25}},
  {$set: {address: "서울"}}
)

UPDATE users SET address = "서울" WHERE age > 25;

*/

// age가 40보다 큰 문서의 address를 "수원시"로 변경하기!!

db.users.updateMany(
  {age: {$gt: 40}},
  {$set: {address: "수원시"}}
)

db.users.find()

db.users.updateOne(
  {name: "유진"},
  {$set: {age: 26}}
)

db.users.updateOne(
  {name: "Dave"},
  {$set: {address: "경기도"}}
)

// 특정 조건에 부합하는 경우, 통으로 문서를 대체(*replace)하는 구문






