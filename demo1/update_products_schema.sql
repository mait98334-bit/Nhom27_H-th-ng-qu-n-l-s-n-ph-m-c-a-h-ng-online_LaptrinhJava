SET @dbname = DATABASE();
SET @tablename = 'products';

SET @col1 = 'discount_percent';
SET @preparedStatement1 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = @tablename AND table_schema = @dbname AND column_name = @col1) > 0,
  'SELECT 1',
  'ALTER TABLE products ADD COLUMN discount_percent INT DEFAULT 0;'
));
PREPARE stmt1 FROM @preparedStatement1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

SET @col2 = 'sold_quantity';
SET @preparedStatement2 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = @tablename AND table_schema = @dbname AND column_name = @col2) > 0,
  'SELECT 1',
  'ALTER TABLE products ADD COLUMN sold_quantity INT DEFAULT 0;'
));
PREPARE stmt2 FROM @preparedStatement2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

SET @col3 = 'created_at';
SET @preparedStatement3 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = @tablename AND table_schema = @dbname AND column_name = @col3) > 0,
  'SELECT 1',
  'ALTER TABLE products ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;'
));
PREPARE stmt3 FROM @preparedStatement3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Apple'),
  discount_percent = 10,
  sold_quantity = 35,
  created_at = DATE_SUB(NOW(), INTERVAL 3 DAY)
WHERE LOWER(name) LIKE '%iphone%';

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Apple'),
  discount_percent = 12,
  sold_quantity = 28,
  created_at = DATE_SUB(NOW(), INTERVAL 5 DAY)
WHERE LOWER(name) LIKE '%macbook%';

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Apple'),
  discount_percent = 15,
  sold_quantity = 52,
  created_at = DATE_SUB(NOW(), INTERVAL 8 DAY)
WHERE LOWER(name) LIKE '%airpods%';

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Samsung'),
  discount_percent = 18,
  sold_quantity = 24,
  created_at = DATE_SUB(NOW(), INTERVAL 2 DAY)
WHERE LOWER(name) LIKE '%galaxy s24%';

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Apple'),
  discount_percent = 8,
  sold_quantity = 16,
  created_at = DATE_SUB(NOW(), INTERVAL 4 DAY)
WHERE LOWER(name) LIKE '%ipad%';

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Asus'),
  discount_percent = 15,
  sold_quantity = 9,
  created_at = DATE_SUB(NOW(), INTERVAL 1 DAY)
WHERE LOWER(name) LIKE '%dell%' OR LOWER(name) LIKE '%xps%' OR LOWER(name) LIKE '%asus%';

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Sony'),
  discount_percent = 20,
  sold_quantity = 41,
  created_at = DATE_SUB(NOW(), INTERVAL 6 DAY)
WHERE LOWER(name) LIKE '%sony%' OR LOWER(name) LIKE '%wh-%';

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Marshall'),
  discount_percent = 0,
  sold_quantity = 19,
  created_at = DATE_SUB(NOW(), INTERVAL 7 DAY)
WHERE LOWER(name) LIKE '%marshall%';

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Apple'),
  discount_percent = 5,
  sold_quantity = 14,
  created_at = DATE_SUB(NOW(), INTERVAL 1 DAY)
WHERE LOWER(name) LIKE '%series 10%' OR (LOWER(name) LIKE '%apple%' AND LOWER(name) LIKE '%watch%');

UPDATE products SET 
  brand_id = (SELECT id FROM brands WHERE name = 'Samsung'),
  discount_percent = 10,
  sold_quantity = 8,
  created_at = DATE_SUB(NOW(), INTERVAL 2 DAY)
WHERE LOWER(name) LIKE '%galaxy watch%';