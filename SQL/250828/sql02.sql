# 영화 길이에 대한 백분위 순위와 누적분포 계산
# 백분위 순위 : 전체를 100% -> 0 ~ 1 => PERCENT_RANK()
# 누적분포 : 전체를 기준으로 각 그룹의 비율이 몇프로대까지인지를 누적해서 보는 것 => CUME_DIST()

SELECT
	title, length,
    PERCENT_RANK() OVER (ORDER BY length) AS percent,
    CUME_DIST() OVER (ORDER BY length) AS cume
FROM film;


SELECT
	customer_id,
    CONCAT(first_name, ", ", last_name) AS customer_name,
    NTILE(4) OVER (ORDER BY customer_id) AS customer_group
FROM customer;

# payment 테이블에서 각 고객들의 결제금액을 출력하세요.
# 단, 출력 내용은 다음과 같아야 합니다.
# 고객 ID, 고객 결제금액, 해당 행의 결제 금액의 이전 결제금액, 해당 행의 결제 금액의 다음 결제금액

SELECT
	customer_id,
	amount,
    LAG(amount) OVER (PARTITION BY customer_id ORDER BY payment_date) AS previous_amount,
    LEAD(amount) OVER (PARTITION BY customer_id ORDER BY payment_date) AS next_amount
FROM payment;

# rental 테이블에서 각 고객별로 첫번째 대여일자와 마지막 대여일자를 출력하세요.
# 출력 결과물에는 고객 ID, 첫번째 대여일자, 마지막 대여일자가 포함되어있으면 됩니다.

SELECT
	DISTINCT customer_id,
    FIRST_VALUE(rental_date) OVER
		(PARTITION BY customer_id ORDER BY rental_date) AS first_rental_date,
	LAST_VALUE(rental_date) OVER
		(PARTITION BY customer_id ORDER BY rental_date
			ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS last_rental_date
FROM rental;

# payment 테이블에서 각 직원이 처리한 첫번째 결제와 마지막 결제 금액을 출력해주세요.
# 직원ID, 해당 직원이 처리한 첫번째 결제금액, 해당직원이 처리한 마지막 결제금액

SELECT
	DISTINCT staff_id,
    FIRST_VALUE(amount) OVER
		(PARTITION BY staff_id ORDER BY payment_date) AS first_payment_amount,
	LAST_VALUE(amount) OVER
        (PARTITION BY staff_id ORDER BY payment_date
			ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_payment_amount
FROM payment;

# film 테이블에서 각 영화의 대여기간에 대한 백분위 순위, 누적분포를 계산해주세요.
# 영화제목, 대여기간, 백분위순위, 누적분포 -> 출력되게 해주세요!

SELECT
	title, rental_duration,
    PERCENT_RANK() OVER (ORDER BY rental_duration) AS percentile_rank,
    CUME_DIST() OVER (ORDER BY rental_duration) AS cumulative_distribution
FROM film;

# customer 테이블에서 각 고객의 총 결제금액에 대한 백분위 순위와 누적분포를 계산해주세요.
# 고객ID, 총 결제금액, 백분위 순위, 누적분포 -> 출력되어야할 대상


SELECT
	C.customer_id, SUM(P.amount) AS total_amount,
    PERCENT_RANK() OVER (ORDER BY SUM(P.amount) DESC) AS percentile_rank,
    CUME_DIST() OVER (ORDER BY SUM(P.amount) DESC) AS cumulative_distribution
FROM customer C
JOIN payment P USING(customer_id)
GROUP BY C.customer_id
ORDER BY total_amount;

# rental 테이블에서 각 고객별로 대여순서에 따른 누적 대여 횟수를 출력해주세요.
# 대여순서 => 대여한 날짜를 오름차순으로 정렬한 것!
# 대여 ID, 고객 ID, 대여 날짜, 누적 대여 횟수 -> 출력되어야 합니다!

SELECT
	rental_id, customer_id, rental_date,
    COUNT(*) OVER (PARTITION BY customer_id ORDER BY rental_date
					ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
                    AS cumulative_amount
FROM rental;

# payment 테이블에서 각 고객별로 결제 일자에 따른 누적 결제 금액을 출력해주세요.
# 결제 ID, 고객 ID, 결제 날짜, 결제 금액, 누적 결제 금액

SELECT
	payment_id, customer_id, payment_date, amount,
    SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date
						ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
						AS cumulative_amount
FROM payment;

# rental 테이블에서 각 직원들의 대여 날짜에 따른 대여횟수와 각 직원별 누적 대여 횟수를 출력!
# 대여ID, 직원ID, 대여날짜, 대여횟수, 누적대여횟수 -> 출력되어야하는 값!

SELECT
	rental_id, staff_id, rental_date,
    COUNT(*) OVER (PARTITION BY staff_id, DATE(rental_date) ORDER BY DATE(rental_date)
					ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS rental_count,
    COUNT(*) OVER (PARTITION BY staff_id ORDER BY DATE(rental_date)
					ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_count
FROM rental;







