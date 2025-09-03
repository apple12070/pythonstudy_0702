# 1. 각 고객별 결제 금액에 따른 순위를 출력해주세요.
# 고객ID, 렌탈ID, 고객의 결제 금액에 따른 순위
# 순위를 출력할 때, 동일한 값이 있을 경우, 순위를 부여하고, 다음 순위는 건너뛰지 않습니다.

SELECT
	customer_id, rental_id, amount,
    DENSE_RANK() OVER
		(PARTITION BY customer_id ORDER BY amount DESC) AS amount_rank
FROM payment;

# 2. 고객별 대여날짜 시간 순(*오름차순)으로 정렬 후 아래 내용을 출력해주세요.
# 고객 ID, 렌탈 ID, 대여날짜 시간, 해당 대여날짜 시간을 기준으로 다음 대여날짜 시간

SELECT
	customer_id, rental_id, rental_date,
    LEAD(rental_date) OVER
		(PARTITION BY customer_id ORDER BY rental_date) AS next_rental_date
FROM rental;

# 3. 각 등급별로 대여기간이 가장 긴 영화의 제목을 출력하세요.

SELECT
	DISTINCT rating,
    FIRST_VALUE(title) OVER
		(PARTITION BY rating ORDER BY rental_duration DESC)
		AS longest_retal_movie
FROM film;

# 4. 각 고객을 활동상태가 높은 순으로 정렬하고, 이를 기준으로 3개의 그룹으로 나누세요.
# 활동상태가 높다는 의미 -> active가 1인 경우!
# 그룹 내 고객의 순서를 customer_id가 낮은 순으로 정렬해주세요.
# 정렬 후 행번호를 매겨주세요.
# customer_id, first_name, last_name, active, active_group, group_row_number

WITH RankedCustomers AS (
	SELECT
		customer_id, first_name, last_name, active,
		NTILE(3) OVER (ORDER BY active DESC) AS active_group
	FROM customer
)
SELECT
	customer_id, first_name, last_name, active, active_group,
    ROW_NUMBER() OVER (PARTITION BY active_group ORDER BY customer_id)
						AS group_row_number
FROM RankedCustomers;

# 5. 영화 대여 내역에서 고객별 대여순서 출력, 이전 대여와의 간격 (Day 단위 기준) 정보 출력, 첫번째 대여일시 출력
# 위 3가지를 포함한 내용을 출력해주세요
# customer_id, rental_id, rental_date, rental_order, prev_rental_gap, first_rental_date 

SELECT
	customer_id, rental_id, rental_date,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY rental_date)
						AS rental_order,
	DATEDIFF(
		rental_date,
        LAG(rental_date) OVER (PARTITION BY customer_id ORDER BY rental_date)
    ) AS prev_rental_gap,
    FIRST_VALUE(rental_date) OVER (PARTITION BY customer_id ORDER BY rental_date)
									AS first_rental_date
FROM rental;

# 6. 각 고객의 결제 금액에 따른 순위(결제금액이 높은 순으로 정렬, 만약 동일한 값이 존재하는 경우,
# 같은 순위를 부여하지만, 다음 순위는 건너뛰지 않는다)를 출력해주시고, 백분위 순위(결제금액이 높은 순으로 정렬) 출력
# 2개 출력!!!

WITH payment_info AS (
	SELECT
		customer_id, SUM(amount) AS total_amount
	FROM payment
	GROUP BY customer_id
)
SELECT
	customer_id, total_amount,
    DENSE_RANK() OVER (ORDER BY total_amount DESC) AS total_amount_rank,
    PERCENT_RANK() OVER (ORDER BY total_amount DESC) AS total_amount_pct_rank
FROM payment_info;

# 7. 각 등급별로 영화를 대여기간에 따라 4개의 그룹으로 나누고, 각 그룹 내에서
# rental_duration이 낮은거에서 높은순으로 번호를 매겨서 영화를 출력해주세요.
# film_id, title, rating, rental_duration, rental_duration_group, group_row_number


WITH FilmGroups AS (
	SELECT
		film_id, title, rating, rental_duration,
		NTILE(4) OVER (PARTITION BY rating ORDER BY rental_duration)
						AS rental_duration_group
	FROM film
)
SELECT
	film_id, title, rating, rental_duration, rental_duration_group,
    ROW_NUMBER() OVER (PARTITION BY rental_duration_group ORDER BY rental_duration)
						AS group_row_number
FROM FilmGroups;

# 8. 각 배우의 출연 영화 수에 따른 누적 분포를 다음정보와 함께 출력해주세요
# actor_id, first_name, last_name, film_count, film_count_cume_dist

WITH actor_film AS (
	SELECT
		A.actor_id, first_name, last_name,
		COUNT(*) AS film_count
	FROM actor A
	JOIN film_actor FA USING(actor_id)
	GROUP BY A.actor_id
)
SELECT
	actor_id, first_name, last_name, film_count,
    CUME_DIST() OVER (ORDER BY film_count) AS film_count_cum_dist
FROM actor_film;






