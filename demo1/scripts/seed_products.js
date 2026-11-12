const fs = require('fs');
const { execSync } = require('child_process');

const products = [
  // --- APPLE (brand_id: 1) ---
  {
    name: "iPhone 16 Pro Max 256GB",
    cat_id: 2, brand_id: 1, price: 34990000, discount: 6, qty: 45, sold: 52,
    colors: "Titan Sa Mạc, Titan Tự Nhiên, Titan Trắng, Titan Đen",
    storage: "256GB, 512GB, 1TB",
    desc: `THÔNG SỐ KỸ THUẬT VƯỢT TRỘI:\n- Màn hình: Super Retina XDR OLED 6.9 inch, ProMotion 120Hz, Dynamic Island.\n- Chip xử lý: Apple A18 Pro 3nm cực mạnh, hỗ trợ Apple Intelligence toàn diện.\n- Camera: Hệ thống camera chuyên nghiệp 48MP Fusion, Telephoto 5x thế hệ mới, nút Camera Control cảm ứng lực.\n- Chất liệu: Khung viền Titan chuẩn hàng không vũ trụ mạ PVD cao cấp, mặt lưng kính nhám.\n- Thời lượng pin: Lên đến 33 giờ xem video liên tục, sạc nhanh MagSafe 25W.`,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "iPhone 16 Plus 128GB",
    cat_id: 2, brand_id: 1, price: 25990000, discount: 8, qty: 30, sold: 28,
    colors: "Hồng Pastel, Xanh Mòng Két, Xanh Lưu Ly, Trắng, Đen",
    storage: "128GB, 256GB, 512GB",
    desc: `ĐẶC ĐIỂM NỔI BẬT:\n- Màn hình lớn 6.7 inch Super Retina XDR độ sáng tối đa 2000 nits.\n- Chip Apple A18 tiến trình 3nm tối ưu hiệu năng và tiết kiệm pin.\n- Nút Điều khiển Camera (Camera Control) thao tác chụp và quay video nhanh chóng.\n- Cụm camera kép 48MP Fusion sắc nét, quay video không gian Spatial Video.\n- Thời lượng pin xuất sắc hàng đầu dòng iPhone.`,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "iPhone 15 128GB Chính Hãng",
    cat_id: 2, brand_id: 1, price: 19490000, discount: 10, qty: 40, sold: 65,
    colors: "Hồng Nhạt, Xanh Lá Cây, Vàng, Xanh Dương, Đen",
    storage: "128GB, 256GB",
    desc: `CHI TIẾT SẢN PHẨM:\n- Màn hình Dynamic Island 6.1 inch tiện ích và hiện đại.\n- Camera chính 48MP zoom quang học 2x không suy giảm chất lượng.\n- Cổng sạc USB-C chuẩn chung tiện lợi, dễ dàng dùng chung phụ kiện.\n- Mặt lưng kính pha màu mờ sang trọng, viền nhôm bo cong êm ái khi cầm nắm.`,
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "iPhone 13 128GB",
    cat_id: 2, brand_id: 1, price: 13690000, discount: 12, qty: 50, sold: 95,
    colors: "Xanh Midnight, Ánh Sao Starlight, Đỏ, Xanh Dương",
    storage: "128GB, 256GB",
    desc: `MẪU SMARTPHONE BÁN CHẠY NHẤT PHÂN KHÚC:\n- Màn hình Super Retina XDR 6.1 inch sắc nét, màu sắc trung thực.\n- Chip A15 Bionic vẫn cực kỳ mạnh mẽ, chiến mượt mà mọi tựa game.\n- Cụm camera chéo 12MP chống rung dịch chuyển cảm biến OIS cao cấp.\n- Pin bền bỉ, giá thành hiện tại cực kỳ kinh tế và đáng mua.`,
    images: [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "iPad Gen 10 10.9 inch Wifi 64GB",
    cat_id: 2, brand_id: 1, price: 8990000, discount: 8, qty: 35, sold: 48,
    colors: "Xanh Dương, Vàng, Bạc, Hồng",
    storage: "64GB, 256GB",
    desc: `MÁY TÍNH BẢNG HỌC TẬP VÀ GIẢI TRÍ TOÀN DIỆN:\n- Thiết kế viền đều phẳng 4 cạnh hiện đại, màn hình Liquid Retina 10.9 inch.\n- Chip Apple A14 Bionic tốc độ cao, hỗ trợ đa nhiệm mượt mà.\n- Cổng sạc USB-C, tương thích Magic Keyboard Folio và bút Apple Pencil.\n- Camera trước góc siêu rộng 12MP đặt ngang với công nghệ Center Stage.`,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "iPad mini 6 8.3 inch Wifi 64GB",
    cat_id: 2, brand_id: 1, price: 11990000, discount: 10, qty: 25, sold: 22,
    colors: "Xám Không Gian, Ánh Sao, Tím, Hồng",
    storage: "64GB, 256GB",
    desc: `SỨC MẠNH LỚN TRONG THÂN HÌNH NHỎ GỌN:\n- Màn hình 8.3 inch Liquid Retina True Tone, dải màu rộng DCI-P3.\n- Chip A15 Bionic mạnh mẽ, cầm vừa gọn gàng bằng 1 bàn tay.\n- Hỗ trợ bút Apple Pencil 2 gắn hít nam châm sạc không dây.\n- Trọng lượng chỉ 293g, lý tưởng để ghi chú, đọc sách và chơi game di động.`,
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "MacBook Air 15 inch M3 16GB/512GB",
    cat_id: 3, brand_id: 1, price: 31990000, discount: 7, qty: 20, sold: 18,
    colors: "Xanh Đen Midnight, Ánh Sao, Bạc, Xám Không Gian",
    storage: "16GB/512GB SSD",
    desc: `MÀN HÌNH LỚN SIÊU MỎNG NHẸ:\n- Màn hình Liquid Retina 15.3 inch 500 nits sống động rực rỡ.\n- Chip Apple M3 tiến trình 3nm tối tân kèm GPU hỗ trợ Ray Tracing.\n- Hệ thống 6 loa âm thanh vòm với Spatial Audio cực kỳ sống động.\n- Thiết kế không quạt tản nhiệt, hoàn toàn êm ái không một tiếng ồn.`,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Mac mini M2 8GB/256GB",
    cat_id: 3, brand_id: 1, price: 14490000, discount: 5, qty: 25, sold: 14,
    colors: "Bạc Sang Trọng",
    storage: "256GB, 512GB SSD",
    desc: `CỖ MÁY ĐỂ BÀN NHỎ GỌN SIÊU KINH TẾ:\n- CPU 8 lõi và GPU 10 lõi xử lý hình ảnh và video nhanh chóng.\n- Cổng kết nối đa dạng: 2 cổng Thunderbolt 4, 2 cổng USB-A, HDMI, Gigabit Ethernet.\n- Thân máy nhôm tái chế nhỏ gọn 19.7 x 19.7 cm đặt gọn gàng trên mọi bàn làm việc.`,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Bút cảm ứng Apple Pencil Pro",
    cat_id: 4, brand_id: 1, price: 3490000, discount: 0, qty: 60, sold: 35,
    colors: "Trắng",
    storage: "Tiêu Chuẩn",
    desc: `ĐỈNH CAO SÁNG TẠO DÀNH CHO IPAD:\n- Cảm ứng bóp Barrel Roll xoay bút chuyển đổi nét vẽ trực quan.\n- Phản hồi rung xúc giác Haptic Feedback cho cảm giác vẽ như trên giấy thật.\n- Định vị vị trí dễ dàng với tính năng Find My tích hợp.\n- Sạc và kết nối nam châm không dây trực tiếp bên cạnh iPad.`,
    images: [
      "https://images.unsplash.com/photo-1585336261026-6a01dfb00ee1?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Chuột không dây Apple Magic Mouse 2",
    cat_id: 4, brand_id: 1, price: 1890000, discount: 5, qty: 50, sold: 45,
    colors: "Trắng Bạc, Đen Nhám",
    storage: "Tiêu Chuẩn",
    desc: `THIẾT KẾ CÔNG THÁI HỌC VÀ CẢM ỨNG ĐA ĐIỂM:\n- Bề mặt Multi-Touch cho phép vuốt chuyển trang và cuộn tài liệu mượt mà.\n- Kết nối Bluetooth ổn định, tự động ghép nối với máy Mac.\n- Pin sạc tích hợp bên trong dùng được cả tháng chỉ sau một lần sạc.`,
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Tai nghe chụp tai Apple AirPods Max USB-C",
    cat_id: 4, brand_id: 1, price: 12990000, discount: 8, qty: 20, sold: 16,
    colors: "Đêm Xanh Thẳm, Ánh Sao, Cam San Hô, Tím Nhạt",
    storage: "Bản Cao Cấp",
    desc: `ÂM THANH HI-FI VÀ CHỐNG ỒN CHỦ ĐỘNG ĐỈNH CAO:\n- Màng loa dynamic 40mm do Apple tự thiết kế tái tạo âm thanh chuẩn phòng thu.\n- Công nghệ Spatial Audio cá nhân hóa theo dõi cử động đầu người nghe.\n- Khung quai bằng thép không gỉ bọc vật liệu đan dệt thoáng khí êm ái.\n- Cổng sạc USB-C thế hệ mới nhất, thời lượng pin 20 giờ.`,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Thiết bị định vị Apple AirTag 1 Pack",
    cat_id: 4, brand_id: 1, price: 750000, discount: 5, qty: 80, sold: 110,
    colors: "Trắng Bạc",
    storage: "1 Pack",
    desc: `TÌM KIẾM ĐỒ ĐẠC DỄ DÀNG VỚI MẠNG LƯỚI TOÀN CẦU:\n- Công nghệ Ultra Wideband (UWB) chỉ đường chuẩn xác từng centimet.\n- Loa tích hợp phát âm thanh giúp bạn dễ tìm ví tiền, chùm chìa khóa hay balo.\n- Tiêu chuẩn chống bụi nước IP67 bền bỉ, pin thay thế CR2032 dùng cả năm.`,
    images: [
      "https://images.unsplash.com/photo-1610492461142-b06cefc1ee61?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Apple Watch SE 2 40mm GPS Viền Nhôm",
    cat_id: 5, brand_id: 1, price: 5690000, discount: 10, qty: 45, sold: 38,
    colors: "Đen Midnight, Ánh Sao Starlight, Bạc Silver",
    storage: "40mm GPS",
    desc: `CHIẾC ĐỒNG HỒ THÔNG MINH ĐÁNG MUA NHẤT:\n- Theo dõi nhịp tim, giấc ngủ và phát hiện va chạm xe hơi (Crash Detection).\n- Chip xử lý S8 SiP tốc độ cao ngang Apple Watch Series 8.\n- Chống nước ở độ sâu 50 mét, thoải mái đeo đi bơi lội hay tập luyện thể thao.`,
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Apple Watch Series 9 41mm GPS",
    cat_id: 5, brand_id: 1, price: 8990000, discount: 15, qty: 30, sold: 29,
    colors: "Hồng Nhạt, Đen Midnight, Ánh Sao, Đỏ Product(RED)",
    storage: "41mm GPS",
    desc: `TÍNH NĂNG DOUBLE TAP KỲ DIỆU:\n- Chạm 2 ngón tay Double Tap điều khiển cuộc gọi và phát nhạc không cần chạm màn hình.\n- Màn hình Always-On độ sáng 2000 nits gấp đôi thế hệ trước.\n- Đo nồng độ oxy trong máu SpO2, điện tâm đồ ECG và cảm biến nhiệt độ theo dõi sức khỏe nữ giới.`,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ]
  },

  // --- SAMSUNG (brand_id: 2) ---
  {
    name: "Samsung Galaxy S24+ 256GB",
    cat_id: 2, brand_id: 2, price: 21990000, discount: 15, qty: 35, sold: 25,
    colors: "Tím Mơ Mộng, Vàng Hổ Phách, Đen Oynx, Xám Coban",
    storage: "256GB, 512GB",
    desc: `QUYỀN NĂNG GALAXY AI ĐÍCH THỰC:\n- Màn hình Dynamic AMOLED 2X 6.7 inch QHD+ tần số quét 1-120Hz mượt mà.\n- Trợ lý AI khoanh tròn tìm kiếm Circle to Search, dịch cuộc gọi trực tiếp đa ngôn ngữ.\n- Khung viền Armor Aluminum cứng cáp chống va đập, kính Gorilla Glass Victus 2.\n- Pin lớn 4900mAh kèm công nghệ sạc siêu nhanh 45W.`,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Samsung Galaxy Z Flip6 5G 256GB",
    cat_id: 2, brand_id: 2, price: 24990000, discount: 12, qty: 28, sold: 32,
    colors: "Xanh Maya, Xám Metal, Vàng Mì, Xanh Mint",
    storage: "256GB, 512GB",
    desc: `THIẾT KẾ GẬP THỜI TRANG ĐỈNH CAO:\n- Màn hình phụ FlexWindow 3.4 inch trả lời tin nhắn và chụp ảnh selfie thông minh.\n- Camera 50MP nâng cấp vượt bậc với công nghệ ProVisual Engine bắt trọn từng khoảnh khắc.\n- Tản nhiệt buồng hơi Vapor Chamber lần đầu tiên xuất hiện trên dòng Flip giúp máy mát mẻ.\n- Chuẩn kháng bụi nước IP48 bền bỉ hơn bao giờ hết.`,
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Samsung Galaxy A55 5G 128GB",
    cat_id: 2, brand_id: 2, price: 9290000, discount: 10, qty: 55, sold: 68,
    colors: "Xanh Iceblue, Lilac Tím, Xanh Đen Navy",
    storage: "128GB, 256GB",
    desc: `VUA PHÂN KHÚC TẦM TRUNG:\n- Khung viền kim loại sang trọng kết hợp 2 mặt kính cường lực bóng bẩy.\n- Màn hình Super AMOLED 6.6 inch 120Hz rực rỡ sắc nét.\n- Vi xử lý Exynos 1480 kèm đồ họa AMD Xclipse 530 chơi game mượt.\n- Bảo mật chuẩn doanh nghiệp Samsung Knox Vault an toàn tuyệt đối.`,
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Samsung Galaxy A15 LTE 128GB",
    cat_id: 2, brand_id: 2, price: 4290000, discount: 8, qty: 70, sold: 85,
    colors: "Xanh Lạc Quan, Vàng Cá Tính, Đen Tuyền",
    storage: "128GB",
    desc: `SMARTPHONE PHỔ THÔNG MÀN HÌNH AMOLED CỰC ĐẸP:\n- Màn hình Super AMOLED 6.5 inch 90Hz chất lượng hiển thị vượt trội trong tầm giá.\n- Camera 50MP sắc nét cùng camera góc siêu rộng và macro.\n- Pin khủng 5.000mAh dùng trọn vẹn 2 ngày, hỗ trợ sạc nhanh 25W.`,
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra 256GB",
    cat_id: 2, brand_id: 2, price: 26990000, discount: 14, qty: 20, sold: 15,
    colors: "Xám Đậm Graphite, Kem Beige",
    storage: "256GB, 512GB",
    desc: `TABLET ANDROID ĐỈNH CAO VỚI MÀN HÌNH KHỦNG 14.6 INCH:\n- Màn hình Dynamic AMOLED 2X 14.6 inch siêu rộng thay thế máy tính xách tay.\n- Tặng kèm bút S-Pen thế hệ mới chống nước IP68 viết vẽ siêu nhạy.\n- Chip Snapdragon 8 Gen 2 for Galaxy hiệu năng cực đỉnh, hỗ trợ Samsung DeX biến hình PC.`,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Tai nghe Samsung Galaxy Buds3 Pro",
    cat_id: 4, brand_id: 2, price: 4990000, discount: 10, qty: 35, sold: 28,
    colors: "Bạc Ánh Kim, Trắng Tinh Khiết",
    storage: "Tiêu Chuẩn",
    desc: `ÂM THANH CHUẨN PHÒNG THU 24-BIT 96KHZ:\n- Thiết kế đuôi đèn Blade Lights độc đáo đậm chất tương lai.\n- Loa 2 chiều với loa tweeter planar mang lại âm cao trong trẻo và âm trầm uy lực.\n- Khử tiếng ồn thích ứng AI Adaptive ANC tự động lọc tạp âm theo môi trường.`,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Tai nghe Samsung Galaxy Buds FE",
    cat_id: 4, brand_id: 2, price: 1490000, discount: 15, qty: 60, sold: 55,
    colors: "Trắng, Đen Graphite",
    storage: "Tiêu Chuẩn",
    desc: `CHỐNG ỒN CHỦ ĐỘNG GIÁ TỐT NHẤT:\n- Thiết kế cánh bám Wingtip êm ái, bám chắc vào tai khi vận động.\n- Chống ồn chủ động ANC mạnh mẽ và chế độ âm thanh xung quanh Ambient Sound.\n- Thời lượng pin lên đến 30 giờ khi dùng kèm hộp sạc.`,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Củ sạc nhanh Samsung 45W Type-C",
    cat_id: 4, brand_id: 2, price: 690000, discount: 10, qty: 90, sold: 130,
    colors: "Đen, Trắng",
    storage: "45W kèm Cáp 5A",
    desc: `SẠC SIÊU NHANH 2.0 AN TOÀN:\n- Chuẩn Power Delivery (PD) và PPS tối ưu cho các dòng Galaxy S và Tab S.\n- Kèm sẵn cáp sạc 5A bọc dù chắc chắn chịu tải cao.\n- Bảo vệ quá dòng, ngắn mạch và kiểm soát nhiệt độ thông minh.`,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Vòng đeo tay thông minh Samsung Galaxy Fit3",
    cat_id: 5, brand_id: 2, price: 1290000, discount: 10, qty: 70, sold: 88,
    colors: "Xám Đậm, Hồng Ánh Kim, Bạc",
    storage: "Màn hình 1.6 inch",
    desc: `THEO DÕI SỨC KHỎE NHỎ GỌN PIN 13 NGÀY:\n- Màn hình lớn 1.6 inch AMOLED viền nhôm sang trọng.\n- Đo hơn 100 bài tập luyện thể thao, theo dõi nồng độ oxy trong máu SpO2.\n- Cảnh báo té ngã khẩn cấp và gửi vị trí cứu hộ SOS tự động.`,
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
    ]
  },

  // --- XIAOMI (brand_id: 3) ---
  {
    name: "Xiaomi 14 512GB Leica Camera",
    cat_id: 2, brand_id: 3, price: 18990000, discount: 10, qty: 30, sold: 22,
    colors: "Xanh Ngọc Bích, Trắng Tuyết, Đen Nhám",
    storage: "256GB, 512GB",
    desc: `FLAGSHIP NHỎ GỌN VỚI ỐNG KÍNH LEICA ĐỈNH CAO:\n- Cụm 3 camera Leica Summilux 50MP cảm biến Light Fusion 900 bắt sáng siêu đẳng.\n- Màn hình 6.36 inch AMOLED 1.5K tần số quét 1-120Hz viền siêu mỏng chỉ 1.61mm.\n- Chipset Snapdragon 8 Gen 3 siêu mạnh, sạc nhanh HyperCharge 90W và sạc không dây 50W.`,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Xiaomi Redmi Note 13 128GB",
    cat_id: 2, brand_id: 3, price: 4490000, discount: 12, qty: 80, sold: 95,
    colors: "Xanh Băng Tuyết, Vàng Hoàng Hôn, Đen",
    storage: "128GB, 256GB",
    desc: `BỨC PHÁ ĐẲNG CẤP PHÂN KHÚC PHỔ THÔNG:\n- Camera siêu nét 108MP chụp ảnh chi tiết vượt trội, zoom in-sensor 3x sắc sảo.\n- Màn hình AMOLED 120Hz viền mỏng ấn tượng, độ sáng cực đại 1800 nits.\n- Cảm biến vân tay quang học ẩn dưới màn hình hiện đại, sạc nhanh 33W.`,
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Xiaomi Redmi 13C 128GB",
    cat_id: 2, brand_id: 3, price: 2790000, discount: 10, qty: 90, sold: 110,
    colors: "Xanh Cỏ Ba Lá, Xanh Hải Quân, Đen",
    storage: "128GB",
    desc: `SMARTPHONE GIÁ RẺ ĐÁNG MUA NHẤT:\n- Màn hình lớn 6.74 inch 90Hz mượt mà xem phim thả ga.\n- Bộ nhớ trong 128GB thoải mái lưu hình ảnh, pin trâu 5.000mAh.\n- Camera AI 50MP chụp ảnh sắc nét, mở khóa vân tay cạnh viền nhanh chóng.`,
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Xiaomi Pad 6 128GB",
    cat_id: 2, brand_id: 3, price: 7490000, discount: 10, qty: 45, sold: 50,
    colors: "Xanh Thiên Thanh, Vàng Sâm Banh, Xám",
    storage: "128GB, 256GB",
    desc: `TABLET ĐỒ HỌA VÀ GIẢI TRÍ ĐỈNH CAO:\n- Màn hình 11 inch độ phân giải 2.8K, tần số quét 144Hz siêu mượt.\n- Vi xử lý Snapdragon 870 hiệu năng ổn định, thân nhôm nguyên khối chỉ 490g.\n- 4 loa âm thanh vòm Dolby Atmos sống động như rạp chiếu phim.`,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Tai nghe Xiaomi Redmi Buds 5 Pro",
    cat_id: 4, brand_id: 3, price: 1690000, discount: 10, qty: 50, sold: 45,
    colors: "Trắng Tuyết, Đen Midnight, Xanh Cẩm Thạch",
    storage: "Chống ồn 52dB",
    desc: `CHỐNG ỒN CHỦ ĐỘNG KHỦNG 52DB:\n- Driver kép đồng trục gồm loa trầm titan 11mm và loa tweeter gốm áp điện 10mm.\n- Hỗ trợ giải mã âm thanh Hi-Res Audio Wireless chuẩn LDAC chất lượng cao.\n- Pin dùng liên tục đến 38 giờ kèm hộp sạc.`,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Pin sạc dự phòng Xiaomi 20.000mAh 50W Pro",
    cat_id: 4, brand_id: 3, price: 890000, discount: 10, qty: 85, sold: 140,
    colors: "Đen Nhám",
    storage: "20.000mAh 50W",
    desc: `CÔNG SUẤT KHỦNG SẠC ĐƯỢC CẢ LAPTOP:\n- Cổng Type-C công suất đầu ra lên đến 50W Max, sạc tốt cho MacBook và laptop văn phòng.\n- Dung lượng 20.000mAh nạp đầy nhiều lần cho điện thoại và máy tính bảng.\n- Hỗ trợ sạc đồng thời 3 thiết bị an toàn tuyệt đối.`,
    images: [
      "https://images.unsplash.com/photo-1609592424364-77ac260ff00b?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Vòng đeo tay thông minh Xiaomi Smart Band 9",
    cat_id: 5, brand_id: 3, price: 890000, discount: 10, qty: 120, sold: 180,
    colors: "Đen, Hồng Ánh Vàng, Bạc Băng, Xanh Dương",
    storage: "Màn hình AMOLED 60Hz",
    desc: `CHIẾC SMARTBAND QUỐC DÂN THẾ HỆ THỨ 9:\n- Màn hình AMOLED 1.62 inch độ sáng lên đến 1200 nits hiển thị rõ dưới nắng gắt.\n- Khung hợp kim nhôm sang trọng có thể tháo rời đeo như mặt dây chuyền.\n- Thời lượng pin không tưởng lên đến 21 ngày sử dụng liên tục.`,
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
    ]
  },

  // --- ASUS (brand_id: 5) ---
  {
    name: "Laptop Asus Vivobook 15 X1504 Core i5",
    cat_id: 3, brand_id: 5, price: 14490000, discount: 8, qty: 40, sold: 42,
    colors: "Bạc Tinh Tú, Xanh Lam Đậm",
    storage: "16GB RAM / 512GB SSD",
    desc: `LAPTOP HỌC TẬP VÀ VĂN PHÒNG HOÀN HẢO:\n- Vi xử lý Intel Core i5-1335U 10 nhân 12 luồng xử lý cực nhanh các tác vụ Office và đồ họa.\n- Màn hình 15.6 inch Full HD viền mỏng NanoEdge chống chói bảo vệ mắt.\n- Bản lề mở gập 180 độ tiện chia sẻ nội dung, bàn phím ErgoSense gõ êm ái.\n- Đạt tiêu chuẩn độ bền chuẩn quân đội Mỹ MIL-STD-810H.`,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Laptop Asus TUF Gaming A15 R7 RTX 4060",
    cat_id: 3, brand_id: 5, price: 25990000, discount: 12, qty: 30, sold: 48,
    colors: "Xám Cơ Khí Mecha Gray",
    storage: "16GB RAM / 512GB SSD",
    desc: `CỖ MÁY CHIẾN GAME BỀN BỈ ĐẲNG CẤP TUF:\n- Chip AMD Ryzen 7 7735HS kết hợp card đồ họa rời NVIDIA GeForce RTX 4060 8GB.\n- Màn hình 15.6 inch 144Hz 100% sRGB hỗ trợ G-Sync triệt tiêu xé hình.\n- Hệ thống tản nhiệt quạt Arc Flow 84 cánh kép mát mẻ khi combat liên tục.\n- Bàn phím có đèn nền RGB từng vùng chuyên biệt cho game thủ.`,
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Máy chơi game cầm tay Asus ROG Ally X 24GB/1TB",
    cat_id: 3, brand_id: 5, price: 22990000, discount: 5, qty: 25, sold: 26,
    colors: "Đen Nhám ROG",
    storage: "24GB LPDDR5X / 1TB SSD",
    desc: `ĐỈNH CAO CHƠI GAME PC MỌI LÚC MỌI NƠI:\n- Bộ xử lý AMD Ryzen Z1 Extreme, bộ nhớ RAM nâng cấp 24GB LPDDR5X tốc độ cao.\n- Dung lượng pin gấp đôi 80Wh chơi game thỏa thích nhiều giờ liền.\n- Màn hình cảm ứng Full HD 120Hz 500 nits sắc nét chuẩn màu.\n- Chạy hệ điều hành Windows 11 nguyên bản hỗ trợ mọi nền tảng Steam, Game Pass, Epic Games.`,
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Chuột Gaming Asus ROG Keris Wireless AimPoint",
    cat_id: 4, brand_id: 5, price: 1890000, discount: 10, qty: 45, sold: 30,
    colors: "Đen, Trắng Tuyết Moonlight White",
    storage: "36.000 DPI",
    desc: `CHUỘT BẮN SÚNG FPS SIÊU NHẸ 75G:\n- Cảm biến quang học ROG AimPoint độ nhạy lên đến 36.000 DPI với độ lệch CPI < 1%.\n- 3 chế độ kết nối: Không dây RF 2.4GHz, Bluetooth tiết kiệm pin và có dây USB.\n- Nút bấm ROG Micro Switch tuổi thọ 70 triệu lượt bấm thay thế nóng độc quyền.`,
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ]
  },

  // --- DELL (brand_id: 9) ---
  {
    name: "Laptop Dell Vostro 3520 Core i5-1235U",
    cat_id: 3, brand_id: 9, price: 13990000, discount: 10, qty: 50, sold: 52,
    colors: "Đen Carbon",
    storage: "8GB RAM / 512GB SSD",
    desc: `CHIẾC LAPTOP BỀN BỈ ĐẾN TỪ THƯƠNG HIỆU MỸ:\n- Chip Intel Core i5 thế hệ 12 đa nhân đa luồng xử lý mượt mà.\n- Màn hình 15.6 inch viền hẹp 120Hz cho trải nghiệm cuộn lướt êm dịu.\n- Bản lề nâng Ergonomic thông minh tạo góc nghiêng gõ phím thoải mái và tản nhiệt tốt hơn.`,
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Laptop Dell G15 Gaming 5530 Core i7 RTX 4050",
    cat_id: 3, brand_id: 9, price: 27990000, discount: 10, qty: 25, sold: 28,
    colors: "Xám Đậm Shadow Gray",
    storage: "16GB RAM / 512GB SSD",
    desc: `HIỆU NĂNG ĐỒ HỌA MẠNH MẼ LẤY CẢM HỨNG TỪ ALIENWARE:\n- Chip Intel Core i7-13650HX 14 nhân kết hợp GPU RTX 4050 6GB cực khỏe.\n- Màn hình 15.6 inch 120Hz mượt mà cho trải nghiệm game hành động không độ trễ.\n- Nút Game Shift (F9) kích hoạt xung nhịp quạt tối đa chỉ với 1 lần bấm.`,
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Màn hình đồ họa Dell UltraSharp U2424H 24 inch",
    cat_id: 4, brand_id: 9, price: 5490000, discount: 5, qty: 40, sold: 39,
    colors: "Bạc Bạch Kim Platinum",
    storage: "IPS 120Hz 100% sRGB",
    desc: `CHUẨN MỰC HIỂN THỊ ĐỒ HỌA CHUYÊN NGHIỆP:\n- Tấm nền IPS Black độ tương phản 2000:1, tần số quét nâng cấp 120Hz.\n- Độ phủ màu tuyệt đối 100% sRGB và 85% DCI-P3 chuẩn màu thiết kế.\n- Cảm biến ánh sáng tự động điều chỉnh độ sáng và nhiệt độ màu theo phòng làm việc.`,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ]
  },

  // --- SONY (brand_id: 4) ---
  {
    name: "Sony Xperia 1 VI 256GB 5G Zeiss T*",
    cat_id: 2, brand_id: 4, price: 28990000, discount: 5, qty: 15, sold: 12,
    colors: "Xanh Rêu Khaki, Bạc Bạch Kim, Đen",
    storage: "256GB, 512GB",
    desc: `TUYỆT PHẨM NHIẾP ẢNH DI ĐỘNG DÀNH CHO DÂN CHUYÊN:\n- Ống kính tele zoom quang học thực thụ từ 85mm đến 170mm không mất chi tiết.\n- Lớp tráng phủ Zeiss T* chống lóa độc quyền cho màu sắc điện ảnh trung thực.\n- Màn hình OLED LTPO tỷ lệ chuẩn 19.5:9 siêu sáng, thời lượng pin lên đến 2 ngày.`,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Loa Bluetooth Sony SRS-XE300 Chống nước IP67",
    cat_id: 4, brand_id: 4, price: 2990000, discount: 15, qty: 35, sold: 32,
    colors: "Xanh Dương, Xám Bạc, Đen",
    storage: "Pin 24 giờ",
    desc: `ÂM THANH LAN TỎA KHẮP KHÔNG GIAN:\n- Bộ khuếch tán âm Line-Shape Diffuser mở rộng góc phát âm thanh đồng đều.\n- Màng loa X-Balanced Speaker Unit cho âm bass căng tràn và âm cao ít méo tiếng.\n- Chuẩn chống bụi nước IP67 và chống sốc va đập, pin bền bỉ 24 giờ.`,
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Tai nghe chụp tai Sony WH-CH720N Chống ồn",
    cat_id: 4, brand_id: 4, price: 2490000, discount: 10, qty: 50, sold: 58,
    colors: "Xanh Navy, Trắng, Đen",
    storage: "Chip V1 Pin 35h",
    desc: `CHỐNG ỒN THÔNG MINH TRỌNG LƯỢNG SIÊU NHẸ:\n- Tích hợp chip V1 cao cấp thừa hưởng từ mẫu tai nghe đầu bảng WH-1000XM5.\n- Trọng lượng chỉ 192g cực kỳ nhẹ nhàng, đệm tai mềm mại êm ái khi đeo lâu.\n- Thời lượng pin 35 giờ khi bật chống ồn, sạc nhanh 3 phút nghe được 1 giờ.`,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Tai nghe True Wireless Sony WF-C500",
    cat_id: 4, brand_id: 4, price: 1290000, discount: 20, qty: 65, sold: 72,
    colors: "Xanh Lá Cây, Cam San Hô, Trắng, Đen",
    storage: "IPX4 Pin 20h",
    desc: `NHỎ GỌN TRẺ TRUNG VỚI CÔNG NGHỆ DSEE:\n- Cơ chế tăng cường âm thanh kỹ thuật số DSEE phục hồi dải âm cao bị nén.\n- Hộp sạc hình viên thuốc nhỏ nhắn tiện bỏ túi quần, chống nước văng chuẩn IPX4.\n- Tùy chỉnh chất âm Equalizer theo sở thích cá nhân qua ứng dụng Sony Headphones Connect.`,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ]
  },

  // --- LOGITECH (brand_id: 7) ---
  {
    name: "Chuột không dây Logitech Pebble M350 Siêu êm",
    cat_id: 4, brand_id: 7, price: 420000, discount: 10, qty: 110, sold: 165,
    colors: "Hồng Phấn, Trắng Sữa, Xanh Bạch Đàn, Đen",
    storage: "Silent Touch",
    desc: `CHUỘT KHÔNG DÂY NHỎ GỌN ÊM ÁI:\n- Công nghệ Silent Touch giảm 90% tiếng ồn nhấp chuột, làm việc đêm yên tĩnh.\n- Kết nối linh hoạt qua Bluetooth hoặc đầu thu USB Receiver 2.4GHz.\n- Thiết kế bo tròn dẹt thanh lịch như viên đá cuội, thời lượng pin 18 tháng chỉ với 1 viên pin AA.`,
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Chuột công thái học Logitech Lift Vertical",
    cat_id: 4, brand_id: 7, price: 1490000, discount: 10, qty: 55, sold: 62,
    colors: "Hồng Nhạt, Trắng Ngà, Đen Than",
    storage: "Góc nghiêng 57 độ",
    desc: `BẢO VỆ CỔ TAY TOÀN DIỆN CHO DÂN VĂN PHÒNG:\n- Góc nghiêng tự nhiên 57 độ giúp cổ tay đặt ở tư thế bắt tay thư giãn, chống mỏi đau khớp.\n- Phù hợp hoàn hảo cho bàn tay kích thước vừa và nhỏ của người Việt Nam.\n- Cuộn bánh xe SmartWheel mượt mà từng dòng hoặc siêu tốc độ chỉ với cú gạt nhẹ.`,
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Bàn phím không dây Logitech K380 Multi-Device",
    cat_id: 4, brand_id: 7, price: 620000, discount: 15, qty: 95, sold: 135,
    colors: "Hồng Rose, Cát Trắng, Xanh Lavender, Xám Đậm",
    storage: "Kết nối 3 thiết bị",
    desc: `BÀN PHÍM DI ĐỘNG SIÊU ĐẸP CHO MỌI THIẾT BỊ:\n- Phím bấm tròn cổ điển gõ êm ái, khoảng cách phím tối ưu.\n- Phím chuyển đổi nhanh Easy-Switch kết nối cùng lúc điện thoại, tablet và máy tính.\n- Pin dùng đến 2 năm, trọng lượng nhẹ nhàng dễ dàng mang theo trong balo.`,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Chuột Gaming Logitech G502 HERO 25K Sensor",
    cat_id: 4, brand_id: 7, price: 990000, discount: 20, qty: 85, sold: 120,
    colors: "Đen RGB",
    storage: "Cảm biến 25.600 DPI",
    desc: `HUYỀN THOẠI CHUỘT CHƠI GAME BÁN CHẠY NHẤT THẾ GIỚI:\n- Cảm biến HERO 25K độ chính xác cao nhất thế giới không làm mượt hay gia tốc.\n- 11 nút có thể lập trình macro và lưu cấu hình trực tiếp vào bộ nhớ chuột.\n- Kèm 5 tạ kim loại 3.6g có thể tùy biến trọng lượng và điểm cân bằng tay cầm.`,
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Tai nghe không dây Gaming Logitech G435 Lightspeed",
    cat_id: 4, brand_id: 7, price: 1390000, discount: 15, qty: 60, sold: 78,
    colors: "Xanh Dương Vàng, Trắng Tím, Đen Vàng Neon",
    storage: "Trọng lượng 165g",
    desc: `TAI NGHE KHÔNG DÂY SIÊU NHẸ 165G:\n- Trọng lượng nhẹ bậc nhất thị trường không gây áp lực lên đầu khi đeo cả ngày.\n- Kết nối Lightspeed không độ trễ cho game thủ và Bluetooth cho điện thoại.\n- Micro tạo chùm tia kép giảm tiếng ồn xung quanh không cần cần gạt micro vướng víu.`,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ]
  },

  // --- MARSHALL (brand_id: 6) ---
  {
    name: "Loa Bluetooth Marshall Willen Mini",
    cat_id: 4, brand_id: 6, price: 2490000, discount: 10, qty: 50, sold: 52,
    colors: "Đen Viền Vàng Đồng, Kem Cream",
    storage: "IP67 Pin 15h",
    desc: `CHIẾC LOA MARSHALL NHỎ GỌN BỎ TÚI ĐÁNG SỞ HỮU:\n- Thiết kế đậm chất Rock n Roll cổ điển với logo Marshall mạ vàng sang trọng.\n- Dây đeo cao su đa năng phía sau dễ dàng buộc vào ghi đông xe đạp hay balo du lịch.\n- Tiêu chuẩn chống bụi nước chuẩn IP67, pin bền bỉ 15 giờ liên tục.`,
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Loa Bluetooth Marshall Acton III Stereo",
    cat_id: 4, brand_id: 6, price: 6490000, discount: 10, qty: 35, sold: 36,
    colors: "Đen Cổ Điển, Kem Vintage, Nâu Đất",
    storage: "Công suất 60W",
    desc: `ÂM VANG SỐNG ĐỘNG CHO CĂN PHÒNG CỦA BẠN:\n- Âm trường stereo rộng hơn phiên bản tiền nhiệm, âm thanh tràn ngập không gian.\n- Cụm nút kim loại vặn cơ học chỉnh Bass, Treble và Volume hoài cổ đầy cảm xúc.\n- Kết nối Bluetooth 5.2 thế hệ mới sẵn sàng cho công nghệ Bluetooth LE Audio.`,
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    name: "Tai nghe chụp tai Marshall Major IV Wireless",
    cat_id: 4, brand_id: 6, price: 3290000, discount: 12, qty: 60, sold: 68,
    colors: "Nâu Da Bò, Đen Nhám",
    storage: "Pin trâu 80 giờ",
    desc: `HUYỀN THOẠI TAI NGHE VỚI THỜI LƯỢNG PIN KỶ LỤC 80 GIỜ:\n- Driver dynamic 40mm được tinh chỉnh cho âm bass gầm vang và âm mid mượt mà.\n- Thời lượng pin kinh ngạc hơn 80 giờ, hỗ trợ sạc không dây chuẩn Qi tiện lợi.\n- Núm điều khiển đa hướng Control Knob bằng đồng thau điều hướng nhạc trực quan.`,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ]
  }
];

// Sinh câu lệnh SQL
let sql = `SET NAMES utf8mb4;\n`;

products.forEach(p => {
  const escName = p.name.replace(/'/g, "''");
  const escDesc = p.desc.replace(/'/g, "''");
  const escColors = p.colors.replace(/'/g, "''");
  const escStorage = p.storage.replace(/'/g, "''");

  sql += `
INSERT INTO products (name, category_id, brand_id, price, discount_percent, quantity, sold_quantity, colors, storage_options, description, created_at)
VALUES ('${escName}', ${p.cat_id}, ${p.brand_id}, ${p.price}, ${p.discount}, ${p.qty}, ${p.sold}, '${escColors}', '${escStorage}', '${escDesc}', NOW());
SET @last_pid = LAST_INSERT_ID();
`;

  // Thêm ảnh phụ
  p.images.forEach(img => {
    sql += `INSERT INTO product_images (product_id, image_url) VALUES (@last_pid, '${img}');\n`;
  });
});

fs.writeFileSync('scripts/insert_products_generated.sql', sql, 'utf8');
console.log(`Đã tạo file SQL chứa ${products.length} sản phẩm thành công!`);
