DESC students;
SELECT * FROM students;

# 아래 구문은 students 라는 테이블 내 모든 데이터의 name 값을 변경!
UPDATE students SET name = 'David';

UPDATE students SET name = '윤대협'
WHERE id = 1;

# 만약 ID값을 새롭게 재정렬을 하고 싶다면?
ALTER TABLE students AUTO_INCREMENT = 1;

UPDATE students SET age = '16세', grade = '9학년'
WHERE id = 1;

UPDATE students SET age = '16세', grade = '9학년'
WHERE name = '서태웅';

# 아래 구문은 students 라는 테이블 내 모든 데이터를 delete 하겠다는 뜻!
DELETE FROM students;

DELETE FROM students
WHERE name = '서태웅';

DELETE FROM students
WHERE id = 2;

INSERT INTO students (name, age, grade)
VALUES("서태웅", "15세", "8학년");

INSERT INTO students VALUES(2, "강백호", "15세", "8학년");