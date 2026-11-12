CREATE TABLE IF NOT EXISTS brands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(255),
    status VARCHAR(50),
    description TEXT,
    logo_url VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO brands (name, category, status, description, logo_url)
SELECT 'Apple', 'iPhone, iPad, MacBook, Phụ kiện', 'STRATEGIC', 'Tập đoàn công nghệ hàng đầu thế giới với hệ sinh thái sản phẩm cao cấp.', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Apple');

INSERT INTO brands (name, category, status, description, logo_url)
SELECT 'Samsung', 'Galaxy Phone, Tablet, Màn hình', 'STRATEGIC', 'Thương hiệu điện tử hàng đầu Hàn Quốc với màn hình Dynamic AMOLED đỉnh cao.', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Samsung');

INSERT INTO brands (name, category, status, description, logo_url)
SELECT 'Xiaomi', 'Smartphone, Thiết bị Smart Home', 'ACTIVE', 'Hệ sinh thái nhà thông minh và smartphone cấu hình cao giá tốt.', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Xiaomi');

INSERT INTO brands (name, category, status, description, logo_url)
SELECT 'Sony', 'Tai nghe chụp tai, Loa, Máy ảnh', 'ACTIVE', 'Đỉnh cao âm thanh chống ồn Hi-Res và máy ảnh mirrorless chuyên nghiệp.', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Sony');

INSERT INTO brands (name, category, status, description, logo_url)
SELECT 'Asus', 'Laptop ROG, Vivobook, Linh kiện', 'ACTIVE', 'Dẫn đầu phân khúc laptop gaming ROG và laptop đồ họa Zenbook mỏng nhẹ.', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Asus');

INSERT INTO brands (name, category, status, description, logo_url)
SELECT 'Marshall', 'Loa Bluetooth, Âm thanh Hi-Fi', 'ACTIVE', 'Huyền thoại âm thanh phong cách cổ điển Rock ''n'' Roll đến từ Vương Quốc Anh.', 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Marshall_logo.svg'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Marshall');

INSERT INTO brands (name, category, status, description, logo_url)
SELECT 'Logitech', 'Chuột, Bàn phím cơ, Tai nghe', 'ACTIVE', 'Thiết bị ngoại vi công thái học và gaming gear số 1 thế giới.', 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Logitech');