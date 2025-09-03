USE musinsa_db_v5;

DESC reviews;

SELECT * FROM reviews LIMIT 5;

SELECT 상품명, 리뷰
FROM reviews
WHERE 리뷰 LIKE '%좋아요%';


SELECT
	상품명,
    리뷰,
    LENGTH(리뷰) AS review_length
FROM reviews
WHERE LENGTH(리뷰) >= 100
ORDER BY LENGTH(리뷰)DESC;