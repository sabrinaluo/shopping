SELECT
    product . *,
    brand.name as brand_name,
    r.id AS review_id,
    r.rating,
    r.comment,
    r.date_created AS review_date,
    r.username
FROM
    product
        LEFT JOIN
    (SELECT
        a . *, user.username
    FROM
        review a
    INNER JOIN (SELECT
        product_id, MAX(date_created) AS date_created
    FROM
        review
    GROUP BY product_id) b
    INNER JOIN user ON a.product_id = b.product_id
        AND a.date_created = b.date_created
        AND user.id = a.user_id) r ON r.product_id = product.id
        left join
    brand ON brand.id = product.brand_id
ORDER BY product.date_created DESC
LIMIT 0 , 10;
