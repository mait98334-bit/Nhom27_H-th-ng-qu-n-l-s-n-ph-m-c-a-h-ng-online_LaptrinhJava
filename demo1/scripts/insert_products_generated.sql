SET NAMES utf8mb4;

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('iPhone 16 Pro Max 256GB', 2, 1, 34990000, 6, 45, 52, 'Titan Sa Mạc, Titan Tự Nhiên, Titan Trắng, Titan Đen', '256GB, 512GB, 1TB', 'THÔNG SỐ KỸ THUẬT VƯỢT TRỘI:
- Màn hình: Super Retina XDR OLED 6.9 inch, ProMotion 120Hz, Dynamic Island.
- Chip xử lý: Apple A18 Pro 3nm cực mạnh, hỗ trợ Apple Intelligence toàn diện.
- Camera: Hệ thống camera chuyên nghiệp 48MP Fusion, Telephoto 5x thế hệ mới, nút Camera Control cảm ứng lực.
- Chất liệu: Khung viền Titan chuẩn hàng không vũ trụ mạ PVD cao cấp, mặt lưng kính nhám.
- Thời lượng pin: Lên đến 33 giờ xem video liên tục, sạc nhanh MagSafe 25W.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('iPhone 16 Plus 128GB', 2, 1, 25990000, 8, 30, 28, 'Hồng Pastel, Xanh Mòng Két, Xanh Lưu Ly, Trắng, Đen', '128GB, 256GB, 512GB', 'ĐẶC ĐIỂM NỔI BẬT:
- Màn hình lớn 6.7 inch Super Retina XDR độ sáng tối đa 2000 nits.
- Chip Apple A18 tiến trình 3nm tối ưu hiệu năng và tiết kiệm pin.
- Nút Điều khiển Camera (Camera Control) thao tác chụp và quay video nhanh chóng.
- Cụm camera kép 48MP Fusion sắc nét, quay video không gian Spatial Video.
- Thời lượng pin xuất sắc hàng đầu dòng iPhone.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('iPhone 15 128GB Chính Hãng', 2, 1, 19490000, 10, 40, 65, 'Hồng Nhạt, Xanh Lá Cây, Vàng, Xanh Dương, Đen', '128GB, 256GB', 'CHI TIẾT SẢN PHẨM:
- Màn hình Dynamic Island 6.1 inch tiện ích và hiện đại.
- Camera chính 48MP zoom quang học 2x không suy giảm chất lượng.
- Cổng sạc USB-C chuẩn chung tiện lợi, dễ dàng dùng chung phụ kiện.
- Mặt lưng kính pha màu mờ sang trọng, viền nhôm bo cong êm ái khi cầm nắm.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('iPhone 13 128GB', 2, 1, 13690000, 12, 50, 95, 'Xanh Midnight, Ánh Sao Starlight, Đỏ, Xanh Dương', '128GB, 256GB', 'MẪU SMARTPHONE BÁN CHẠY NHẤT PHÂN KHÚC:
- Màn hình Super Retina XDR 6.1 inch sắc nét, màu sắc trung thực.
- Chip A15 Bionic vẫn cực kỳ mạnh mẽ, chiến mượt mà mọi tựa game.
- Cụm camera chéo 12MP chống rung dịch chuyển cảm biến OIS cao cấp.
- Pin bền bỉ, giá thành hiện tại cực kỳ kinh tế và đáng mua.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('iPad Gen 10 10.9 inch Wifi 64GB', 2, 1, 8990000, 8, 35, 48, 'Xanh Dương, Vàng, Bạc, Hồng', '64GB, 256GB', 'MÁY TÍNH BẢNG HỌC TẬP VÀ GIẢI TRÍ TOÀN DIỆN:
- Thiết kế viền đều phẳng 4 cạnh hiện đại, màn hình Liquid Retina 10.9 inch.
- Chip Apple A14 Bionic tốc độ cao, hỗ trợ đa nhiệm mượt mà.
- Cổng sạc USB-C, tương thích Magic Keyboard Folio và bút Apple Pencil.
- Camera trước góc siêu rộng 12MP đặt ngang với công nghệ Center Stage.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('iPad mini 6 8.3 inch Wifi 64GB', 2, 1, 11990000, 10, 25, 22, 'Xám Không Gian, Ánh Sao, Tím, Hồng', '64GB, 256GB', 'SỨC MẠNH LỚN TRONG THÂN HÌNH NHỎ GỌN:
- Màn hình 8.3 inch Liquid Retina True Tone, dải màu rộng DCI-P3.
- Chip A15 Bionic mạnh mẽ, cầm vừa gọn gàng bằng 1 bàn tay.
- Hỗ trợ bút Apple Pencil 2 gắn hít nam châm sạc không dây.
- Trọng lượng chỉ 293g, lý tưởng để ghi chú, đọc sách và chơi game di động.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('MacBook Air 15 inch M3 16GB/512GB', 3, 1, 31990000, 7, 20, 18, 'Xanh Đen Midnight, Ánh Sao, Bạc, Xám Không Gian', '16GB/512GB SSD', 'MÀN HÌNH LỚN SIÊU MỎNG NHẸ:
- Màn hình Liquid Retina 15.3 inch 500 nits sống động rực rỡ.
- Chip Apple M3 tiến trình 3nm tối tân kèm GPU hỗ trợ Ray Tracing.
- Hệ thống 6 loa âm thanh vòm với Spatial Audio cực kỳ sống động.
- Thiết kế không quạt tản nhiệt, hoàn toàn êm ái không một tiếng ồn.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Mac mini M2 8GB/256GB', 3, 1, 14490000, 5, 25, 14, 'Bạc Sang Trọng', '256GB, 512GB SSD', 'CỖ MÁY ĐỂ BÀN NHỎ GỌN SIÊU KINH TẾ:
- CPU 8 lõi và GPU 10 lõi xử lý hình ảnh và video nhanh chóng.
- Cổng kết nối đa dạng: 2 cổng Thunderbolt 4, 2 cổng USB-A, HDMI, Gigabit Ethernet.
- Thân máy nhôm tái chế nhỏ gọn 19.7 x 19.7 cm đặt gọn gàng trên mọi bàn làm việc.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Bút cảm ứng Apple Pencil Pro', 4, 1, 3490000, 0, 60, 35, 'Trắng', 'Tiêu Chuẩn', 'ĐỈNH CAO SÁNG TẠO DÀNH CHO IPAD:
- Cảm ứng bóp Barrel Roll xoay bút chuyển đổi nét vẽ trực quan.
- Phản hồi rung xúc giác Haptic Feedback cho cảm giác vẽ như trên giấy thật.
- Định vị vị trí dễ dàng với tính năng Find My tích hợp.
- Sạc và kết nối nam châm không dây trực tiếp bên cạnh iPad.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1585336261026-6a01dfb00ee1?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Chuột không dây Apple Magic Mouse 2', 4, 1, 1890000, 5, 50, 45, 'Trắng Bạc, Đen Nhám', 'Tiêu Chuẩn', 'THIẾT KẾ CÔNG THÁI HỌC VÀ CẢM ỨNG ĐA ĐIỂM:
- Bề mặt Multi-Touch cho phép vuốt chuyển trang và cuộn tài liệu mượt mà.
- Kết nối Bluetooth ổn định, tự động ghép nối với máy Mac.
- Pin sạc tích hợp bên trong dùng được cả tháng chỉ sau một lần sạc.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Tai nghe chụp tai Apple AirPods Max USB-C', 4, 1, 12990000, 8, 20, 16, 'Đêm Xanh Thẳm, Ánh Sao, Cam San Hô, Tím Nhạt', 'Bản Cao Cấp', 'ÂM THANH HI-FI VÀ CHỐNG ỒN CHỦ ĐỘNG ĐỈNH CAO:
- Màng loa dynamic 40mm do Apple tự thiết kế tái tạo âm thanh chuẩn phòng thu.
- Công nghệ Spatial Audio cá nhân hóa theo dõi cử động đầu người nghe.
- Khung quai bằng thép không gỉ bọc vật liệu đan dệt thoáng khí êm ái.
- Cổng sạc USB-C thế hệ mới nhất, thời lượng pin 20 giờ.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Thiết bị định vị Apple AirTag 1 Pack', 4, 1, 750000, 5, 80, 110, 'Trắng Bạc', '1 Pack', 'TÌM KIẾM ĐỒ ĐẠC DỄ DÀNG VỚI MẠNG LƯỚI TOÀN CẦU:
- Công nghệ Ultra Wideband (UWB) chỉ đường chuẩn xác từng centimet.
- Loa tích hợp phát âm thanh giúp bạn dễ tìm ví tiền, chùm chìa khóa hay balo.
- Tiêu chuẩn chống bụi nước IP67 bền bỉ, pin thay thế CR2032 dùng cả năm.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1610492461142-b06cefc1ee61?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Apple Watch SE 2 40mm GPS Viền Nhôm', 5, 1, 5690000, 10, 45, 38, 'Đen Midnight, Ánh Sao Starlight, Bạc Silver', '40mm GPS', 'CHIẾC ĐỒNG HỒ THÔNG MINH ĐÁNG MUA NHẤT:
- Theo dõi nhịp tim, giấc ngủ và phát hiện va chạm xe hơi (Crash Detection).
- Chip xử lý S8 SiP tốc độ cao ngang Apple Watch Series 8.
- Chống nước ở độ sâu 50 mét, thoải mái đeo đi bơi lội hay tập luyện thể thao.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Apple Watch Series 9 41mm GPS', 5, 1, 8990000, 15, 30, 29, 'Hồng Nhạt, Đen Midnight, Ánh Sao, Đỏ Product(RED)', '41mm GPS', 'TÍNH NĂNG DOUBLE TAP KỲ DIỆU:
- Chạm 2 ngón tay Double Tap điều khiển cuộc gọi và phát nhạc không cần chạm màn hình.
- Màn hình Always-On độ sáng 2000 nits gấp đôi thế hệ trước.
- Đo nồng độ oxy trong máu SpO2, điện tâm đồ ECG và cảm biến nhiệt độ theo dõi sức khỏe nữ giới.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Samsung Galaxy S24+ 256GB', 2, 2, 21990000, 15, 35, 25, 'Tím Mơ Mộng, Vàng Hổ Phách, Đen Oynx, Xám Coban', '256GB, 512GB', 'QUYỀN NĂNG GALAXY AI ĐÍCH THỰC:
- Màn hình Dynamic AMOLED 2X 6.7 inch QHD+ tần số quét 1-120Hz mượt mà.
- Trợ lý AI khoanh tròn tìm kiếm Circle to Search, dịch cuộc gọi trực tiếp đa ngôn ngữ.
- Khung viền Armor Aluminum cứng cáp chống va đập, kính Gorilla Glass Victus 2.
- Pin lớn 4900mAh kèm công nghệ sạc siêu nhanh 45W.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Samsung Galaxy Z Flip6 5G 256GB', 2, 2, 24990000, 12, 28, 32, 'Xanh Maya, Xám Metal, Vàng Mì, Xanh Mint', '256GB, 512GB', 'THIẾT KẾ GẬP THỜI TRANG ĐỈNH CAO:
- Màn hình phụ FlexWindow 3.4 inch trả lời tin nhắn và chụp ảnh selfie thông minh.
- Camera 50MP nâng cấp vượt bậc với công nghệ ProVisual Engine bắt trọn từng khoảnh khắc.
- Tản nhiệt buồng hơi Vapor Chamber lần đầu tiên xuất hiện trên dòng Flip giúp máy mát mẻ.
- Chuẩn kháng bụi nước IP48 bền bỉ hơn bao giờ hết.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Samsung Galaxy A55 5G 128GB', 2, 2, 9290000, 10, 55, 68, 'Xanh Iceblue, Lilac Tím, Xanh Đen Navy', '128GB, 256GB', 'VUA PHÂN KHÚC TẦM TRUNG:
- Khung viền kim loại sang trọng kết hợp 2 mặt kính cường lực bóng bẩy.
- Màn hình Super AMOLED 6.6 inch 120Hz rực rỡ sắc nét.
- Vi xử lý Exynos 1480 kèm đồ họa AMD Xclipse 530 chơi game mượt.
- Bảo mật chuẩn doanh nghiệp Samsung Knox Vault an toàn tuyệt đối.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Samsung Galaxy A15 LTE 128GB', 2, 2, 4290000, 8, 70, 85, 'Xanh Lạc Quan, Vàng Cá Tính, Đen Tuyền', '128GB', 'SMARTPHONE PHỔ THÔNG MÀN HÌNH AMOLED CỰC ĐẸP:
- Màn hình Super AMOLED 6.5 inch 90Hz chất lượng hiển thị vượt trội trong tầm giá.
- Camera 50MP sắc nét cùng camera góc siêu rộng và macro.
- Pin khủng 5.000mAh dùng trọn vẹn 2 ngày, hỗ trợ sạc nhanh 25W.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Samsung Galaxy Tab S9 Ultra 256GB', 2, 2, 26990000, 14, 20, 15, 'Xám Đậm Graphite, Kem Beige', '256GB, 512GB', 'TABLET ANDROID ĐỈNH CAO VỚI MÀN HÌNH KHỦNG 14.6 INCH:
- Màn hình Dynamic AMOLED 2X 14.6 inch siêu rộng thay thế máy tính xách tay.
- Tặng kèm bút S-Pen thế hệ mới chống nước IP68 viết vẽ siêu nhạy.
- Chip Snapdragon 8 Gen 2 for Galaxy hiệu năng cực đỉnh, hỗ trợ Samsung DeX biến hình PC.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Tai nghe Samsung Galaxy Buds3 Pro', 4, 2, 4990000, 10, 35, 28, 'Bạc Ánh Kim, Trắng Tinh Khiết', 'Tiêu Chuẩn', 'ÂM THANH CHUẨN PHÒNG THU 24-BIT 96KHZ:
- Thiết kế đuôi đèn Blade Lights độc đáo đậm chất tương lai.
- Loa 2 chiều với loa tweeter planar mang lại âm cao trong trẻo và âm trầm uy lực.
- Khử tiếng ồn thích ứng AI Adaptive ANC tự động lọc tạp âm theo môi trường.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Tai nghe Samsung Galaxy Buds FE', 4, 2, 1490000, 15, 60, 55, 'Trắng, Đen Graphite', 'Tiêu Chuẩn', 'CHỐNG ỒN CHỦ ĐỘNG GIÁ TỐT NHẤT:
- Thiết kế cánh bám Wingtip êm ái, bám chắc vào tai khi vận động.
- Chống ồn chủ động ANC mạnh mẽ và chế độ âm thanh xung quanh Ambient Sound.
- Thời lượng pin lên đến 30 giờ khi dùng kèm hộp sạc.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Củ sạc nhanh Samsung 45W Type-C', 4, 2, 690000, 10, 90, 130, 'Đen, Trắng', '45W kèm Cáp 5A', 'SẠC SIÊU NHANH 2.0 AN TOÀN:
- Chuẩn Power Delivery (PD) và PPS tối ưu cho các dòng Galaxy S và Tab S.
- Kèm sẵn cáp sạc 5A bọc dù chắc chắn chịu tải cao.
- Bảo vệ quá dòng, ngắn mạch và kiểm soát nhiệt độ thông minh.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Vòng đeo tay thông minh Samsung Galaxy Fit3', 5, 2, 1290000, 10, 70, 88, 'Xám Đậm, Hồng Ánh Kim, Bạc', 'Màn hình 1.6 inch', 'THEO DÕI SỨC KHỎE NHỎ GỌN PIN 13 NGÀY:
- Màn hình lớn 1.6 inch AMOLED viền nhôm sang trọng.
- Đo hơn 100 bài tập luyện thể thao, theo dõi nồng độ oxy trong máu SpO2.
- Cảnh báo té ngã khẩn cấp và gửi vị trí cứu hộ SOS tự động.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Xiaomi 14 512GB Leica Camera', 2, 3, 18990000, 10, 30, 22, 'Xanh Ngọc Bích, Trắng Tuyết, Đen Nhám', '256GB, 512GB', 'FLAGSHIP NHỎ GỌN VỚI ỐNG KÍNH LEICA ĐỈNH CAO:
- Cụm 3 camera Leica Summilux 50MP cảm biến Light Fusion 900 bắt sáng siêu đẳng.
- Màn hình 6.36 inch AMOLED 1.5K tần số quét 1-120Hz viền siêu mỏng chỉ 1.61mm.
- Chipset Snapdragon 8 Gen 3 siêu mạnh, sạc nhanh HyperCharge 90W và sạc không dây 50W.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Xiaomi Redmi Note 13 128GB', 2, 3, 4490000, 12, 80, 95, 'Xanh Băng Tuyết, Vàng Hoàng Hôn, Đen', '128GB, 256GB', 'BỨC PHÁ ĐẲNG CẤP PHÂN KHÚC PHỔ THÔNG:
- Camera siêu nét 108MP chụp ảnh chi tiết vượt trội, zoom in-sensor 3x sắc sảo.
- Màn hình AMOLED 120Hz viền mỏng ấn tượng, độ sáng cực đại 1800 nits.
- Cảm biến vân tay quang học ẩn dưới màn hình hiện đại, sạc nhanh 33W.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Xiaomi Redmi 13C 128GB', 2, 3, 2790000, 10, 90, 110, 'Xanh Cỏ Ba Lá, Xanh Hải Quân, Đen', '128GB', 'SMARTPHONE GIÁ RẺ ĐÁNG MUA NHẤT:
- Màn hình lớn 6.74 inch 90Hz mượt mà xem phim thả ga.
- Bộ nhớ trong 128GB thoải mái lưu hình ảnh, pin trâu 5.000mAh.
- Camera AI 50MP chụp ảnh sắc nét, mở khóa vân tay cạnh viền nhanh chóng.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Xiaomi Pad 6 128GB', 2, 3, 7490000, 10, 45, 50, 'Xanh Thiên Thanh, Vàng Sâm Banh, Xám', '128GB, 256GB', 'TABLET ĐỒ HỌA VÀ GIẢI TRÍ ĐỈNH CAO:
- Màn hình 11 inch độ phân giải 2.8K, tần số quét 144Hz siêu mượt.
- Vi xử lý Snapdragon 870 hiệu năng ổn định, thân nhôm nguyên khối chỉ 490g.
- 4 loa âm thanh vòm Dolby Atmos sống động như rạp chiếu phim.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Tai nghe Xiaomi Redmi Buds 5 Pro', 4, 3, 1690000, 10, 50, 45, 'Trắng Tuyết, Đen Midnight, Xanh Cẩm Thạch', 'Chống ồn 52dB', 'CHỐNG ỒN CHỦ ĐỘNG KHỦNG 52DB:
- Driver kép đồng trục gồm loa trầm titan 11mm và loa tweeter gốm áp điện 10mm.
- Hỗ trợ giải mã âm thanh Hi-Res Audio Wireless chuẩn LDAC chất lượng cao.
- Pin dùng liên tục đến 38 giờ kèm hộp sạc.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Pin sạc dự phòng Xiaomi 20.000mAh 50W Pro', 4, 3, 890000, 10, 85, 140, 'Đen Nhám', '20.000mAh 50W', 'CÔNG SUẤT KHỦNG SẠC ĐƯỢC CẢ LAPTOP:
- Cổng Type-C công suất đầu ra lên đến 50W Max, sạc tốt cho MacBook và laptop văn phòng.
- Dung lượng 20.000mAh nạp đầy nhiều lần cho điện thoại và máy tính bảng.
- Hỗ trợ sạc đồng thời 3 thiết bị an toàn tuyệt đối.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1609592424364-77ac260ff00b?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Vòng đeo tay thông minh Xiaomi Smart Band 9', 5, 3, 890000, 10, 120, 180, 'Đen, Hồng Ánh Vàng, Bạc Băng, Xanh Dương', 'Màn hình AMOLED 60Hz', 'CHIẾC SMARTBAND QUỐC DÂN THẾ HỆ THỨ 9:
- Màn hình AMOLED 1.62 inch độ sáng lên đến 1200 nits hiển thị rõ dưới nắng gắt.
- Khung hợp kim nhôm sang trọng có thể tháo rời đeo như mặt dây chuyền.
- Thời lượng pin không tưởng lên đến 21 ngày sử dụng liên tục.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Laptop Asus Vivobook 15 X1504 Core i5', 3, 5, 14490000, 8, 40, 42, 'Bạc Tinh Tú, Xanh Lam Đậm', '16GB RAM / 512GB SSD', 'LAPTOP HỌC TẬP VÀ VĂN PHÒNG HOÀN HẢO:
- Vi xử lý Intel Core i5-1335U 10 nhân 12 luồng xử lý cực nhanh các tác vụ Office và đồ họa.
- Màn hình 15.6 inch Full HD viền mỏng NanoEdge chống chói bảo vệ mắt.
- Bản lề mở gập 180 độ tiện chia sẻ nội dung, bàn phím ErgoSense gõ êm ái.
- Đạt tiêu chuẩn độ bền chuẩn quân đội Mỹ MIL-STD-810H.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Laptop Asus TUF Gaming A15 R7 RTX 4060', 3, 5, 25990000, 12, 30, 48, 'Xám Cơ Khí Mecha Gray', '16GB RAM / 512GB SSD', 'CỖ MÁY CHIẾN GAME BỀN BỈ ĐẲNG CẤP TUF:
- Chip AMD Ryzen 7 7735HS kết hợp card đồ họa rời NVIDIA GeForce RTX 4060 8GB.
- Màn hình 15.6 inch 144Hz 100% sRGB hỗ trợ G-Sync triệt tiêu xé hình.
- Hệ thống tản nhiệt quạt Arc Flow 84 cánh kép mát mẻ khi combat liên tục.
- Bàn phím có đèn nền RGB từng vùng chuyên biệt cho game thủ.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Máy chơi game cầm tay Asus ROG Ally X 24GB/1TB', 3, 5, 22990000, 5, 25, 26, 'Đen Nhám ROG', '24GB LPDDR5X / 1TB SSD', 'ĐỈNH CAO CHƠI GAME PC MỌI LÚC MỌI NƠI:
- Bộ xử lý AMD Ryzen Z1 Extreme, bộ nhớ RAM nâng cấp 24GB LPDDR5X tốc độ cao.
- Dung lượng pin gấp đôi 80Wh chơi game thỏa thích nhiều giờ liền.
- Màn hình cảm ứng Full HD 120Hz 500 nits sắc nét chuẩn màu.
- Chạy hệ điều hành Windows 11 nguyên bản hỗ trợ mọi nền tảng Steam, Game Pass, Epic Games.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Chuột Gaming Asus ROG Keris Wireless AimPoint', 4, 5, 1890000, 10, 45, 30, 'Đen, Trắng Tuyết Moonlight White', '36.000 DPI', 'CHUỘT BẮN SÚNG FPS SIÊU NHẸ 75G:
- Cảm biến quang học ROG AimPoint độ nhạy lên đến 36.000 DPI với độ lệch CPI < 1%.
- 3 chế độ kết nối: Không dây RF 2.4GHz, Bluetooth tiết kiệm pin và có dây USB.
- Nút bấm ROG Micro Switch tuổi thọ 70 triệu lượt bấm thay thế nóng độc quyền.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Laptop Dell Vostro 3520 Core i5-1235U', 3, 9, 13990000, 10, 50, 52, 'Đen Carbon', '8GB RAM / 512GB SSD', 'CHIẾC LAPTOP BỀN BỈ ĐẾN TỪ THƯƠNG HIỆU MỸ:
- Chip Intel Core i5 thế hệ 12 đa nhân đa luồng xử lý mượt mà.
- Màn hình 15.6 inch viền hẹp 120Hz cho trải nghiệm cuộn lướt êm dịu.
- Bản lề nâng Ergonomic thông minh tạo góc nghiêng gõ phím thoải mái và tản nhiệt tốt hơn.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Laptop Dell G15 Gaming 5530 Core i7 RTX 4050', 3, 9, 27990000, 10, 25, 28, 'Xám Đậm Shadow Gray', '16GB RAM / 512GB SSD', 'HIỆU NĂNG ĐỒ HỌA MẠNH MẼ LẤY CẢM HỨNG TỪ ALIENWARE:
- Chip Intel Core i7-13650HX 14 nhân kết hợp GPU RTX 4050 6GB cực khỏe.
- Màn hình 15.6 inch 120Hz mượt mà cho trải nghiệm game hành động không độ trễ.
- Nút Game Shift (F9) kích hoạt xung nhịp quạt tối đa chỉ với 1 lần bấm.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Màn hình đồ họa Dell UltraSharp U2424H 24 inch', 4, 9, 5490000, 5, 40, 39, 'Bạc Bạch Kim Platinum', 'IPS 120Hz 100% sRGB', 'CHUẨN MỰC HIỂN THỊ ĐỒ HỌA CHUYÊN NGHIỆP:
- Tấm nền IPS Black độ tương phản 2000:1, tần số quét nâng cấp 120Hz.
- Độ phủ màu tuyệt đối 100% sRGB và 85% DCI-P3 chuẩn màu thiết kế.
- Cảm biến ánh sáng tự động điều chỉnh độ sáng và nhiệt độ màu theo phòng làm việc.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Sony Xperia 1 VI 256GB 5G Zeiss T*', 2, 4, 28990000, 5, 15, 12, 'Xanh Rêu Khaki, Bạc Bạch Kim, Đen', '256GB, 512GB', 'TUYỆT PHẨM NHIẾP ẢNH DI ĐỘNG DÀNH CHO DÂN CHUYÊN:
- Ống kính tele zoom quang học thực thụ từ 85mm đến 170mm không mất chi tiết.
- Lớp tráng phủ Zeiss T* chống lóa độc quyền cho màu sắc điện ảnh trung thực.
- Màn hình OLED LTPO tỷ lệ chuẩn 19.5:9 siêu sáng, thời lượng pin lên đến 2 ngày.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Loa Bluetooth Sony SRS-XE300 Chống nước IP67', 4, 4, 2990000, 15, 35, 32, 'Xanh Dương, Xám Bạc, Đen', 'Pin 24 giờ', 'ÂM THANH LAN TỎA KHẮP KHÔNG GIAN:
- Bộ khuếch tán âm Line-Shape Diffuser mở rộng góc phát âm thanh đồng đều.
- Màng loa X-Balanced Speaker Unit cho âm bass căng tràn và âm cao ít méo tiếng.
- Chuẩn chống bụi nước IP67 và chống sốc va đập, pin bền bỉ 24 giờ.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Tai nghe chụp tai Sony WH-CH720N Chống ồn', 4, 4, 2490000, 10, 50, 58, 'Xanh Navy, Trắng, Đen', 'Chip V1 Pin 35h', 'CHỐNG ỒN THÔNG MINH TRỌNG LƯỢNG SIÊU NHẸ:
- Tích hợp chip V1 cao cấp thừa hưởng từ mẫu tai nghe đầu bảng WH-1000XM5.
- Trọng lượng chỉ 192g cực kỳ nhẹ nhàng, đệm tai mềm mại êm ái khi đeo lâu.
- Thời lượng pin 35 giờ khi bật chống ồn, sạc nhanh 3 phút nghe được 1 giờ.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Tai nghe True Wireless Sony WF-C500', 4, 4, 1290000, 20, 65, 72, 'Xanh Lá Cây, Cam San Hô, Trắng, Đen', 'IPX4 Pin 20h', 'NHỎ GỌN TRẺ TRUNG VỚI CÔNG NGHỆ DSEE:
- Cơ chế tăng cường âm thanh kỹ thuật số DSEE phục hồi dải âm cao bị nén.
- Hộp sạc hình viên thuốc nhỏ nhắn tiện bỏ túi quần, chống nước văng chuẩn IPX4.
- Tùy chỉnh chất âm Equalizer theo sở thích cá nhân qua ứng dụng Sony Headphones Connect.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Chuột không dây Logitech Pebble M350 Siêu êm', 4, 7, 420000, 10, 110, 165, 'Hồng Phấn, Trắng Sữa, Xanh Bạch Đàn, Đen', 'Silent Touch', 'CHUỘT KHÔNG DÂY NHỎ GỌN ÊM ÁI:
- Công nghệ Silent Touch giảm 90% tiếng ồn nhấp chuột, làm việc đêm yên tĩnh.
- Kết nối linh hoạt qua Bluetooth hoặc đầu thu USB Receiver 2.4GHz.
- Thiết kế bo tròn dẹt thanh lịch như viên đá cuội, thời lượng pin 18 tháng chỉ với 1 viên pin AA.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Chuột công thái học Logitech Lift Vertical', 4, 7, 1490000, 10, 55, 62, 'Hồng Nhạt, Trắng Ngà, Đen Than', 'Góc nghiêng 57 độ', 'BẢO VỆ CỔ TAY TOÀN DIỆN CHO DÂN VĂN PHÒNG:
- Góc nghiêng tự nhiên 57 độ giúp cổ tay đặt ở tư thế bắt tay thư giãn, chống mỏi đau khớp.
- Phù hợp hoàn hảo cho bàn tay kích thước vừa và nhỏ của người Việt Nam.
- Cuộn bánh xe SmartWheel mượt mà từng dòng hoặc siêu tốc độ chỉ với cú gạt nhẹ.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Bàn phím không dây Logitech K380 Multi-Device', 4, 7, 620000, 15, 95, 135, 'Hồng Rose, Cát Trắng, Xanh Lavender, Xám Đậm', 'Kết nối 3 thiết bị', 'BÀN PHÍM DI ĐỘNG SIÊU ĐẸP CHO MỌI THIẾT BỊ:
- Phím bấm tròn cổ điển gõ êm ái, khoảng cách phím tối ưu.
- Phím chuyển đổi nhanh Easy-Switch kết nối cùng lúc điện thoại, tablet và máy tính.
- Pin dùng đến 2 năm, trọng lượng nhẹ nhàng dễ dàng mang theo trong balo.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Chuột Gaming Logitech G502 HERO 25K Sensor', 4, 7, 990000, 20, 85, 120, 'Đen RGB', 'Cảm biến 25.600 DPI', 'HUYỀN THOẠI CHUỘT CHƠI GAME BÁN CHẠY NHẤT THẾ GIỚI:
- Cảm biến HERO 25K độ chính xác cao nhất thế giới không làm mượt hay gia tốc.
- 11 nút có thể lập trình macro và lưu cấu hình trực tiếp vào bộ nhớ chuột.
- Kèm 5 tạ kim loại 3.6g có thể tùy biến trọng lượng và điểm cân bằng tay cầm.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Tai nghe không dây Gaming Logitech G435 Lightspeed', 4, 7, 1390000, 15, 60, 78, 'Xanh Dương Vàng, Trắng Tím, Đen Vàng Neon', 'Trọng lượng 165g', 'TAI NGHE KHÔNG DÂY SIÊU NHẸ 165G:
- Trọng lượng nhẹ bậc nhất thị trường không gây áp lực lên đầu khi đeo cả ngày.
- Kết nối Lightspeed không độ trễ cho game thủ và Bluetooth cho điện thoại.
- Micro tạo chùm tia kép giảm tiếng ồn xung quanh không cần cần gạt micro vướng víu.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Loa Bluetooth Marshall Willen Mini', 4, 6, 2490000, 10, 50, 52, 'Đen Viền Vàng Đồng, Kem Cream', 'IP67 Pin 15h', 'CHIẾC LOA MARSHALL NHỎ GỌN BỎ TÚI ĐÁNG SỞ HỮU:
- Thiết kế đậm chất Rock n Roll cổ điển với logo Marshall mạ vàng sang trọng.
- Dây đeo cao su đa năng phía sau dễ dàng buộc vào ghi đông xe đạp hay balo du lịch.
- Tiêu chuẩn chống bụi nước chuẩn IP67, pin bền bỉ 15 giờ liên tục.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Loa Bluetooth Marshall Acton III Stereo', 4, 6, 6490000, 10, 35, 36, 'Đen Cổ Điển, Kem Vintage, Nâu Đất', 'Công suất 60W', 'ÂM VANG SỐNG ĐỘNG CHO CĂN PHÒNG CỦA BẠN:
- Âm trường stereo rộng hơn phiên bản tiền nhiệm, âm thanh tràn ngập không gian.
- Cụm nút kim loại vặn cơ học chỉnh Bass, Treble và Volume hoài cổ đầy cảm xúc.
- Kết nối Bluetooth 5.2 thế hệ mới sẵn sàng cho công nghệ Bluetooth LE Audio.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80');

INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('Tai nghe chụp tai Marshall Major IV Wireless', 4, 6, 3290000, 12, 60, 68, 'Nâu Da Bò, Đen Nhám', 'Pin trâu 80 giờ', 'HUYỀN THOẠI TAI NGHE VỚI THỜI LƯỢNG PIN KỶ LỤC 80 GIỜ:
- Driver dynamic 40mm được tinh chỉnh cho âm bass gầm vang và âm mid mượt mà.
- Thời lượng pin kinh ngạc hơn 80 giờ, hỗ trợ sạc không dây chuẩn Qi tiện lợi.
- Núm điều khiển đa hướng Control Knob bằng đồng thau điều hướng nhạc trực quan.', NOW());
SET @last_pid = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80');
