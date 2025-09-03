SELECT
	customer_id,
    rental_date,
    COUNT(*) OVER (PARTITION BY customer_id ORDER BY rental_date) count
FROM rental;

# 고객별 대여날짜 누적 대여 횟수 계산

SELECT
	customer_id,
	rental_date,
    COUNT(*) OVER (PARTITION BY customer_id ORDER BY rental_date
					ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) counts
FROM rental;

SELECT
	customer_id,
	rental_date,
    COUNT(*) OVER (PARTITION BY customer_id ORDER BY rental_date
					ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) counts
FROM rental;

SELECT
	customer_id,
	rental_date,
    COUNT(*) OVER (PARTITION BY customer_id ORDER BY rental_date
					ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) counts
FROM rental;

SELECT
	R.customer_id,
	R.rental_date,
	P.amount,
    DATE(R.rental_date),
    SUM(P.amount) OVER (PARTITION BY R.customer_id ORDER BY rental_date
						ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) sample
FROM payment P
JOIN rental R USING(rental_id);

SELECT
	R.customer_id,
	R.rental_date,
	P.amount,
    DATE(R.rental_date),
    SUM(P.amount) OVER (PARTITION BY R.customer_id ORDER BY DATE(rental_date)
						RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) sample
FROM payment P
JOIN rental R USING(rental_id);

SELECT
	R.customer_id,
	R.rental_date,
	P.amount,
    AVG(P.amount) OVER (PARTITION BY R.customer_id ORDER BY rental_date
						ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) sample
FROM payment P
JOIN rental R USING(rental_id);

SELECT
	I.film_id,
	P.amount,
    P.payment_date,
    SUM(P.amount) OVER (PARTITION BY I.film_id ORDER BY P.payment_date
						ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) revenue
FROM payment P
JOIN rental R USING(rental_id)
JOIN inventory I USING(inventory_id);

# 장르별 = 카테고리 영화 대여 수익
# 영화 장르의 수익성 분석이 필요합니다!!!
# 영화 장르별 대여 수익의 누적합계와 전체 대여 수익 대비 비율을 출력해주세요

# rental_id // inventory_id // film_id // category_id

# WITH => 장르당 총 합계 매출금액

WITH genre_revenue AS (
	SELECT
		C.name genre,
		SUM(P.amount) revenue
	FROM payment P
	JOIN rental R USING(rental_id)
	JOIN inventory I USING(inventory_id)
	JOIN film_category FC USING(film_id)
	JOIN category C USING(category_id)
	GROUP BY C.name
)
SELECT
	genre,
    revenue,
    SUM(revenue) OVER (ORDER BY revenue DESC
						ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) revenue2,
	revenue / SUM(revenue) OVER() revenue_ratio
FROM genre_revenue;

SELECT
	rental_id,
    rental_date,
    LAG(rental_id, 1, 0) OVER (ORDER BY rental_date) prev_rental,
    LEAD(rental_id, 1, 0) OVER (ORDER BY rental_date) next_rental
FROM rental;

SELECT
	I.film_id,
    R.rental_date,
    FIRST_VALUE(R.rental_date) OVER (PARTITION BY I.film_id ORDER BY R.rental_date),
    LAST_VALUE(R.rental_date) OVER (PARTITION BY I.film_id ORDER BY R.rental_date
									ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
FROM rental R
JOIN inventory I USING(inventory_id);

SELECT
	I.film_id,
    R.rental_date,
    FIRST_VALUE(R.rental_date) OVER (PARTITION BY I.film_id ORDER BY R.rental_date),
    LAST_VALUE(R.rental_date) OVER (PARTITION BY I.film_id ORDER BY R.rental_date)
FROM rental R
JOIN inventory I USING(inventory_id);






