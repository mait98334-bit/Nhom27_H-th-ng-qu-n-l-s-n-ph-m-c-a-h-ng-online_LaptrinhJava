SET NAMES utf8mb4;

INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT id, 2, 5, 'Sản phẩm chính hãng đóng gói rất kỹ, dùng cực kỳ ưng ý!', NOW() - INTERVAL (0 + 1) DAY
FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM reviews) AND id % 6 = 0;

INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT id, 1, 4, 'Giao hàng siêu tốc, đúng mô tả. Thiết kế rất đẹp và sang trọng.', NOW() - INTERVAL (1 + 1) DAY
FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM reviews) AND id % 6 = 1;

INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT id, 2, 5, 'Chất lượng vượt xa tầm giá, dùng mượt mà và pin rất bền.', NOW() - INTERVAL (2 + 1) DAY
FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM reviews) AND id % 6 = 2;

INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT id, 1, 4, 'Mua làm quà tặng bạn bè ai cũng khen. Rất đáng đồng tiền bát gạo!', NOW() - INTERVAL (3 + 1) DAY
FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM reviews) AND id % 6 = 3;

INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT id, 2, 5, 'Shop tư vấn nhiệt tình, chế độ bảo hành chu đáo. Sẽ tiếp tục ủng hộ!', NOW() - INTERVAL (4 + 1) DAY
FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM reviews) AND id % 6 = 4;

INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT id, 1, 4, 'Trải nghiệm tuyệt vời, âm thanh/hiệu năng rất đỉnh, kết nối nhanh chóng.', NOW() - INTERVAL (5 + 1) DAY
FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM reviews) AND id % 6 = 5;
