SET NAMES utf8mb4;
USE sisi_shop;

-- Product ID 33: iPhone 16 Pro Max 256GB
UPDATE products SET 
  name = 'iPhone 16 Pro Max 256GB', 
  description = 'THÔNG SỐ KỸ THUẬT VƯỢT TRỘI:
- Màn hình: Super Retina XDR OLED 6.9 inch, ProMotion 120Hz, Dynamic Island.
- Chip xử lý: Apple A18 Pro 3nm cực mạnh, hỗ trợ Apple Intelligence toàn diện.
- Camera: Hệ thống camera chuyên nghiệp 48MP Fusion, Telephoto 5x thế hệ mới, nút Camera Control cảm ứng lực.
- Chất liệu: Khung viền Titan chuẩn hàng không vũ trụ mạ PVD cao cấp, mặt lưng kính nhám.
- Thời lượng pin: Lên đến 33 giờ xem video liên tục, sạc nhanh MagSafe 25W.', 
  colors = 'Titan Sa Mạc, Titan Tự Nhiên, Titan Trắng, Titan Đen', 
  storage_options = '256GB, 512GB, 1TB' 
WHERE id = 33;

-- Product ID 34: iPhone 16 Plus 128GB
UPDATE products SET 
  name = 'iPhone 16 Plus 128GB', 
  description = 'ĐẶC ĐIỂM NỔI BẬT:
- Màn hình lớn 6.7 inch Super Retina XDR độ sáng tối đa 2000 nits.
- Chip Apple A18 tiến trình 3nm tối ưu hiệu năng và tiết kiệm pin.
- Nút Điều khiển Camera (Camera Control) thao tác chụp và quay video nhanh chóng.
- Cụm camera kép 48MP Fusion sắc nét, quay video không gian Spatial Video.
- Thời lượng pin xuất sắc hàng đầu dòng iPhone.', 
  colors = 'Hồng Pastel, Xanh Mòng Két, Xanh Lưu Ly, Trắng, Đen', 
  storage_options = '128GB, 256GB, 512GB' 
WHERE id = 34;

-- Product ID 35: iPhone 15 128GB Chính Hãng
UPDATE products SET 
  name = 'iPhone 15 128GB Chính Hãng', 
  description = 'CHI TIẾT SẢN PHẨM:
- Màn hình Dynamic Island 6.1 inch tiện ích và hiện đại.
- Camera chính 48MP zoom quang học 2x không suy giảm chất lượng.
- Cổng sạc USB-C chuẩn chung tiện lợi, dễ dàng dùng chung phụ kiện.
- Mặt lưng kính pha màu mờ sang trọng, viền nhôm bo cong êm ái khi cầm nắm.', 
  colors = 'Hồng Nhạt, Xanh Lá Cây, Vàng, Xanh Dương, Đen', 
  storage_options = '128GB, 256GB' 
WHERE id = 35;

-- Product ID 36: iPhone 13 128GB
UPDATE products SET 
  name = 'iPhone 13 128GB', 
  description = 'MẪU SMARTPHONE BÁN CHẠY NHẤT PHÂN KHÚC:
- Màn hình Super Retina XDR 6.1 inch sắc nét, màu sắc trung thực.
- Chip A15 Bionic vẫn cực kỳ mạnh mẽ, chiến mượt mà mọi tựa game.
- Cụm camera chéo 12MP chống rung dịch chuyển cảm biến OIS cao cấp.
- Pin bền bỉ, giá thành hiện tại cực kỳ kinh tế và đáng mua.', 
  colors = 'Xanh Midnight, Ánh Sao Starlight, Đỏ, Xanh Dương', 
  storage_options = '128GB, 256GB' 
WHERE id = 36;

-- Product ID 37: iPad Gen 10 10.9 inch Wifi 64GB
UPDATE products SET 
  name = 'iPad Gen 10 10.9 inch Wifi 64GB', 
  description = 'MÁY TÍNH BẢNG HỌC TẬP VÀ GIẢI TRÍ TOÀN DIỆN:
- Thiết kế viền đều phẳng 4 cạnh hiện đại, màn hình Liquid Retina 10.9 inch.
- Chip Apple A14 Bionic tốc độ cao, hỗ trợ đa nhiệm mượt mà.
- Cổng sạc USB-C, tương thích Magic Keyboard Folio và bút Apple Pencil.
- Camera trước góc siêu rộng 12MP đặt ngang với công nghệ Center Stage.', 
  colors = 'Xanh Dương, Vàng, Bạc, Hồng', 
  storage_options = '64GB, 256GB' 
WHERE id = 37;

-- Product ID 38: iPad mini 6 8.3 inch Wifi 64GB
UPDATE products SET 
  name = 'iPad mini 6 8.3 inch Wifi 64GB', 
  description = 'SỨC MẠNH LỚN TRONG THÂN HÌNH NHỎ GỌN:
- Màn hình 8.3 inch Liquid Retina True Tone, dải màu rộng DCI-P3.
- Chip A15 Bionic mạnh mẽ, cầm vừa gọn gàng bằng 1 bàn tay.
- Hỗ trợ bút Apple Pencil 2 gắn hít nam châm sạc không dây.
- Trọng lượng chỉ 293g, lý tưởng để ghi chú, đọc sách và chơi game di động.', 
  colors = 'Xám Không Gian, Ánh Sao, Tím, Hồng', 
  storage_options = '64GB, 256GB' 
WHERE id = 38;

-- Product ID 39: MacBook Air 15 inch M3 16GB/512GB
UPDATE products SET 
  name = 'MacBook Air 15 inch M3 16GB/512GB', 
  description = 'MÀN HÌNH LỚN SIÊU MỎNG NHẸ:
- Màn hình Liquid Retina 15.3 inch 500 nits sống động rực rỡ.
- Chip Apple M3 tiến trình 3nm tối tân kèm GPU hỗ trợ Ray Tracing.
- Hệ thống 6 loa âm thanh vòm với Spatial Audio cực kỳ sống động.
- Thiết kế không quạt tản nhiệt, hoàn toàn êm ái không một tiếng ồn.', 
  colors = 'Xanh Đen Midnight, Ánh Sao, Bạc, Xám Không Gian', 
  storage_options = '16GB/512GB SSD' 
WHERE id = 39;

-- Product ID 40: Mac mini M2 8GB/256GB
UPDATE products SET 
  name = 'Mac mini M2 8GB/256GB', 
  description = 'CỖ MÁY ĐỂ BÀN NHỎ GỌN SIÊU KINH TẾ:
- CPU 8 lõi và GPU 10 lõi xử lý hình ảnh và video nhanh chóng.
- Cổng kết nối đa dạng: 2 cổng Thunderbolt 4, 2 cổng USB-A, HDMI, Gigabit Ethernet.
- Thân máy nhôm tái chế nhỏ gọn 19.7 x 19.7 cm đặt gọn gàng trên mọi bàn làm việc.', 
  colors = 'Bạc Sang Trọng', 
  storage_options = '256GB, 512GB SSD' 
WHERE id = 40;

-- Product ID 41: Bút cảm ứng Apple Pencil Pro
UPDATE products SET 
  name = 'Bút cảm ứng Apple Pencil Pro', 
  description = 'ĐỈNH CAO SÁNG TẠO DÀNH CHO IPAD:
- Cảm ứng bóp Barrel Roll xoay bút chuyển đổi nét vẽ trực quan.
- Phản hồi rung xúc giác Haptic Feedback cho cảm giác vẽ như trên giấy thật.
- Định vị vị trí dễ dàng với tính năng Find My tích hợp.
- Sạc và kết nối nam châm không dây trực tiếp bên cạnh iPad.', 
  colors = 'Trắng', 
  storage_options = 'Tiêu Chuẩn' 
WHERE id = 41;

-- Product ID 42: Chuột không dây Apple Magic Mouse 2
UPDATE products SET 
  name = 'Chuột không dây Apple Magic Mouse 2', 
  description = 'THIẾT KẾ CÔNG THÁI HỌC VÀ CẢM ỨNG ĐA ĐIỂM:
- Bề mặt Multi-Touch cho phép vuốt chuyển trang và cuộn tài liệu mượt mà.
- Kết nối Bluetooth ổn định, tự động ghép nối với máy Mac.
- Pin sạc tích hợp bên trong dùng được cả tháng chỉ sau một lần sạc.', 
  colors = 'Trắng Bạc, Đen Nhám', 
  storage_options = 'Tiêu Chuẩn' 
WHERE id = 42;

-- Product ID 43: Tai nghe chụp tai Apple AirPods Max USB-C
UPDATE products SET 
  name = 'Tai nghe chụp tai Apple AirPods Max USB-C', 
  description = 'ÂM THANH HI-FI VÀ CHỐNG ỒN CHỦ ĐỘNG ĐỈNH CAO:
- Màng loa dynamic 40mm do Apple tự thiết kế tái tạo âm thanh chuẩn phòng thu.
- Công nghệ Spatial Audio cá nhân hóa theo dõi cử động đầu người nghe.
- Khung quai bằng thép không gỉ bọc vật liệu đan dệt thoáng khí êm ái.
- Cổng sạc USB-C thế hệ mới nhất, thời lượng pin 20 giờ.', 
  colors = 'Đêm Xanh Thẳm, Ánh Sao, Cam San Hô, Tím Nhạt', 
  storage_options = 'Bản Cao Cấp' 
WHERE id = 43;

-- Product ID 44: Thiết bị định vị Apple AirTag 1 Pack
UPDATE products SET 
  name = 'Thiết bị định vị Apple AirTag 1 Pack', 
  description = 'TÌM KIẾM ĐỒ ĐẠC DỄ DÀNG VỚI MẠNG LƯỚI TOÀN CẦU:
- Công nghệ Ultra Wideband (UWB) chỉ đường chuẩn xác từng centimet.
- Loa tích hợp phát âm thanh giúp bạn dễ tìm ví tiền, chùm chìa khóa hay balo.
- Tiêu chuẩn chống bụi nước IP67 bền bỉ, pin thay thế CR2032 dùng cả năm.', 
  colors = 'Trắng Bạc', 
  storage_options = '1 Pack' 
WHERE id = 44;

-- Product ID 45: Apple Watch SE 2 40mm GPS Viền Nhôm
UPDATE products SET 
  name = 'Apple Watch SE 2 40mm GPS Viền Nhôm', 
  description = 'CHIẾC ĐỒNG HỒ THÔNG MINH ĐÁNG MUA NHẤT:
- Theo dõi nhịp tim, giấc ngủ và phát hiện va chạm xe hơi (Crash Detection).
- Chip xử lý S8 SiP tốc độ cao ngang Apple Watch Series 8.
- Chống nước ở độ sâu 50 mét, thoải mái đeo đi bơi lội hay tập luyện thể thao.', 
  colors = 'Đen Midnight, Ánh Sao Starlight, Bạc Silver', 
  storage_options = '40mm GPS' 
WHERE id = 45;

-- Product ID 46: Apple Watch Series 9 41mm GPS
UPDATE products SET 
  name = 'Apple Watch Series 9 41mm GPS', 
  description = 'TÍNH NĂNG DOUBLE TAP KỲ DIỆU:
- Chạm 2 ngón tay Double Tap điều khiển cuộc gọi và phát nhạc không cần chạm màn hình.
- Màn hình Always-On độ sáng 2000 nits gấp đôi thế hệ trước.
- Đo nồng độ oxy trong máu SpO2, điện tâm đồ ECG và cảm biến nhiệt độ theo dõi sức khỏe nữ giới.', 
  colors = 'Hồng Nhạt, Đen Midnight, Ánh Sao, Đỏ Product(RED)', 
  storage_options = '41mm GPS' 
WHERE id = 46;

-- Product ID 47: Samsung Galaxy S24+ 256GB
UPDATE products SET 
  name = 'Samsung Galaxy S24+ 256GB', 
  description = 'QUYỀN NĂNG GALAXY AI ĐÍCH THỰC:
- Màn hình Dynamic AMOLED 2X 6.7 inch QHD+ tần số quét 1-120Hz mượt mà.
- Trợ lý AI khoanh tròn tìm kiếm Circle to Search, dịch cuộc gọi trực tiếp đa ngôn ngữ.
- Khung viền Armor Aluminum cứng cáp chống va đập, kính Gorilla Glass Victus 2.
- Pin lớn 4900mAh kèm công nghệ sạc siêu nhanh 45W.', 
  colors = 'Tím Mơ Mộng, Vàng Hổ Phách, Đen Oynx, Xám Coban', 
  storage_options = '256GB, 512GB' 
WHERE id = 47;

-- Product ID 48: Samsung Galaxy Z Flip6 5G 256GB
UPDATE products SET 
  name = 'Samsung Galaxy Z Flip6 5G 256GB', 
  description = 'THIẾT KẾ GẬP THỜI TRANG ĐỈNH CAO:
- Màn hình phụ FlexWindow 3.4 inch trả lời tin nhắn và chụp ảnh selfie thông minh.
- Camera 50MP nâng cấp vượt bậc với công nghệ ProVisual Engine bắt trọn từng khoảnh khắc.
- Tản nhiệt buồng hơi Vapor Chamber lần đầu tiên xuất hiện trên dòng Flip giúp máy mát mẻ.
- Chuẩn kháng bụi nước IP48 bền bỉ hơn bao giờ hết.', 
  colors = 'Xanh Maya, Xám Metal, Vàng Mì, Xanh Mint', 
  storage_options = '256GB, 512GB' 
WHERE id = 48;

-- Product ID 49: Samsung Galaxy A55 5G 128GB
UPDATE products SET 
  name = 'Samsung Galaxy A55 5G 128GB', 
  description = 'VUA PHÂN KHÚC TẦM TRUNG:
- Khung viền kim loại sang trọng kết hợp 2 mặt kính cường lực bóng bẩy.
- Màn hình Super AMOLED 6.6 inch 120Hz rực rỡ sắc nét.
- Vi xử lý Exynos 1480 kèm đồ họa AMD Xclipse 530 chơi game mượt.
- Bảo mật chuẩn doanh nghiệp Samsung Knox Vault an toàn tuyệt đối.', 
  colors = 'Xanh Iceblue, Lilac Tím, Xanh Đen Navy', 
  storage_options = '128GB, 256GB' 
WHERE id = 49;

-- Product ID 50: Samsung Galaxy A15 LTE 128GB
UPDATE products SET 
  name = 'Samsung Galaxy A15 LTE 128GB', 
  description = 'SMARTPHONE PHỔ THÔNG MÀN HÌNH AMOLED CỰC ĐẸP:
- Màn hình Super AMOLED 6.5 inch 90Hz chất lượng hiển thị vượt trội trong tầm giá.
- Camera 50MP sắc nét cùng camera góc siêu rộng và macro.
- Pin khủng 5.000mAh dùng trọn vẹn 2 ngày, hỗ trợ sạc nhanh 25W.', 
  colors = 'Xanh Lạc Quan, Vàng Cá Tính, Đen Tuyền', 
  storage_options = '128GB' 
WHERE id = 50;

-- Product ID 51: Samsung Galaxy Tab S9 Ultra 256GB
UPDATE products SET 
  name = 'Samsung Galaxy Tab S9 Ultra 256GB', 
  description = 'TABLET ANDROID ĐỈNH CAO VỚI MÀN HÌNH KHỦNG 14.6 INCH:
- Màn hình Dynamic AMOLED 2X 14.6 inch siêu rộng thay thế máy tính xách tay.
- Tặng kèm bút S-Pen thế hệ mới chống nước IP68 viết vẽ siêu nhạy.
- Chip Snapdragon 8 Gen 2 for Galaxy hiệu năng cực đỉnh, hỗ trợ Samsung DeX biến hình PC.', 
  colors = 'Xám Đậm Graphite, Kem Beige', 
  storage_options = '256GB, 512GB' 
WHERE id = 51;

-- Product ID 52: Tai nghe Samsung Galaxy Buds3 Pro
UPDATE products SET 
  name = 'Tai nghe Samsung Galaxy Buds3 Pro', 
  description = 'ÂM THANH CHUẨN PHÒNG THU 24-BIT 96KHZ:
- Thiết kế đuôi đèn Blade Lights độc đáo đậm chất tương lai.
- Loa 2 chiều với loa tweeter planar mang lại âm cao trong trẻo và âm trầm uy lực.
- Khử tiếng ồn thích ứng AI Adaptive ANC tự động lọc tạp âm theo môi trường.', 
  colors = 'Bạc Ánh Kim, Trắng Tinh Khiết', 
  storage_options = 'Tiêu Chuẩn' 
WHERE id = 52;

-- Product ID 53: Tai nghe Samsung Galaxy Buds FE
UPDATE products SET 
  name = 'Tai nghe Samsung Galaxy Buds FE', 
  description = 'CHỐNG ỒN CHỦ ĐỘNG GIÁ TỐT NHẤT:
- Thiết kế cánh bám Wingtip êm ái, bám chắc vào tai khi vận động.
- Chống ồn chủ động ANC mạnh mẽ và chế độ âm thanh xung quanh Ambient Sound.
- Thời lượng pin lên đến 30 giờ khi dùng kèm hộp sạc.', 
  colors = 'Trắng, Đen Graphite', 
  storage_options = 'Tiêu Chuẩn' 
WHERE id = 53;

-- Product ID 54: Củ sạc nhanh Samsung 45W Type-C
UPDATE products SET 
  name = 'Củ sạc nhanh Samsung 45W Type-C', 
  description = 'SẠC SIÊU NHANH 2.0 AN TOÀN:
- Chuẩn Power Delivery (PD) và PPS tối ưu cho các dòng Galaxy S và Tab S.
- Kèm sẵn cáp sạc 5A bọc dù chắc chắn chịu tải cao.
- Bảo vệ quá dòng, ngắn mạch và kiểm soát nhiệt độ thông minh.', 
  colors = 'Đen, Trắng', 
  storage_options = '45W kèm Cáp 5A' 
WHERE id = 54;

-- Product ID 55: Vòng đeo tay thông minh Samsung Galaxy Fit3
UPDATE products SET 
  name = 'Vòng đeo tay thông minh Samsung Galaxy Fit3', 
  description = 'THEO DÕI SỨC KHỎE NHỎ GỌN PIN 13 NGÀY:
- Màn hình lớn 1.6 inch AMOLED viền nhôm sang trọng.
- Đo hơn 100 bài tập luyện thể thao, theo dõi nồng độ oxy trong máu SpO2.
- Cảnh báo té ngã khẩn cấp và gửi vị trí cứu hộ SOS tự động.', 
  colors = 'Xám Đậm, Hồng Ánh Kim, Bạc', 
  storage_options = 'Màn hình 1.6 inch' 
WHERE id = 55;

-- Product ID 56: Xiaomi 14 512GB Leica Camera
UPDATE products SET 
  name = 'Xiaomi 14 512GB Leica Camera', 
  description = 'FLAGSHIP NHỎ GỌN VỚI ỐNG KÍNH LEICA ĐỈNH CAO:
- Cụm 3 camera Leica Summilux 50MP cảm biến Light Fusion 900 bắt sáng siêu đẳng.
- Màn hình 6.36 inch AMOLED 1.5K tần số quét 1-120Hz viền siêu mỏng chỉ 1.61mm.
- Chipset Snapdragon 8 Gen 3 siêu mạnh, sạc nhanh HyperCharge 90W và sạc không dây 50W.', 
  colors = 'Xanh Ngọc Bích, Trắng Tuyết, Đen Nhám', 
  storage_options = '256GB, 512GB' 
WHERE id = 56;

-- Product ID 57: Xiaomi Redmi Note 13 128GB
UPDATE products SET 
  name = 'Xiaomi Redmi Note 13 128GB', 
  description = 'BỨC PHÁ ĐẲNG CẤP PHÂN KHÚC PHỔ THÔNG:
- Camera siêu nét 108MP chụp ảnh chi tiết vượt trội, zoom in-sensor 3x sắc sảo.
- Màn hình AMOLED 120Hz viền mỏng ấn tượng, độ sáng cực đại 1800 nits.
- Cảm biến vân tay quang học ẩn dưới màn hình hiện đại, sạc nhanh 33W.', 
  colors = 'Xanh Băng Tuyết, Vàng Hoàng Hôn, Đen', 
  storage_options = '128GB, 256GB' 
WHERE id = 57;

-- Product ID 58: Xiaomi Redmi 13C 128GB
UPDATE products SET 
  name = 'Xiaomi Redmi 13C 128GB', 
  description = 'SMARTPHONE GIÁ RẺ ĐÁNG MUA NHẤT:
- Màn hình lớn 6.74 inch 90Hz mượt mà xem phim thả ga.
- Bộ nhớ trong 128GB thoải mái lưu hình ảnh, pin trâu 5.000mAh.
- Camera AI 50MP chụp ảnh sắc nét, mở khóa vân tay cạnh viền nhanh chóng.', 
  colors = 'Xanh Cỏ Ba Lá, Xanh Hải Quân, Đen', 
  storage_options = '128GB' 
WHERE id = 58;

-- Product ID 59: Xiaomi Pad 6 128GB
UPDATE products SET 
  name = 'Xiaomi Pad 6 128GB', 
  description = 'TABLET ĐỒ HỌA VÀ GIẢI TRÍ ĐỈNH CAO:
- Màn hình 11 inch độ phân giải 2.8K, tần số quét 144Hz siêu mượt.
- Vi xử lý Snapdragon 870 hiệu năng ổn định, thân nhôm nguyên khối chỉ 490g.
- 4 loa âm thanh vòm Dolby Atmos sống động như rạp chiếu phim.', 
  colors = 'Xanh Thiên Thanh, Vàng Sâm Banh, Xám', 
  storage_options = '128GB, 256GB' 
WHERE id = 59;

-- Product ID 60: Tai nghe Xiaomi Redmi Buds 5 Pro
UPDATE products SET 
  name = 'Tai nghe Xiaomi Redmi Buds 5 Pro', 
  description = 'CHỐNG ỒN CHỦ ĐỘNG KHỦNG 52DB:
- Driver kép đồng trục gồm loa trầm titan 11mm và loa tweeter gốm áp điện 10mm.
- Hỗ trợ giải mã âm thanh Hi-Res Audio Wireless chuẩn LDAC chất lượng cao.
- Pin dùng liên tục đến 38 giờ kèm hộp sạc.', 
  colors = 'Trắng Tuyết, Đen Midnight, Xanh Cẩm Thạch', 
  storage_options = 'Chống ồn 52dB' 
WHERE id = 60;

-- Product ID 61: Pin sạc dự phòng Xiaomi 20.000mAh 50W Pro
UPDATE products SET 
  name = 'Pin sạc dự phòng Xiaomi 20.000mAh 50W Pro', 
  description = 'CÔNG SUẤT KHỦNG SẠC ĐƯỢC CẢ LAPTOP:
- Cổng Type-C công suất đầu ra lên đến 50W Max, sạc tốt cho MacBook và laptop văn phòng.
- Dung lượng 20.000mAh nạp đầy nhiều lần cho điện thoại và máy tính bảng.
- Hỗ trợ sạc đồng thời 3 thiết bị an toàn tuyệt đối.', 
  colors = 'Đen Nhám', 
  storage_options = '20.000mAh 50W' 
WHERE id = 61;

-- Product ID 62: Vòng đeo tay thông minh Xiaomi Smart Band 9
UPDATE products SET 
  name = 'Vòng đeo tay thông minh Xiaomi Smart Band 9', 
  description = 'CHIẾC SMARTBAND QUỐC DÂN THẾ HỆ THỨ 9:
- Màn hình AMOLED 1.62 inch độ sáng lên đến 1200 nits hiển thị rõ dưới nắng gắt.
- Khung hợp kim nhôm sang trọng có thể tháo rời đeo như mặt dây chuyền.
- Thời lượng pin không tưởng lên đến 21 ngày sử dụng liên tục.', 
  colors = 'Đen, Hồng Ánh Vàng, Bạc Băng, Xanh Dương', 
  storage_options = 'Màn hình AMOLED 60Hz' 
WHERE id = 62;

-- Product ID 63: Laptop Asus Vivobook 15 X1504 Core i5
UPDATE products SET 
  name = 'Laptop Asus Vivobook 15 X1504 Core i5', 
  description = 'LAPTOP HỌC TẬP VÀ VĂN PHÒNG HOÀN HẢO:
- Vi xử lý Intel Core i5-1335U 10 nhân 12 luồng xử lý cực nhanh các tác vụ Office và đồ họa.
- Màn hình 15.6 inch Full HD viền mỏng NanoEdge chống chói bảo vệ mắt.
- Bản lề mở gập 180 độ tiện chia sẻ nội dung, bàn phím ErgoSense gõ êm ái.
- Đạt tiêu chuẩn độ bền chuẩn quân đội Mỹ MIL-STD-810H.', 
  colors = 'Bạc Tinh Tú, Xanh Lam Đậm', 
  storage_options = '16GB RAM / 512GB SSD' 
WHERE id = 63;

-- Product ID 64: Laptop Asus TUF Gaming A15 R7 RTX 4060
UPDATE products SET 
  name = 'Laptop Asus TUF Gaming A15 R7 RTX 4060', 
  description = 'CỖ MÁY CHIẾN GAME BỀN BỈ ĐẲNG CẤP TUF:
- Chip AMD Ryzen 7 7735HS kết hợp card đồ họa rời NVIDIA GeForce RTX 4060 8GB.
- Màn hình 15.6 inch 144Hz 100% sRGB hỗ trợ G-Sync triệt tiêu xé hình.
- Hệ thống tản nhiệt quạt Arc Flow 84 cánh kép mát mẻ khi combat liên tục.
- Bàn phím có đèn nền RGB từng vùng chuyên biệt cho game thủ.', 
  colors = 'Xám Cơ Khí Mecha Gray', 
  storage_options = '16GB RAM / 512GB SSD' 
WHERE id = 64;

-- Product ID 65: Máy chơi game cầm tay Asus ROG Ally X 24GB/1TB
UPDATE products SET 
  name = 'Máy chơi game cầm tay Asus ROG Ally X 24GB/1TB', 
  description = 'ĐỈNH CAO CHƠI GAME PC MỌI LÚC MỌI NƠI:
- Bộ xử lý AMD Ryzen Z1 Extreme, bộ nhớ RAM nâng cấp 24GB LPDDR5X tốc độ cao.
- Dung lượng pin gấp đôi 80Wh chơi game thỏa thích nhiều giờ liền.
- Màn hình cảm ứng Full HD 120Hz 500 nits sắc nét chuẩn màu.
- Chạy hệ điều hành Windows 11 nguyên bản hỗ trợ mọi nền tảng Steam, Game Pass, Epic Games.', 
  colors = 'Đen Nhám ROG', 
  storage_options = '24GB LPDDR5X / 1TB SSD' 
WHERE id = 65;

-- Product ID 66: Chuột Gaming Asus ROG Keris Wireless AimPoint
UPDATE products SET 
  name = 'Chuột Gaming Asus ROG Keris Wireless AimPoint', 
  description = 'CHUỘT BẮN SÚNG FPS SIÊU NHẸ 75G:
- Cảm biến quang học ROG AimPoint độ nhạy lên đến 36.000 DPI với độ lệch CPI < 1%.
- 3 chế độ kết nối: Không dây RF 2.4GHz, Bluetooth tiết kiệm pin và có dây USB.
- Nút bấm ROG Micro Switch tuổi thọ 70 triệu lượt bấm thay thế nóng độc quyền.', 
  colors = 'Đen, Trắng Tuyết Moonlight White', 
  storage_options = '36.000 DPI' 
WHERE id = 66;

-- Product ID 67: Laptop Dell Vostro 3520 Core i5-1235U
UPDATE products SET 
  name = 'Laptop Dell Vostro 3520 Core i5-1235U', 
  description = 'CHIẾC LAPTOP BỀN BỈ ĐẾN TỪ THƯƠNG HIỆU MỸ:
- Chip Intel Core i5 thế hệ 12 đa nhân đa luồng xử lý mượt mà.
- Màn hình 15.6 inch viền hẹp 120Hz cho trải nghiệm cuộn lướt êm dịu.
- Bản lề nâng Ergonomic thông minh tạo góc nghiêng gõ phím thoải mái và tản nhiệt tốt hơn.', 
  colors = 'Đen Carbon', 
  storage_options = '8GB RAM / 512GB SSD' 
WHERE id = 67;

-- Product ID 68: Laptop Dell G15 Gaming 5530 Core i7 RTX 4050
UPDATE products SET 
  name = 'Laptop Dell G15 Gaming 5530 Core i7 RTX 4050', 
  description = 'HIỆU NĂNG ĐỒ HỌA MẠNH MẼ LẤY CẢM HỨNG TỪ ALIENWARE:
- Chip Intel Core i7-13650HX 14 nhân kết hợp GPU RTX 4050 6GB cực khỏe.
- Màn hình 15.6 inch 120Hz mượt mà cho trải nghiệm game hành động không độ trễ.
- Nút Game Shift (F9) kích hoạt xung nhịp quạt tối đa chỉ với 1 lần bấm.', 
  colors = 'Xám Đậm Shadow Gray', 
  storage_options = '16GB RAM / 512GB SSD' 
WHERE id = 68;

-- Product ID 69: Màn hình đồ họa Dell UltraSharp U2424H 24 inch
UPDATE products SET 
  name = 'Màn hình đồ họa Dell UltraSharp U2424H 24 inch', 
  description = 'CHUẨN MỰC HIỂN THỊ ĐỒ HỌA CHUYÊN NGHIỆP:
- Tấm nền IPS Black độ tương phản 2000:1, tần số quét nâng cấp 120Hz.
- Độ phủ màu tuyệt đối 100% sRGB và 85% DCI-P3 chuẩn màu thiết kế.
- Cảm biến ánh sáng tự động điều chỉnh độ sáng và nhiệt độ màu theo phòng làm việc.', 
  colors = 'Bạc Bạch Kim Platinum', 
  storage_options = 'IPS 120Hz 100% sRGB' 
WHERE id = 69;

-- Product ID 70: Sony Xperia 1 VI 256GB 5G Zeiss T*
UPDATE products SET 
  name = 'Sony Xperia 1 VI 256GB 5G Zeiss T*', 
  description = 'TUYỆT PHẨM NHIẾP ẢNH DI ĐỘNG DÀNH CHO DÂN CHUYÊN:
- Ống kính tele zoom quang học thực thụ từ 85mm đến 170mm không mất chi tiết.
- Lớp tráng phủ Zeiss T* chống lóa độc quyền cho màu sắc điện ảnh trung thực.
- Màn hình OLED LTPO tỷ lệ chuẩn 19.5:9 siêu sáng, thời lượng pin lên đến 2 ngày.', 
  colors = 'Xanh Rêu Khaki, Bạc Bạch Kim, Đen', 
  storage_options = '256GB, 512GB' 
WHERE id = 70;

-- Product ID 71: Loa Bluetooth Sony SRS-XE300 Chống nước IP67
UPDATE products SET 
  name = 'Loa Bluetooth Sony SRS-XE300 Chống nước IP67', 
  description = 'ÂM THANH LAN TỎA KHẮP KHÔNG GIAN:
- Bộ khuếch tán âm Line-Shape Diffuser mở rộng góc phát âm thanh đồng đều.
- Màng loa X-Balanced Speaker Unit cho âm bass căng tràn và âm cao ít méo tiếng.
- Chuẩn chống bụi nước IP67 và chống sốc va đập, pin bền bỉ 24 giờ.', 
  colors = 'Xanh Dương, Xám Bạc, Đen', 
  storage_options = 'Pin 24 giờ' 
WHERE id = 71;

-- Product ID 72: Tai nghe chụp tai Sony WH-CH720N Chống ồn
UPDATE products SET 
  name = 'Tai nghe chụp tai Sony WH-CH720N Chống ồn', 
  description = 'CHỐNG ỒN THÔNG MINH TRỌNG LƯỢNG SIÊU NHẸ:
- Tích hợp chip V1 cao cấp thừa hưởng từ mẫu tai nghe đầu bảng WH-1000XM5.
- Trọng lượng chỉ 192g cực kỳ nhẹ nhàng, đệm tai mềm mại êm ái khi đeo lâu.
- Thời lượng pin 35 giờ khi bật chống ồn, sạc nhanh 3 phút nghe được 1 giờ.', 
  colors = 'Xanh Navy, Trắng, Đen', 
  storage_options = 'Chip V1 Pin 35h' 
WHERE id = 72;

-- Product ID 73: Tai nghe True Wireless Sony WF-C500
UPDATE products SET 
  name = 'Tai nghe True Wireless Sony WF-C500', 
  description = 'NHỎ GỌN TRẺ TRUNG VỚI CÔNG NGHỆ DSEE:
- Cơ chế tăng cường âm thanh kỹ thuật số DSEE phục hồi dải âm cao bị nén.
- Hộp sạc hình viên thuốc nhỏ nhắn tiện bỏ túi quần, chống nước văng chuẩn IPX4.
- Tùy chỉnh chất âm Equalizer theo sở thích cá nhân qua ứng dụng Sony Headphones Connect.', 
  colors = 'Xanh Lá Cây, Cam San Hô, Trắng, Đen', 
  storage_options = 'IPX4 Pin 20h' 
WHERE id = 73;

-- Product ID 74: Chuột không dây Logitech Pebble M350 Siêu êm
UPDATE products SET 
  name = 'Chuột không dây Logitech Pebble M350 Siêu êm', 
  description = 'CHUỘT KHÔNG DÂY NHỎ GỌN ÊM ÁI:
- Công nghệ Silent Touch giảm 90% tiếng ồn nhấp chuột, làm việc đêm yên tĩnh.
- Kết nối linh hoạt qua Bluetooth hoặc đầu thu USB Receiver 2.4GHz.
- Thiết kế bo tròn dẹt thanh lịch như viên đá cuội, thời lượng pin 18 tháng chỉ với 1 viên pin AA.', 
  colors = 'Hồng Phấn, Trắng Sữa, Xanh Bạch Đàn, Đen', 
  storage_options = 'Silent Touch' 
WHERE id = 74;

-- Product ID 75: Chuột công thái học Logitech Lift Vertical
UPDATE products SET 
  name = 'Chuột công thái học Logitech Lift Vertical', 
  description = 'BẢO VỆ CỔ TAY TOÀN DIỆN CHO DÂN VĂN PHÒNG:
- Góc nghiêng tự nhiên 57 độ giúp cổ tay đặt ở tư thế bắt tay thư giãn, chống mỏi đau khớp.
- Phù hợp hoàn hảo cho bàn tay kích thước vừa và nhỏ của người Việt Nam.
- Cuộn bánh xe SmartWheel mượt mà từng dòng hoặc siêu tốc độ chỉ với cú gạt nhẹ.', 
  colors = 'Hồng Nhạt, Trắng Ngà, Đen Than', 
  storage_options = 'Góc nghiêng 57 độ' 
WHERE id = 75;

-- Product ID 76: Bàn phím không dây Logitech K380 Multi-Device
UPDATE products SET 
  name = 'Bàn phím không dây Logitech K380 Multi-Device', 
  description = 'BÀN PHÍM DI ĐỘNG SIÊU ĐẸP CHO MỌI THIẾT BỊ:
- Phím bấm tròn cổ điển gõ êm ái, khoảng cách phím tối ưu.
- Phím chuyển đổi nhanh Easy-Switch kết nối cùng lúc điện thoại, tablet và máy tính.
- Pin dùng đến 2 năm, trọng lượng nhẹ nhàng dễ dàng mang theo trong balo.', 
  colors = 'Hồng Rose, Cát Trắng, Xanh Lavender, Xám Đậm', 
  storage_options = 'Kết nối 3 thiết bị' 
WHERE id = 76;

-- Product ID 77: Chuột Gaming Logitech G502 HERO 25K Sensor
UPDATE products SET 
  name = 'Chuột Gaming Logitech G502 HERO 25K Sensor', 
  description = 'HUYỀN THOẠI CHUỘT CHƠI GAME BÁN CHẠY NHẤT THẾ GIỚI:
- Cảm biến HERO 25K độ chính xác cao nhất thế giới không làm mượt hay gia tốc.
- 11 nút có thể lập trình macro và lưu cấu hình trực tiếp vào bộ nhớ chuột.
- Kèm 5 tạ kim loại 3.6g có thể tùy biến trọng lượng và điểm cân bằng tay cầm.', 
  colors = 'Đen RGB', 
  storage_options = 'Cảm biến 25.600 DPI' 
WHERE id = 77;

-- Product ID 78: Tai nghe không dây Gaming Logitech G435 Lightspeed
UPDATE products SET 
  name = 'Tai nghe không dây Gaming Logitech G435 Lightspeed', 
  description = 'TAI NGHE KHÔNG DÂY SIÊU NHẸ 165G:
- Trọng lượng nhẹ bậc nhất thị trường không gây áp lực lên đầu khi đeo cả ngày.
- Kết nối Lightspeed không độ trễ cho game thủ và Bluetooth cho điện thoại.
- Micro tạo chùm tia kép giảm tiếng ồn xung quanh không cần cần gạt micro vướng víu.', 
  colors = 'Xanh Dương Vàng, Trắng Tím, Đen Vàng Neon', 
  storage_options = 'Trọng lượng 165g' 
WHERE id = 78;

-- Product ID 79: Loa Bluetooth Marshall Willen Mini
UPDATE products SET 
  name = 'Loa Bluetooth Marshall Willen Mini', 
  description = 'CHIẾC LOA MARSHALL NHỎ GỌN BỎ TÚI ĐÁNG SỞ HỮU:
- Thiết kế đậm chất Rock n Roll cổ điển với logo Marshall mạ vàng sang trọng.
- Dây đeo cao su đa năng phía sau dễ dàng buộc vào ghi đông xe đạp hay balo du lịch.
- Tiêu chuẩn chống bụi nước chuẩn IP67, pin bền bỉ 15 giờ liên tục.', 
  colors = 'Đen Viền Vàng Đồng, Kem Cream', 
  storage_options = 'IP67 Pin 15h' 
WHERE id = 79;

-- Product ID 80: Loa Bluetooth Marshall Acton III Stereo
UPDATE products SET 
  name = 'Loa Bluetooth Marshall Acton III Stereo', 
  description = 'ÂM VANG SỐNG ĐỘNG CHO CĂN PHÒNG CỦA BẠN:
- Âm trường stereo rộng hơn phiên bản tiền nhiệm, âm thanh tràn ngập không gian.
- Cụm nút kim loại vặn cơ học chỉnh Bass, Treble và Volume hoài cổ đầy cảm xúc.
- Kết nối Bluetooth 5.2 thế hệ mới sẵn sàng cho công nghệ Bluetooth LE Audio.', 
  colors = 'Đen Cổ Điển, Kem Vintage, Nâu Đất', 
  storage_options = 'Công suất 60W' 
WHERE id = 80;

-- Product ID 81: Tai nghe chụp tai Marshall Major IV Wireless
UPDATE products SET 
  name = 'Tai nghe chụp tai Marshall Major IV Wireless', 
  description = 'HUYỀN THOẠI TAI NGHE VỚI THỜI LƯỢNG PIN KỶ LỤC 80 GIỜ:
- Driver dynamic 40mm được tinh chỉnh cho âm bass gầm vang và âm mid mượt mà.
- Thời lượng pin kinh ngạc hơn 80 giờ, hỗ trợ sạc không dây chuẩn Qi tiện lợi.
- Núm điều khiển đa hướng Control Knob bằng đồng thau điều hướng nhạc trực quan.', 
  colors = 'Nâu Da Bò, Đen Nhám', 
  storage_options = 'Pin trâu 80 giờ' 
WHERE id = 81;

-- Cập nhật chuẩn hóa Tiếng Việt cho toàn bộ reviews bị lỗi font
UPDATE reviews SET comment = 'Sản phẩm chính hãng đóng gói rất kỹ, dùng cực kỳ ưng ý!' WHERE comment LIKE '%S?n ph?m ch?nh h?ng%';
UPDATE reviews SET comment = 'Giao hàng siêu tốc, đúng mô tả. Thiết kế rất đẹp và sang trọng.' WHERE comment LIKE '%Giao h?ng si?u t?c%';
UPDATE reviews SET comment = 'Chất lượng vượt xa tầm giá, dùng mượt mà và pin rất bền.' WHERE comment LIKE '%Ch?t l??ng v??t xa%';
UPDATE reviews SET comment = 'Mua làm quà tặng bạn bè ai cũng khen. Rất đáng đồng tiền bát gạo!' WHERE comment LIKE '%Mua l?m qu? t?ng%';
UPDATE reviews SET comment = 'Shop tư vấn nhiệt tình, chế độ bảo hành chu đáo. Sẽ tiếp tục ủng hộ!' WHERE comment LIKE '%Shop t? v?n nhi?t t?nh%';
UPDATE reviews SET comment = 'Trải nghiệm tuyệt vời, âm thanh/hiệu năng rất đỉnh, kết nối nhanh chóng.' WHERE comment LIKE '%Tr?i nghi?m tuy?t v?i%';
