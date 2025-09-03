# customer 테이블과 payment 테이블을 사용해서 각 도시별 고객의 총 결제 금액 순위를 출력!
# 고객 ID, 도시, 총 결제 금액, 도시 순위

SELECT
	C.customer_id, CI.city,
    SUM(P.amount) AS total_amount,
    RANK() OVER (PARTITION BY CI.city ORDER BY SUM(P.amount) DESC) AS city_rank
FROM customer C
JOIN address A USING(address_id)
JOIN city CI USING(city_id)
JOIN payment P USING(customer_id)
GROUP BY C.customer_id;

# customer 테이블에서 고객별 대여 횟수에 따라 4개의 그룹으로 나눠주세요.
# 고객ID, 대여횟수, 그룹 -> 출력될 수 있도록 해주세요!!!!


SELECT
	C.customer_id,
    COUNT(*) AS rental_count,
    NTILE(4) OVER (ORDER BY COUNT(*) DESC)
FROM customer C
JOIN rental R USING(customer_id)
GROUP BY C.customer_id;

# film 테이블에서 영화를 대여기간에 따라서 5개의 그룹으로 나누어주세요.
# 영화 ID, 대여기간, 그룹 -> 출력되어야 할 데이터


SELECT
	film_id, rental_duration,
    NTILE(5) OVER (ORDER BY rental_duration)
FROM film;

# payment 테이블에서 각 고객별로 지불 내역에 행 번호를 부여해주세요.
# 고객별 지불 내역의 행 번호는 payment_date가 낮은 순으로 부여해주세요.
# 지불 ID, 고객 ID, 지불 날짜, 지불 금액, 행 번호 -> 출력!!!!! 


SELECT
	payment_id, customer_id, payment_date, amount,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date) AS row_numbers
FROM payment;

# film 테이블에서 각 등급별로 영화에 행 번호를 부여하세요!
# 영화는 대여기간에 따라 정렬될 수 있도록 해주세요.
# 영화 ID, 등급, 대여기간, 행번호 -> 출력!!!


SELECT
	film_id, rating, rental_duration,
    ROW_NUMBER() OVER (PARTITION BY rating ORDER BY rental_duration) AS row_numbers
FROM film;

# customer 테이블과 payment 테이블을 사용해서 고객을 총 결제금액에 따라 10개의 그룹으로 나누고
# 각 그룹 내에서 고객별 총 결제 금액에 따라 번호를 부여하세요.
# 고객 ID, 총 결제 금액, 그룹, 그룹 내 행 번호 -> 출력해주세요!


WITH CustomerPayments AS (
	SELECT
		C.customer_id,
		SUM(P.amount) AS total_amount
	FROM customer C
	JOIN payment P USING(customer_id)
	GROUP BY C.customer_id
),
CustomerGroup AS (
	SELECT
		customer_id, total_amount,
        NTILE(10) OVER (ORDER BY total_amount) AS ten
    FROM CustomerPayments
)
SELECT
	customer_id, total_amount, ten,
    ROW_NUMBER() OVER (PARTITION BY ten ORDER BY total_amount) AS row_numbers
FROM CustomerGroup;