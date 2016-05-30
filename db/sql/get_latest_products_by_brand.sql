SELECT
    t.product_id,
    t.product_name,
    t.description,
    t.brand_name,
    t.date_created,
    review.rating,
    review.comment,
    MAX(review.date_created) AS latest_review_date,
    user.username
FROM
    (SELECT
        product.id AS product_id,
            product.name AS product_name,
            product.description,
            brand.name AS brand_name,
            product.date_created
    FROM
        product
    LEFT JOIN brand ON brand.id = product.brand_id
    WHERE brand.id = ?
    ORDER BY date_created DESC
    LIMIT 1,10) t
        LEFT JOIN
    review ON review.product_id = t.product_id
        LEFT JOIN
    user ON user.id = review.user_id
GROUP BY t.product_id
ORDER BY t.date_created DESC;
