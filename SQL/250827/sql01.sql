USE sakila;
SHOW TABLES;
DESC actor;
SELECT * FROM actor LIMIT 1;

# 각 고객이 어떤 영화 카테고리를 가장 자주 대여하는지
# 알고 싶습니다. 각 고객별로 가장 많이 대여한 영화 카테고리와
# 해당 카테고리에서의 총 대여 횟수, 해당 고객 이름을 조회할 수
# 있는 SQL 쿼리문을 작성해주세요!!!

# A고객 : 액션, 드라마, 패밀리

# A - 액션 : 2
# A - 드라마 : 1
# A - 패밀리 : 3, 
# ....
# Z 
# 1000건 렌털 대여 건수


# A - 액션 / 드라마 / 패밀리 중 가장 렌탈한 횟수가 많은 카테고리를 1번더 필터링
# customer_id, inventory_id, film_id, category_id

SELECT
	C.first_name,
    C.last_name,
    CAT.name,
    COUNT(*)
FROM customer C
JOIN rental R USING(customer_id)
JOIN inventory I USING(inventory_id)
JOIN film_category FC USING(film_id)
JOIN category CAT USING(category_id)
GROUP BY C.customer_id, CAT.name
HAVING COUNT(*) = (
	SELECT COUNT(*) FROM rental R2
    JOIN inventory I2 USING(inventory_id)
    JOIN film_category FC2 USING(film_id)
    WHERE R2.customer_id = C.customer_id
    GROUP BY FC2.category_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
);

# 2006-02-14 날짜를 기준으로, 2006-01-15부터, 2006-02-14날짜까지 영화를
# 대여하지 않은 고객을 찾아주세요!!!

SELECT
	C.first_name, C.last_name
FROM customer C LEFT OUTER JOIN rental R
ON C.customer_id = R.customer_id AND
TIMESTAMPDIFF(DAY, R.rental_date, "2006-02-14") <= 30
WHERE R.rental_id IS NULL;

# 가장 최근에 영화를 반납한 상위 10명의 고객 이름과
# 해당 고객들이 대여한 영화의 이름 그리고 대여 기간을 출력해주세요!

SELECT
	C.first_name, C.last_name,
    F.title,
    TIMESTAMPDIFF(DAY, R.rental_date, R.return_date)
FROM customer C
JOIN rental R USING(customer_id)
JOIN inventory I USING(inventory_id)
JOIN film F USING(film_id)
ORDER BY R.return_date DESC
LIMIT 10;

# 각 직원의 매출을 찾고, 각 직원의 매출이 회사 전체 매출 중 어느 정도 비율을
# 차지하는지 출력해주세요. 출력결과물은 직원 ID, 직원 이름, 직원 매출,
# 회사 전체 매출 기준 직원 매출의 비율 까지 출력!!!!

SELECT
	S.staff_id,
    S.first_name, S.last_name,
    SUM(P.amount) staff_revenue,
    (SUM(P.amount) / (SELECT SUM(amount) FROM payment) * 100) revenue_percentage
FROM staff S
JOIN payment P USING(staff_id)
GROUP BY S.staff_id;




