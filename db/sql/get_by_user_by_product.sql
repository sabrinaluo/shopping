SELECT
    user.id as user_id,
    user.usertype,
    product.id as product_id
FROM
    user
        INNER JOIN
    product ON user.id = ? AND product.id = ?;
