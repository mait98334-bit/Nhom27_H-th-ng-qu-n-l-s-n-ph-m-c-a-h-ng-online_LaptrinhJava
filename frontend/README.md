# Hướng dẫn Khởi chạy Dự án E-Commerce (Backend + Frontend)

## 1. Cấu trúc thư mục dự án
```text
D:\LTJAVA\
├── demo1\                  # Thư mục Backend Spring Boot
│   ├── src\
│   ├── pom.xml
│   └── ...
└── frontend\               # Thư mục Frontend độc lập (HTML, CSS, Fetch JS)
    ├── css\
    │   └── style.css       # Giao diện responsive, hiện đại
    ├── js\
    │   ├── config.js       # Cấu hình API, Auth State & Utilities
    │   ├── index.js        # Logic tải Category, Sản phẩm, Tìm kiếm
    │   ├── login.js        # Logic Đăng nhập (Google OAuth2 + Form Auth)
    │   └── product-detail.js # Logic Gallery ảnh ProductImage & Đánh giá Review
    ├── index.html          # Trang chủ: Danh mục, Tìm kiếm, Lưới sản phẩm
    ├── login.html          # Trang đăng nhập: Google OAuth2 & Form Login
    └── product-detail.html # Trang chi tiết sản phẩm & Form Review
```

---

## 2. Cách chạy Backend (Spring Boot)
1. Mở terminal tại thư mục `d:\LTJAVA\demo1`:
   ```bash
   cd d:\LTJAVA\demo1
   ./mvnw spring-boot:run
   ```
2. Đảm bảo MySQL đang chạy và database `sisi_shop` đã được tạo trên phpMyAdmin / MySQL Workbench:
   ```sql
   CREATE DATABASE IF NOT EXISTS sisi_shop;
   ```
3. Khi khởi động lần đầu, hệ thống sẽ tự động tạo dữ liệu mẫu phong phú:
   - Danh mục: *Điện Thoại & Tablet*, *Laptop & Máy Tính*, *Phụ Kiện Công Nghệ*
   - Sản phẩm: *iPhone 15 Pro Max*, *MacBook Air M3*, *AirPods Pro 2*
   - Thư viện ảnh gallery nhiều ảnh cho mỗi sản phẩm (`ProductImage`)
   - Đánh giá có sao ⭐ và bình luận thực tế (`Review`)
   - Tài khoản mẫu: `customer` / `123456` hoặc `admin` / `admin123`

---

## 3. Cách mở Frontend
Bạn có thể mở Frontend bằng 1 trong 2 cách:
- **Cách 1 (Khuyên dùng)**: Mở thư mục `D:\LTJAVA\frontend` bằng VS Code, nhấp chuột phải vào file `index.html` chọn **Open with Live Server** (chạy tại `http://127.0.0.1:5500` hoặc `http://localhost:5500`).
- **Cách 2**: Nhấp đúp chuột trực tiếp vào file `index.html` trong File Explorer để xem trong trình duyệt.

---

## 4. Cấu hình Google OAuth2 Client
Trong file `src/main/resources/application.properties`, bạn có thể thay thế `client-id` và `client-secret` bằng thông tin từ Google Cloud Console của bạn:
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```
*Ghi chú: Khi tạo OAuth2 trên Google Cloud Console, đặt Authorized redirect URI là:*
`http://localhost:8080/login/oauth2/code/google`
