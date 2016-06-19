SELECT
    pr . *,
    r.rating,
    r.comment,
    r.id AS review_id,
    u.username,
    b.name AS brand_name
FROM
    (SELECT
        p . *, r.product_id, MAX(r.date_created) AS review_date
    FROM
        (SELECT
        *
    FROM
        product
    ORDER BY date_created DESC
    LIMIT 0 , 10) p
    LEFT JOIN review r ON r.product_id = p.id
    GROUP BY p.id) pr
        LEFT JOIN
    review r ON r.product_id = pr.product_id
        AND r.date_created = pr.review_date
        LEFT JOIN
    user u ON u.id = r.user_id
        LEFT JOIN
    brand b ON b.id = pr.brand_id
ORDER BY pr.date_created DESC;
