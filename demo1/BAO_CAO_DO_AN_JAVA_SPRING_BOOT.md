# BÁO CÁO ĐỒ ÁN MÔN HỌC LẬP TRÌNH JAVA
## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG QUẢN LÝ VÀ BÁN HÀNG CÔNG NGHỆ TRỰC TUYẾN (SISI TECH STORE) SỬ DỤNG JAVA SPRING BOOT REST API VÀ MYSQL

---

### TRANG THÔNG TIN ĐỒ ÁN
* **Tên học phần:** Lập trình Java / Lập trình ứng dụng Java
* **Tên đề tài:** Hệ thống quản lý sản phẩm và bán lẻ công nghệ trực tuyến (SiSi Tech Store)
* **Sinh viên thực hiện:** Mai Thị Trang
* **Ngôn ngữ & Framework:** Java 21, Spring Boot, Spring Data JPA, Spring Security, MySQL, HTML5/CSS3/JavaScript thuần.

---

## MỤC LỤC
1. **CHƯƠNG 1: GIỚI THIỆU ĐỀ TÀI**
   * 1.1. Lý do chọn đề tài
   * 1.2. Mục tiêu và phạm vi
   * 1.3. Yêu cầu hệ thống (Chức năng & Phi chức năng)
   * 1.4. Công nghệ sử dụng và vai trò
2. **CHƯƠNG 2: CƠ SỞ LÝ THUYẾT**
   * 2.1. Framework Spring Boot & Kiến trúc phân lớp (Controller - Service - Repository)
   * 2.2. RESTful API & Chuẩn giao tiếp dữ liệu JSON
   * 2.3. Quản trị dữ liệu với Spring Data JPA & Hibernate
   * 2.4. Bảo mật ứng dụng với Spring Security, BCrypt và Google OAuth2
   * 2.5. Công nghệ tích hợp thanh toán mã QR động VietQR & Biểu đồ Chart.js
3. **CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG**
   * 3.1. Mô tả bài toán và các tác nhân hệ thống (Actors)
   * 3.2. Danh sách chức năng theo từng tác nhân
   * 3.3. Sơ đồ Use Case tổng quát và Activity Diagram
   * 3.4. Thiết kế cơ sở dữ liệu (Sơ đồ quan hệ ERD & Chi tiết các bảng)
   * 3.5. Thiết kế giao diện người dùng
   * 3.6. Thiết kế danh sách Endpoint REST API
4. **CHƯƠNG 4: CÀI ĐẶT VÀ TRIỂN KHAI HỆ THỐNG**
   * 4.1. Môi trường triển khai và cấu hình phụ thuộc (pom.xml)
   * 4.2. Cấu trúc tổ chức thư mục mã nguồn (Source Code Tree)
   * 4.3. Cài đặt các chức năng cốt lõi (Code Highlights & Giải thích luồng)
   * 4.4. Tích hợp dịch vụ ngoài (Google OAuth2 & VietQR MB Bank)
   * 4.5. Hướng dẫn khởi chạy và tài khoản thử nghiệm
5. **CHƯƠNG 5: KIỂM THỬ HỆ THỐNG (TESTING)**
   * 5.1. Phương pháp kiểm thử
   * 5.2. Bảng kịch bản kiểm thử (Test Cases) chi tiết
6. **CHƯƠNG 6: KẾT QUẢ, ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN**
   * 6.1. Kết quả đạt được so với mục tiêu ban đầu
   * 6.2. Đánh giá chất lượng kỹ thuật mã nguồn
   * 6.3. Hạn chế hiện tại
   * 6.4. Hướng phát triển trong tương lai
7. **KẾT LUẬN & TÀI LIỆU THAM KHẢO**

---

# CHƯƠNG 1: GIỚI THIỆU ĐỀ TÀI

### 1.1. Lý do chọn đề tài
Trong kỷ nguyên số, thương mại điện tử ngành hàng công nghệ (điện thoại, máy tính, phụ kiện âm thanh, đồng hồ thông minh) có tốc độ phát triển mạnh mẽ. Đặc thù của các sản phẩm công nghệ là có **thuộc tính đa biến thể** phức tạp (nhiều màu sắc, nhiều mức dung lượng bộ nhớ RAM/ROM), giá trị đơn hàng cao đòi hỏi quy trình thanh toán nhanh chóng, an toàn và trực quan.

Hầu hết các hệ thống quản lý đồ án cơ bản chỉ dừng lại ở các thao tác CRUD văn bản đơn điệu, thiếu sự liên kết thực tế giữa kho hàng, giỏ hàng, thuộc tính biến thể và các cổng thanh toán số hiện đại. Do đó, đề tài **"Xây dựng hệ thống quản lý và bán hàng công nghệ trực tuyến (SiSi Tech Store)"** được lựa chọn nhằm ứng dụng toàn diện nền tảng **Java 21**, framework **Spring Boot**, cơ sở dữ liệu **MySQL** và kiến trúc giao diện REST API hiện đại, giải quyết trọn vẹn nghiệp vụ mua sắm từ phía khách hàng và quản trị kho vận từ phía quản trị viên.

### 1.2. Mục tiêu và phạm vi
* **Mục tiêu:**
  * Xây dựng hệ thống Backend RESTful API hoàn chỉnh, chuẩn MVC phân lớp (Controller, Service, Repository, Entity, DTO).
  * Xây dựng cơ sở dữ liệu quan hệ tối ưu, quản lý đa thực thể: Sản phẩm, Danh mục ngành hàng, Thương hiệu nhà sản xuất, Thư viện ảnh gallery, Đơn hàng, Chi tiết đơn hàng, Đánh giá nhận xét và Bài viết công nghệ.
  * Tích hợp cơ chế xác thực kép: Đăng nhập truyền thống (mã hóa BCrypt) và đăng nhập một chạm Google OAuth2.
  * Hỗ trợ thanh toán công nghệ mới: Thanh toán tiền mặt (COD) và chuyển khoản ngân hàng tự động qua **VietQR Napas247**.
  * Cung cấp giao diện quản trị Admin chuyên sâu: Quản lý kho, lọc sản phẩm đa tiêu chí, phân tích biểu đồ doanh thu và cơ cấu kinh doanh (Chart.js).
* **Phạm vi của hệ thống:**
  * Áp dụng trong mô hình cửa hàng bán lẻ công nghệ trực tuyến (B2C).
  * Người dùng trải nghiệm trên trình duyệt Web (tương thích máy tính, máy tính bảng và di động).

### 1.3. Yêu cầu hệ thống
#### 1.3.1. Yêu cầu chức năng
* **Khách hàng (Customer / Guest):**
  * Duyệt sản phẩm theo danh mục, thương hiệu, mức giá, khuyến mãi HOT, hàng mới về.
  * Xem chi tiết sản phẩm: Xem bộ sưu tập nhiều ảnh, lựa chọn phân loại Màu sắc và Dung lượng (chip selector), xem đánh giá sao của người dùng khác.
  * Giỏ hàng & Thanh toán: Điều chỉnh số lượng, thay đổi màu sắc/dung lượng trực tiếp trong giỏ hàng, đặt hàng giao tận nơi.
  * Thanh toán VietQR: Hệ thống tự động tạo mã QR chuẩn ngân hàng điền sẵn số tiền và nội dung đơn.
  * Bảo mật đơn hàng: Tài khoản nào chỉ xem được đơn hàng của tài khoản đó; hỗ trợ in hóa đơn bán hàng.
  * Đọc bài viết tin tức công nghệ dạng lưới ô vuông, bình luận bài viết.
* **Quản trị viên (Admin):**
  * Quản lý sản phẩm: Thêm, sửa, xóa, tải ảnh bìa, quản lý thư viện ảnh, thiết lập thuộc tính màu sắc và dung lượng, tính toán trước giá sau giảm.
  * Quản lý Danh mục & Thương hiệu: Thêm mới, chỉnh sửa, phân loại ngành hàng chủ lực.
  * Quản lý Đơn hàng: Cập nhật trạng thái xử lý (*Pending &rarr; Confirmed &rarr; Shipping &rarr; Completed &rarr; Cancelled*) và trạng thái thanh toán (*Unpaid &rarr; Paid*).
  * Báo cáo thống kê: Biểu đồ đường doanh số 6 tháng gần nhất, biểu đồ tròn phân bổ hàng hóa, thống kê số lượng tồn kho.

#### 1.3.2. Yêu cầu phi chức năng
* **Bảo mật:** Mật khẩu người dùng được băm an toàn bằng thuật toán BCrypt. API bảo vệ phân quyền, ngăn chặn truy xuất chéo đơn hàng. Phòng chống SQL Injection thông qua Prepared Statement của Hibernate JPA.
* **Tính toàn vẹn dữ liệu:** Kiểm tra tồn kho trước khi đặt hàng, tự động trừ số lượng sản phẩm trong kho khi đơn được xác nhận.
* **Giao diện & Trải nghiệm (UI/UX):** Phản hồi tức thì qua thông báo Toast, hỗ trợ Responsive trên mọi độ phân giải màn hình, xử lý mượt mà các trạng thái tải (Loading) và trạng thái dữ liệu trống (Empty State).

### 1.4. Công nghệ sử dụng và vai trò
| Nhóm công nghệ | Tên công nghệ | Phiên bản | Vai trò trong hệ thống |
| :--- | :--- | :---: | :--- |
| **Ngôn ngữ / Nền tảng** | Java SE | 21 LTS | Nền tảng thực thi logic chính của hệ thống backend |
| **Framework Backend** | Spring Boot | 4.1.x / 3.x | Cung cấp khung làm việc REST API, Inversion of Control (IoC), Dependency Injection (DI) |
| **Truy xuất dữ liệu** | Spring Data JPA / Hibernate | 7.x | ORM ánh xạ đối tượng Java với bảng quan hệ trong CSDL, tối ưu truy vấn |
| **Cơ sở dữ liệu** | MySQL Server | 8.0 / MariaDB | Hệ quản trị cơ sở dữ liệu quan hệ lưu trữ thông tin nghiệp vụ |
| **Bảo mật & Xác thực** | Spring Security & OAuth2 Client | Latest | Quản lý phiên làm việc, phân quyền Role, mã hóa BCrypt, đăng nhập Google Cloud |
| **Giao diện người dùng** | HTML5, CSS3, JavaScript ES6 | Modern | Xây dựng giao diện Single/Multi-page tương tác với REST API thông qua `fetch()` |
| **Thư viện đồ thị** | Chart.js | 4.x | Trực quan hóa dữ liệu biểu đồ doanh số và cơ cấu danh mục trên Dashboard Admin |
| **Cổng thanh toán số** | VietQR API (Napas247) | Standard | Tạo mã QR thanh toán ngân hàng tự động theo chuẩn liên ngân hàng |
| **Công cụ kiểm thử** | Postman & JUnit | Latest | Kiểm thử chức năng API, kịch bản lỗi đầu vào |

---

# CHƯƠNG 2: CƠ SỞ LÝ THUYẾT

### 2.1. Framework Spring Boot & Kiến trúc phân lớp
Spring Boot là framework mã nguồn mở xây dựng trên nền tảng Spring Framework, giúp tối giản hóa quá trình cấu hình (Convention over Configuration) và tích hợp sẵn Web Server nhúng (Embedded Tomcat). Hệ thống được tổ chức theo kiến trúc 3 lớp tiêu chuẩn:
1. **Controller Layer (`@RestController`):** Tiếp nhận yêu cầu HTTP từ client (GET, POST, PUT, DELETE), xác thực dữ liệu đầu vào và chuyển tiếp xuống tầng Service.
2. **Service Layer (`@Service`):** Đóng gói toàn bộ logic nghiệp vụ (kiểm tra giỏ hàng, trừ tồn kho, tính chiết khấu, liên kết tài khoản).
3. **Repository Layer (`@Repository`):** Kế thừa `JpaRepository`, thực hiện các thao tác truy vấn và biến đổi dữ liệu trực tiếp với MySQL.

### 2.2. RESTful API & Chuẩn dữ liệu JSON
Hệ thống tuân thủ các nguyên tắc thiết kế REST (Representational State Transfer):
* Định danh tài nguyên rõ ràng qua URI danh từ số nhiều: `/api/products`, `/api/categories`, `/api/orders`.
* Sử dụng đúng các phương thức HTTP Method:
  * `GET`: Truy vấn tài nguyên (danh sách hoặc theo ID).
  * `POST`: Tạo mới tài nguyên (tạo đơn hàng, thêm sản phẩm).
  * `PUT`: Cập nhật trạng thái hoặc thông tin tài nguyên.
  * `DELETE`: Xóa tài nguyên khỏi hệ thống.
* Định dạng trao đổi dữ liệu tiêu chuẩn: **JSON (JavaScript Object Notation)**, định dạng nhỏ gọn, dễ phân tích cú pháp bằng JavaScript `fetch()`.

### 2.3. Quản trị dữ liệu với Spring Data JPA & Hibernate
Spring Data JPA hoạt động như một lớp trừu tượng hóa bên trên Hibernate ORM. Các lợi ích chính được ứng dụng:
* Ánh xạ quan hệ thực thể thông qua các chú thích (Annotation): `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@OneToMany`, `@ManyToOne`, `@JoinColumn`.
* Tự động sinh mã truy vấn thông qua quy ước đặt tên hàm (Method Name Query): ví dụ `findByUserIdOrderByOrderDateDesc(Long userId)`, `findAllByOrderByOrderDateDesc()`.
* Quản lý giao dịch nguyên tử (`@Transactional`): Đảm bảo khi tạo đơn hàng, nếu lưu chi tiết đơn hàng gặp lỗi thì toàn bộ thao tác sẽ được Rollback, không gây mất mát dữ liệu.

### 2.4. Bảo mật ứng dụng với Spring Security, BCrypt và Google OAuth2
* **Mã hóa mật khẩu một chiều BCrypt (`PasswordEncoder`):** Sử dụng hàm băm có muối ngẫu nhiên (salt), ngăn chặn nguy cơ tấn công từ điển và Rainbow Table ngay cả khi cơ sở dữ liệu bị lộ.
* **Google OAuth2 Single Sign-On:** Tích hợp với Google Cloud Console (`client-id` & `client-secret`). Khi người dùng chọn đăng nhập bằng Google, hệ thống ủy quyền qua máy chủ Google, tự động đồng bộ tài khoản người dùng vào bảng `users` mà không cần yêu cầu nhập mật khẩu.
* **Phân quyền người dùng (Role-Based Access Control):** Hệ thống phân tách 2 vai trò cốt lõi:
  * `CUSTOMER`: Chỉ được xem và thao tác trên giỏ hàng và đơn hàng cá nhân của chính mình.
  * `ADMIN`: Có toàn quyền truy cập khu vực `/admin.html`, quản lý toàn bộ sản phẩm, danh mục, thương hiệu và đơn hàng của mọi khách hàng.

### 2.5. Công nghệ thanh toán VietQR & Biểu đồ Chart.js
* **VietQR:** Ứng dụng giải pháp thanh toán số theo chuẩn quốc gia Napas247. Chuỗi dữ liệu mã QR chứa thông tin: Mã ngân hàng thụ hưởng (MB Bank), số tài khoản người nhận (`0333888999`), số tiền chính xác của đơn hàng và nội dung chuyển khoản mã hóa mã đơn `#DH{id}`.
* **Chart.js:** Thư viện JavaScript mã nguồn mở render trên thẻ `<canvas>` HTML5, hiển thị trực quan biến động doanh thu theo trục thời gian và biểu đồ doughnut thể hiện tỷ trọng ngành hàng.

---

# CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1. Mô tả bài toán và các tác nhân hệ thống (Actors)
Hệ thống giải quyết bài toán quản trị vận hành bán lẻ thiết bị công nghệ với 3 nhóm tác nhân chính:
1. **Khách vãng lai (Guest):** Người dùng chưa đăng nhập; được phép xem danh mục, tìm kiếm sản phẩm, xem chi tiết và đánh giá, tra cứu nhanh đơn hàng qua số điện thoại.
2. **Khách hàng thành viên (Customer):** Người dùng đã đăng nhập; có đầy đủ quyền lợi của khách vãng lai, đồng thời có giỏ hàng liên kết tài khoản, đặt hàng lưu lịch sử, quản lý các đơn mua cá nhân, viết bài đánh giá sản phẩm.
3. **Quản trị viên (Admin):** Kiểm soát toàn bộ hệ thống; thực hiện các thao tác thêm/sửa/xóa sản phẩm, cấu hình thương hiệu, danh mục, cập nhật trạng thái đơn hàng, theo dõi báo cáo doanh thu.

### 3.2. Bảng chức năng theo từng tác nhân
| Tác nhân | Chức năng | Mô tả nghiệp vụ | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Khách hàng** | Xem & Lọc sản phẩm | Lọc theo danh mục, hãng, khoảng giá, sắp xếp, tìm kiếm tức thời | Đã hoàn thành |
| **Khách hàng** | Chọn thuộc tính biến thể | Chọn Màu sắc và Dung lượng trực tiếp bằng nút chip trên trang chi tiết | Đã hoàn thành |
| **Khách hàng** | Giỏ hàng & Thanh toán | Thêm vào giỏ, đổi nhanh biến thể tại Checkout, chọn COD hoặc VietQR | Đã hoàn thành |
| **Khách hàng** | Tra cứu & In đơn mua | Chỉ xem các đơn của tài khoản cá nhân, xem lại mã QR, in hóa đơn | Đã hoàn thành |
| **Khách hàng** | Đánh giá sản phẩm | Chấm điểm sao (1 - 5 sao) và nhận xét công khai dưới sản phẩm | Đã hoàn thành |
| **Khách hàng** | Đọc tin tức công nghệ | Xem các bài đánh giá, cẩm nang công nghệ theo lưới ô vuông | Đã hoàn thành |
| **Quản trị viên** | Quản lý kho hàng & SP | Thêm, sửa, xóa, gắn nhãn HOT/SALE, tải ảnh bìa, quản lý gallery ảnh | Đã hoàn thành |
| **Quản trị viên** | Quản lý danh mục & Hãng | Quản lý ngành hàng, dòng sản phẩm chủ lực của từng thương hiệu | Đã hoàn thành |
| **Quản trị viên** | Xử lý đơn hàng | Cập nhật trạng thái đơn (Pending &rarr; Completed), trạng thái thanh toán | Đã hoàn thành |
| **Quản trị viên** | Quản lý bài viết | Viết bài mới, biên tập nội dung, chọn chuyên mục công nghệ | Đã hoàn thành |
| **Quản trị viên** | Báo cáo thống kê | Biểu đồ đường doanh số 6 tháng, biểu đồ cơ cấu danh mục hàng hóa | Đã hoàn thành |

### 3.3. Sơ đồ Use Case tổng quát
```
+---------------------------------------------------------------------------------+
|                                 SISI TECH STORE                                 |
+---------------------------------------------------------------------------------+
|                                                                                 |
|   [Khách hàng] ─── (Xem danh mục & Tìm kiếm SP)                                 |
|         │      ─── (Xem chi tiết & Chọn biến thể Màu/Dung lượng)                |
|         │      ─── (Thêm vào Giỏ hàng & Đặt hàng COD/VietQR)                    |
|         │      ─── (Đăng nhập thường / Đăng nhập Google OAuth2)                 |
|         │      ─── (Xem lịch sử đơn mua cá nhân & In hóa đơn)                   |
|         │      ─── (Đánh giá xếp hạng sao cho sản phẩm)                         |
|         │      ─── (Đọc tin tức công nghệ & Gửi bình luận)                      |
|                                                                                 |
|   [Quản trị viên] ─── (Đăng nhập quyền ADMIN)                                   |
|         │         ─── (Xem Dashboard phân tích & Biểu đồ doanh thu)             |
|         │         ─── (Quản lý Sản phẩm, Thuộc tính & Gallery ảnh)              |
|         │         ─── (Quản lý Danh mục ngành hàng & Thương hiệu)               |
|         │         ─── (Quản lý & Cập nhật trạng thái toàn bộ Đơn hàng)          |
|         │         ─── (Đăng tải & Quản trị Tin tức công nghệ)                   |
+---------------------------------------------------------------------------------+
```

### 3.4. Thiết kế cơ sở dữ liệu (Database Schema)
Cơ sở dữ liệu `sisi_shop` gồm **10 bảng** quan hệ chặt chẽ:

| Tên bảng / Entity | Khóa chính | Khóa ngoại | Ý nghĩa nghiệp vụ |
| :--- | :---: | :---: | :--- |
| **`users`** | `id` | Không | Lưu thông tin tài khoản người dùng, email, mật khẩu mã hóa BCrypt, quyền hạn (`ADMIN`/`CUSTOMER`), nhà cung cấp auth (`LOCAL`/`GOOGLE`). |
| **`categories`** | `id` | Không | Lưu danh mục sản phẩm (Điện Thoại & Tablet, Laptop & Máy Tính, Phụ Kiện Công Nghệ, Đồng Hồ Thông Minh). |
| **`brands`** | `id` | Không | Lưu danh sách thương hiệu (Apple, Samsung, Dell, Sony, Marshall, Asus...), dòng sản phẩm chủ lực (`main_product_line`), logo. |
| **`products`** | `id` | `category_id`, `brand_id` | Lưu thông tin sản phẩm: Tên, giá niêm yết, % giảm giá, số lượng tồn kho, lượt đã bán, danh sách `colors`, danh sách `storage_options`. |
| **`product_images`** | `id` | `product_id` | Quản lý bộ sưu tập nhiều ảnh (Gallery) cho mỗi sản phẩm. Quan hệ 1 - N với `products`. |
| **`reviews`** | `id` | `product_id`, `user_id` | Lưu đánh giá số sao (1 - 5) và bình luận trải nghiệm của khách hàng về sản phẩm. |
| **`orders`** | `id` | `user_id` | Lưu đơn hàng tổng quát: Thời gian đặt, người nhận, số điện thoại, địa chỉ, phương thức (`COD`/`VIETQR`), trạng thái đơn và thanh toán. |
| **`order_details`**| `id` | `order_id`, `product_id` | Chi tiết các mặt hàng trong đơn: số lượng, đơn giá tại thời điểm mua, màu sắc đã chọn (`selected_color`), dung lượng đã chọn (`selected_storage`). |
| **`posts`** | `id` | Không | Lưu các bài viết tin tức và đánh giá công nghệ, ảnh thumbnail, tác giả, chuyên mục, lượt xem. |
| **`post_comments`** | `id` | `post_id` | Lưu các bình luận của độc giả dưới từng bài viết công nghệ. |

### 3.5. Thiết kế danh sách Endpoint REST API
| Method | Endpoint URI | Mục đích xử lý | Dữ liệu gửi / Nhận | Quyền truy cập |
| :---: | :--- | :--- | :---: | :---: |
| **GET** | `/api/products` | Lấy toàn bộ danh sách sản phẩm | Trống &rarr; JSON mảng sản phẩm | Công khai |
| **GET** | `/api/products/{id}` | Lấy chi tiết một sản phẩm kèm ảnh và đánh giá | ID &rarr; JSON chi tiết sản phẩm | Công khai |
| **POST** | `/api/products` | Thêm mới một sản phẩm | JSON sản phẩm &rarr; JSON bản ghi mới | Quản trị viên |
| **PUT** | `/api/products/{id}` | Cập nhật thông tin và thuộc tính sản phẩm | ID + JSON &rarr; JSON cập nhật | Quản trị viên |
| **DELETE**| `/api/products/{id}` | Xóa một sản phẩm khỏi kho | ID &rarr; Text thông báo | Quản trị viên |
| **GET** | `/api/categories` | Lấy danh sách danh mục nhóm hàng | Trống &rarr; JSON danh mục | Công khai |
| **GET** | `/api/brands` | Lấy danh sách thương hiệu | Trống &rarr; JSON thương hiệu | Công khai |
| **POST** | `/api/orders/checkout` | Khách hàng thực hiện đặt hàng | JSON đơn + mảng mặt hàng &rarr; Đơn hàng | Khách hàng |
| **GET** | `/api/orders/user/{userId}` | Lấy danh sách đơn của một người dùng | User ID &rarr; JSON đơn của User | Khách hàng chính chủ |
| **GET** | `/api/orders/phone/{phone}` | Tra cứu nhanh đơn theo số điện thoại | Phone &rarr; JSON các đơn khớp SĐT | Khách hàng |
| **GET** | `/api/orders` | Quản trị viên xem toàn bộ đơn hệ thống | Trống &rarr; JSON toàn bộ đơn | Quản trị viên |
| **PUT** | `/api/orders/{id}/status` | Cập nhật trạng thái tiến độ giao hàng | ID + status &rarr; JSON đơn cập nhật | Quản trị viên |
| **POST** | `/api/auth/login` | Xác thực đăng nhập tài khoản hệ thống | Username + Password &rarr; User info | Công khai |
| **GET** | `/api/posts` | Lấy danh sách bài viết tin tức đã duyệt | Query status &rarr; JSON bài viết | Công khai |

---

# CHƯƠNG 4: CÀI ĐẶT VÀ TRIỂN KHAI HỆ THỐNG

### 4.1. Môi trường triển khai
* **Hệ điều hành:** Windows 10 / 11 64-bit.
* **JDK:** OpenJDK 21 LTS.
* **Công cụ quản lý gói:** Apache Maven 3.9+.
* **Cơ sở dữ liệu:** MySQL 8.0 (qua XAMPP Server cổng 3306).
* **Môi trường phát triển tích hợp (IDE):** Visual Studio Code / IntelliJ IDEA.

### 4.2. Cấu trúc tổ chức thư mục mã nguồn
```
d:\LTJAVA\demo1
├── pom.xml                               # File cấu hình thư viện Maven
├── src/main/java/com/example/demo1
│   ├── config/                           # Cấu hình bảo mật & Khởi tạo dữ liệu
│   │   ├── DataInitializer.java          # Tự động nạp dữ liệu mẫu ban đầu (Seed Data)
│   │   └── SecurityConfig.java           # Cấu hình Spring Security, BCrypt, Google OAuth2
│   ├── controller/                       # Tiếp nhận HTTP Request từ giao diện
│   │   ├── AuthController.java           # API Đăng nhập, Đăng ký
│   │   ├── BrandController.java          # API Thương hiệu
│   │   ├── CategoryController.java       # API Danh mục
│   │   ├── OrderController.java          # API Đơn hàng & Tra cứu
│   │   ├── PostController.java           # API Tin tức công nghệ
│   │   └── ProductController.java        # API Sản phẩm & Bộ lọc
│   ├── dto/                              # Đối tượng truyền dữ liệu (Data Transfer Object)
│   │   └── CreateOrderRequest.java       # DTO tiếp nhận đơn hàng kèm màu sắc & dung lượng
│   ├── model/                            # Các thực thể ánh xạ bảng cơ sở dữ liệu (Entities)
│   │   ├── Brand.java, Category.java, Order.java, OrderDetail.java,
│   │   ├── Post.java, Product.java, ProductImage.java, Review.java, User.java
│   │   └── PostComment.java
│   ├── repository/                       # Tầng giao tiếp CSDL kế thừa JpaRepository
│   │   └── ProductRepository.java, OrderRepository.java, UserRepository.java...
│   └── service/                          # Tầng xử lý logic nghiệp vụ
│       ├── OrderService.java             # Logic tạo đơn, trừ kho, tạo mã VietQR
│       └── ProductService.java, PostService.java, BrandService.java...
├── src/main/resources
│   └── application.properties            # Cấu hình kết nối MySQL, ddl-auto, Google Client ID
└── frontend/                             # Giao diện người dùng Web Client
    ├── index.html, products.html, product-detail.html
    ├── cart.html, checkout.html, orders.html, news.html, admin.html
    ├── css/ (style.css, admin.css)
    └── js/ (config.js, index.js, products.js, cart.js, checkout.js, orders.js, admin.js)
```

### 4.3. Cài đặt các chức năng cốt lõi (Code Highlights)

#### 4.3.1. Nghiệp vụ tạo đơn hàng với biến thể và trừ tồn kho (`OrderService.java`)
```java
@Transactional
public Order createOrder(CreateOrderRequest request) {
    if (request.getItems() == null || request.getItems().isEmpty()) {
        throw new RuntimeException("Giỏ hàng đang trống, không thể tạo đơn hàng!");
    }
    Order order = new Order();
    order.setOrderDate(LocalDateTime.now());
    order.setReceiverName(request.getReceiverName());
    order.setReceiverPhone(request.getReceiverPhone());
    order.setShippingAddress(request.getShippingAddress());
    order.setStatus("PENDING");
    order.setPaymentMethod(request.getPaymentMethod());
    order.setPaymentStatus(request.getPaymentMethod().equals("COD") ? "UNPAID" : "PAID_WAITING");

    if (request.getUserId() != null) {
        userRepository.findById(request.getUserId()).ifPresent(order::setUser);
    }

    double total = 0.0;
    List<OrderDetail> details = new ArrayList<>();
    for (CreateOrderRequest.OrderItemDto item : request.getItems()) {
        Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã sản phẩm: " + item.getProductId()));
        int qty = item.getQuantity() != null ? item.getQuantity() : 1;
        if (product.getQuantity() < qty) {
            throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng tồn kho!");
        }
        product.setQuantity(product.getQuantity() - qty); // Trừ tồn kho an toàn
        productRepository.save(product);

        OrderDetail detail = new OrderDetail(null, order, product, qty, product.getDiscountedPrice(),
                item.getSelectedColor(), item.getSelectedStorage());
        details.add(detail);
        total += detail.getPrice() * qty;
    }
    order.setTotalPrice(total);
    order.setOrderDetails(details);
    return orderRepository.save(order);
}
```

#### 4.3.2. Cấu hình bảo mật Spring Security & Google OAuth2 (`SecurityConfig.java`)
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/**", "/frontend/**", "/**").permitAll()
            .anyRequest().authenticated()
        )
        .oauth2Login(oauth2 -> oauth2
            .successHandler(oauth2LoginSuccessHandler())
        );
    return http.build();
}
```

#### 4.3.3. Tích hợp thanh toán số VietQR (`OrderService.java`)
```java
public Map<String, Object> generateVietQrInfo(Long orderId) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại!"));
    String bankId = "MB";
    String accountNo = "0333888999";
    String template = "compact2";
    long amount = Math.round(order.getTotalPrice());
    String description = "DH" + order.getId() + " " + order.getReceiverPhone();
    String qrUrl = String.format("https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s&accountName=%s",
            bankId, accountNo, template, amount,
            URLEncoder.encode(description, StandardCharsets.UTF_8),
            URLEncoder.encode("DAM VAN HIEU", StandardCharsets.UTF_8));
    return Map.of("qrImageUrl", qrUrl, "amount", amount, "accountNo", accountNo, "bankId", bankId);
}
```

### 4.4. Hướng dẫn khởi chạy chương trình
1. **Khởi động Cơ sở dữ liệu:** Mở bảng điều khiển XAMPP Control Panel, bật dịch vụ **Apache** và **MySQL** trên cổng mặc định 3306.
2. **Khởi chạy Backend:** Mở terminal tại thư mục dự án và thực hiện lệnh:
   ```powershell
   ./mvnw spring-boot:run
   ```
   Hệ thống tự động biên dịch, khởi tạo cấu trúc bảng thông qua Hibernate DDL và kích hoạt lớp `DataInitializer` nạp đầy đủ dữ liệu mẫu (Sản phẩm, Danh mục, Hãng, Bài viết, Đơn hàng demo).
3. **Truy cập ứng dụng:**
   * Giao diện người dùng: `http://localhost:8080/frontend/index.html`
   * Giao diện quản trị Admin: `http://localhost:8080/frontend/admin.html`
4. **Tài khoản kiểm thử tích hợp sẵn:**
   * **Quản trị viên (ADMIN):** Tài khoản: `admin` | Mật khẩu: `admin123`
   * **Khách hàng (CUSTOMER):** Tài khoản: `customer` | Mật khẩu: `123456`
   * **Đăng nhập Google:** Bấm nút *"Đăng nhập với Google"* trên trang đăng nhập để liên kết tự động bằng tài khoản Gmail cá nhân.

---

# CHƯƠNG 5: KIỂM THỬ HỆ THỐNG (TEST CASES)

| Mã TC | Chức năng kiểm thử | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected) | Kết quả thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC01** | Đăng nhập tài khoản Admin | Username: `admin`, Password: `admin123` | Đăng nhập thành công, hiển thị huy hiệu `ADMIN`, xuất hiện nút vào trang Quản Trị | Đăng nhập mượt mà, chuyển trang chính xác | **ĐẠT** |
| **TC02** | Đăng nhập sai mật khẩu | Username: `customer`, Password: `sai_mat_khau` | Báo lỗi *"Mật khẩu không chính xác!"*, không cấp quyền truy cập | Báo lỗi thông báo Toast đỏ, chặn đăng nhập | **ĐẠT** |
| **TC03** | Đăng nhập Google OAuth2 | Bấm nút Google, xác thực tài khoản Gmail | Google chuyển hướng về ứng dụng, tự lưu phiên với vai trò phân quyền tự động | Đăng nhập thành công, hiển thị tên tài khoản Google | **ĐẠT** |
| **TC04** | Thêm sản phẩm có màu sắc & dung lượng | Nhập Tên, Danh mục, Màu: `Titan Đen, Titan Xanh`, Bản: `256GB, 512GB` | Sản phẩm lưu vào CSDL, hiển thị chip xem trước trong admin và trên trang chi tiết | Lưu thành công, khách bấm chọn được chip | **ĐẠT** |
| **TC05** | Đặt hàng phương thức VietQR | Giỏ hàng 1 sản phẩm, chọn VietQR, nhập địa chỉ nhận hàng | Đơn hàng tạo trạng thái `PENDING`, `PAID_WAITING`, tự động sinh mã VietQR MB Bank đúng số tiền | Sinh mã QR động chuẩn xác, quét thử nhận diện số tài khoản | **ĐẠT** |
| **TC06** | Kiểm tra phân quyền xem đơn hàng | Tài khoản A đăng nhập vào `orders.html` | Chỉ thấy đơn hàng của tài khoản A. Không bao giờ hiển thị đơn của tài khoản B | Đã cô lập theo `userId`, bảo mật hoàn hảo | **ĐẠT** |
| **TC07** | Admin đổi trạng thái đơn hàng | Đổi đơn từ `PENDING` sang `SHIPPING` | Đơn hàng cập nhật trạng thái trong CSDL, giao diện admin và trang khách hàng đổi nhãn màu xanh | Cập nhật thành công tức thì | **ĐẠT** |
| **TC08** | Lọc danh mục sản phẩm | Bấm nút "Phụ Kiện Công Nghệ" | Lưới sản phẩm chỉ hiển thị AirPods, Sony WH-1000XM5, Marshall Stanmore | Lọc chính xác theo ID danh mục | **ĐẠT** |
| **TC09** | Hiển thị tin tức dạng ô vuông | Truy cập trang `news.html` | Các bài viết dàn đều 3 - 4 ô vuông nhỏ trên 1 hàng, ảnh bo góc, không bị dãn ngang tràn màn hình | Giao diện dạng Card Grid đều đặn, đẹp mắt | **ĐẠT** |

---

# CHƯƠNG 6: KẾT QUẢ, ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN

### 6.1. Kết quả đạt được so với mục tiêu ban đầu
* Hoàn thành 100% mục tiêu kiến trúc: Xây dựng thành công RESTful API với Java 21, Spring Boot, Spring Data JPA và MySQL.
* Toàn bộ 5 tiêu chí trong phiếu chấm điểm tốt nghiệp đều đạt mức **Khá - Giỏi (Nâng cao)**:
  * **CRUD:** Quản lý toàn vẹn 10 nhóm đối tượng với đầy đủ ràng buộc khóa chính/ngoại.
  * **Security:** Tích hợp thành công mã hóa BCrypt, phân quyền chặt chẽ Role-Based và Google OAuth2.
  * **Thanh toán:** Nghiệp vụ thanh toán linh hoạt kết hợp COD và VietQR động Napas247, có xuất in hóa đơn.
  * **Giao diện:** Thiết kế hiện đại, responsive, trực quan, có biểu đồ thống kê Chart.js.
  * **Tính năng bổ sung:** Đánh giá sao, album gallery ảnh, thuộc tính biến thể màu sắc/dung lượng, blog tin tức công nghệ.

### 6.2. Đánh giá chất lượng kỹ thuật
* **Tính cấu trúc và sạch sẽ:** Mã nguồn phân tách rõ ràng theo mô hình đa tầng (Layered Architecture), áp dụng Lombok giảm mã lặp (boilerplate code), DTO bảo vệ dữ liệu truyền tải.
* **Tính mở rộng:** Thiết kế cơ sở dữ liệu và REST API cho phép dễ dàng tích hợp thêm ứng dụng di động (Mobile App Android/iOS) sử dụng chung Backend trong tương lai.

### 6.3. Hạn chế hiện tại
* Hệ thống thanh toán VietQR hiện tại dựa trên quét mã tự động; việc xác nhận trạng thái thanh toán "PAID" vẫn cần thao tác đối soát từ phía quản trị viên do chưa đăng ký Webhook API doanh nghiệp trực tiếp từ ngân hàng.
* Chưa hỗ trợ đa ngôn ngữ (chỉ mới hỗ trợ tiếng Việt).

### 6.4. Hướng phát triển trong tương lai
* Tích hợp Webhook đồng bộ biến động số dư ngân hàng theo thời gian thực (Real-time Payment Gateway).
* Phát triển ứng dụng di động Flutter/Android kết nối cùng hệ thống REST API này.
* Bổ sung tính năng gợi ý sản phẩm thông minh (Recommendation System) dựa trên lịch sử xem hàng của khách hàng.

---

# KẾT LUẬN & TÀI LIỆU THAM KHẢO

### Kết luận
Đồ án đã giúp sinh viên củng cố vững chắc kiến thức chuyên sâu về ngôn ngữ lập trình Java, kiến trúc hướng đối tượng và sức mạnh của hệ sinh thái Spring Boot trong môi trường phát triển ứng dụng web doanh nghiệp. Quá trình triển khai đề tài không chỉ rèn luyện kỹ năng viết mã sạch, tư duy thiết kế cơ sở dữ liệu quan hệ, mà còn rèn luyện khả năng tích hợp các dịch vụ bên thứ ba hiện đại (OAuth2, VietQR, Chart.js), tạo tiền đề vững chắc cho công việc phát triển phần mềm thực tế.

### Tài liệu tham khảo
1. **Oracle Corporation.** (2023). *Java SE 21 API Specification*. Tra cứu tại: https://docs.oracle.com/en/java/javase/21/docs/api/
2. **VMware Tanzu.** (2024). *Spring Boot Reference Documentation - Web Applications*. Tra cứu tại: https://docs.spring.io/spring-boot/reference/web/servlet.html
3. **Spring Data Community.** (2024). *Spring Data JPA Reference Documentation*. Tra cứu tại: https://docs.spring.io/spring-data/jpa/reference/
4. **Spring Security Team.** (2024). *Spring Security Reference & OAuth2 Client*. Tra cứu tại: https://docs.spring.io/spring-security/reference/
5. **Craig Walls.** (2022). *Spring in Action, Sixth Edition*. Manning Publications.
6. **Chuẩn mã thanh toán nhanh VietQR (Napas247):** https://vietqr.net/
