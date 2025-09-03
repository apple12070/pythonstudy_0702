SELECT
	title,
    length,
    RANK() OVER (ORDER BY length DESC) AS ranking,
    DENSE_RANK() OVER (ORDER BY length DESC) AS dense_ranking,
    ROW_NUMBER() OVER (ORDER BY length DESC) AS row_numbers
FROM film
ORDER BY length DESC;


SELECT
	C.customer_id,
    CONCAT(C.first_name, " ", C.last_name) customer_name,
    SUM(P.amount) total_amount,
    RANK() OVER (ORDER BY SUM(P.amount) DESC) ranking,
    DENSE_RANK() OVER (ORDER BY SUM(P.amount) DESC) dense_ranking,
    ROW_NUMBER() OVER (ORDER BY SUM(P.amount) DESC) row_numbers
FROM customer C
JOIN payment P USING(customer_id)
GROUP BY C.customer_id;


SELECT
	customer_id,
    rental_date,
    COUNT(*) OVER (PARTITION BY customer_id ORDER BY rental_date
					ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) cumulative_rentals
FROM rental;


SELECT
	R.customer_id,
    R.rental_date,
    P.amount,
    SUM(P.amount) OVER (PARTITION BY R.customer_id ORDER BY DATE(R.rental_date))
FROM rental R
JOIN payment P USING(rental_id);

# customer 테이블에서 고객의 총 지출 금액을 계산하고, 총 지출 금액에 따라 고객의 순위를 매기세요.
# 출력되어질 결과값은 고객ID, 고객이름, 총 지출 금액, 순위(rank)가 포함되도록 해주세요!

SELECT
	C.customer_id,
    CONCAT(C.first_name, ", ", last_name),
    SUM(P.amount),
    RANK() OVER (ORDER BY SUM(P.amount) DESC) ranking
FROM customer C
JOIN payment P USING(customer_id)
GROUP BY C.customer_id;

# film 테이블에서 각 영화의 대여횟수를 계산하고 대여횟수에 따라 영화의 순위를 매겨주세요.
# 만약 같은 대여 횟수가 발생했을 때에는 다음번째 순위를 건너뛰지 않고 출력해주세요.
# 출력해야할 값은 영화제목, 대여횟수, 순위가 포함될 수 있도록해주세요!!


SELECT
	F.title,
    COUNT(*) rental_count,
    DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) ranking
FROM film F
JOIN inventory I USING(film_id)
JOIN rental R USING(inventory_id)
GROUP BY F.film_id;








