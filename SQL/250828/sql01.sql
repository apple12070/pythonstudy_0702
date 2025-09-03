# sakila DB를 참고해서,
# 가장 많은 영화를 대여한 고객
# (*단, 가장 많은 영화의 기준
# 동일한 영화를 반복해서 대여한 경우의 수는 제외
# 오직 서로 다른 영화를 대여했다는 기준으로만) 을 찾아내고,
# 해당 고객이 대여한 영화 갯수를 찾아주세요.
# 또한 해당 고객이 대여한 영화가 가장 많이 속한 카테고리
# (*단, 이때에는 동일한 영화를 반복해서 대여한 경우의 수도 포함)
# 도 찾아주세요.

USE sakila;

WITH CustomerUniqueFilms AS (
	SELECT
		C.customer_id,
		CONCAT(C.first_name, ", ", C.last_name) AS customer_name,
		-- COUNT(*)
		COUNT(DISTINCT I.film_id) AS unique_films_rented
	FROM customer C
	JOIN rental R USING(customer_id)
	JOIN inventory I USING(inventory_id)
	GROUP BY C.customer_id
),
MaxUniqueFilms AS (
	SELECT MAX(unique_films_rented) AS max_unique_films
    FROM CustomerUniqueFilms
)
SELECT
	CUF.customer_id,
    CUF.customer_name,
    CUF.unique_films_rented,
    (
		SELECT GROUP_CONCAT(name ORDER BY name)
        FROM (
			SELECT CAT.name, COUNT(*) AS category_count
            FROM category CAT
            JOIN film_category FC USING(category_id)
            JOIN inventory INV USING(film_id)
            JOIN rental REN USING(inventory_id)
            WHERE REN.customer_id = CUF.customer_id
            GROUP BY CAT.name
        ) AS inner_cat
        WHERE category_count = (
			SELECT MAX(category_count2)
            FROM (
				SELECT COUNT(*) AS category_count2
				FROM category CAT2
				JOIN film_category FC2 USING(category_id)
				JOIN inventory INV2 USING(film_id)
				JOIN rental REN2 USING(inventory_id)
				WHERE REN2.customer_id = CUF.customer_id
				GROUP BY CAT2.name
            ) AS subquery_cat
        )
    ) AS category_name
FROM CustomerUniqueFilms AS CUF
JOIN MaxUniqueFilms MUF ON CUF.unique_films_rented = MUF.max_unique_films;












