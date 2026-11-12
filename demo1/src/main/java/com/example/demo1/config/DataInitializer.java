package com.example.demo1.config;

import com.example.demo1.model.Brand;
import com.example.demo1.model.Category;
import com.example.demo1.model.Order;
import com.example.demo1.model.OrderDetail;
import com.example.demo1.model.Product;
import com.example.demo1.model.ProductImage;
import com.example.demo1.model.Review;
import com.example.demo1.model.User;
import com.example.demo1.repository.BrandRepository;
import com.example.demo1.repository.CategoryRepository;
import com.example.demo1.repository.ProductImageRepository;
import com.example.demo1.repository.ProductRepository;
import com.example.demo1.repository.ReviewRepository;
import com.example.demo1.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initSampleData(
            CategoryRepository categoryRepo,
            ProductRepository productRepo,
            ProductImageRepository imageRepo,
            ReviewRepository reviewRepo,
            UserRepository userRepo,
            com.example.demo1.repository.OrderRepository orderRepo,
            com.example.demo1.repository.OrderDetailRepository orderDetailRepo,
            com.example.demo1.repository.PostRepository postRepo,
            com.example.demo1.repository.PostCommentRepository postCommentRepo,
            BrandRepository brandRepo,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Khởi tạo tài khoản mẫu nếu chưa có
            User testUser = null;
            if (userRepo.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setFullName("Quản Trị Viên");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepo.save(admin);

                User customer = new User();
                customer.setUsername("customer");
                customer.setFullName("Nguyễn Văn An");
                customer.setEmail("an.nguyen@example.com");
                customer.setPassword(passwordEncoder.encode("123456"));
                customer.setRole("CUSTOMER");
                testUser = userRepo.save(customer);
            } else {
                testUser = userRepo.findAll().get(0);
            }

            // 2. Khởi tạo Danh mục mẫu nếu chưa có
            if (categoryRepo.count() == 0) {
                Category catPhone = new Category("Điện Thoại & Tablet", "Các dòng smartphone và máy tính bảng hàng đầu");
                Category catLaptop = new Category("Laptop & Máy Tính", "Laptop văn phòng, đồ họa, gaming cao cấp");
                Category catAccessory = new Category("Phụ Kiện Công Nghệ", "Tai nghe, cáp sạc, phụ kiện âm thanh");

                catPhone = categoryRepo.save(catPhone);
                catLaptop = categoryRepo.save(catLaptop);
                catAccessory = categoryRepo.save(catAccessory);

                // 3. Khởi tạo Sản phẩm mẫu
                Product p1 = new Product();
                p1.setName("iPhone 15 Pro Max 256GB");
                p1.setDescription("Khung viền Titan chuẩn hàng không vũ trụ siêu nhẹ và bền bỉ. Chip A17 Pro mạnh mẽ vượt trội với GPU 6 lõi, hỗ trợ đồ họa mượt mà chuẩn gaming thế hệ mới. Hệ thống camera tiềm vọng 5x đỉnh cao.");
                p1.setPrice(29990000.0);
                p1.setQuantity(50);
                p1.setCategory(catPhone);
                p1 = productRepo.save(p1);

                Product p2 = new Product();
                p2.setName("MacBook Air 13 inch M3");
                p2.setDescription("Thiết kế siêu mỏng nhẹ chỉ 1.24kg. Chip Apple M3 với CPU 8 nhân và GPU 10 nhân cho tốc độ xử lý đồ họa và AI đáng kinh ngạc. Màn hình Liquid Retina rực rỡ và thời lượng pin lên đến 18 giờ liên tục.");
                p2.setPrice(27490000.0);
                p2.setQuantity(30);
                p2.setCategory(catLaptop);
                p2 = productRepo.save(p2);

                Product p3 = new Product();
                p3.setName("Tai nghe AirPods Pro 2 MagSafe (USB-C)");
                p3.setDescription("Công nghệ chống ồn chủ động (ANC) nâng cấp gấp 2 lần. Âm thanh thích ứng theo môi trường xung quanh, tính năng Nhận biết cuộc trò chuyện tự động giảm âm lượng thông minh.");
                p3.setPrice(5790000.0);
                p3.setQuantity(100);
                p3.setCategory(catAccessory);
                p3 = productRepo.save(p3);

                // 4. Khởi tạo ProductImage cho từng sản phẩm (Gallery nhiều ảnh)
                imageRepo.save(new ProductImage(null, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80", p1));
                imageRepo.save(new ProductImage(null, "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80", p1));
                imageRepo.save(new ProductImage(null, "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80", p1));

                imageRepo.save(new ProductImage(null, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80", p2));
                imageRepo.save(new ProductImage(null, "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80", p2));

                imageRepo.save(new ProductImage(null, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80", p3));
                imageRepo.save(new ProductImage(null, "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&auto=format&fit=crop&q=80", p3));

                // 5. Khởi tạo Review đánh giá mẫu
                if (testUser != null) {
                    reviewRepo.save(new Review(null, 5, "Máy dùng rất mượt mà, khung titan cầm cực kỳ đầm tay và nhẹ hơn nhiều so với đời cũ. Camera zoom 5x chụp nét căng!", LocalDateTime.now().minusDays(3), p1, testUser));
                    reviewRepo.save(new Review(null, 5, "Màu Titan tự nhiên đẹp xuất sắc, pin trâu dùng cả ngày không hết. Rất đáng đồng tiền bát gạo!", LocalDateTime.now().minusDays(1), p1, testUser));

                    reviewRepo.save(new Review(null, 5, "MacBook M3 pin siêu trâu, mở máy là dùng ngay, màn hình đẹp và bàn phím gõ êm ái.", LocalDateTime.now().minusDays(2), p2, testUser));

                    reviewRepo.save(new Review(null, 4, "Chống ồn rất tốt khi đi tàu xe, nghe nhạc acoustic rất chi tiết.", LocalDateTime.now().minusHours(5), p3, testUser));
                }

                // 6. Khởi tạo Đơn hàng mẫu
                if (orderRepo.count() == 0 && testUser != null) {
                    Order o1 = new Order();
                    o1.setOrderDate(LocalDateTime.now().minusDays(1));
                    o1.setUser(testUser);
                    o1.setReceiverName("Nguyễn Văn An");
                    o1.setReceiverPhone("0912345678");
                    o1.setShippingAddress("Số 123 Đường Cầu Giấy, Hà Nội");
                    o1.setStatus("CONFIRMED");
                    o1.setPaymentMethod("VIETQR");
                    o1.setPaymentStatus("PAID");
                    o1.setTotalPrice(29990000.0);
                    o1.setNotes("Giao giờ hành chính giúp mình.");
                    o1 = orderRepo.save(o1);

                    OrderDetail od1 = new OrderDetail(null, 1, 29990000.0, "Titan Tự Nhiên", "256GB", o1, p1);
                    orderDetailRepo.save(od1);

                    Order o2 = new Order();
                    o2.setOrderDate(LocalDateTime.now().minusHours(3));
                    o2.setUser(testUser);
                    o2.setReceiverName("Trần Thị Mai");
                    o2.setReceiverPhone("0987654321");
                    o2.setShippingAddress("Tòa Landmark 81, P.22, Bình Thạnh, TP.HCM");
                    o2.setStatus("PENDING");
                    o2.setPaymentMethod("COD");
                    o2.setPaymentStatus("UNPAID");
                    o2.setTotalPrice(5790000.0);
                    o2.setNotes("Gọi trước khi giao 15 phút.");
                    o2 = orderRepo.save(o2);

                    OrderDetail od2 = new OrderDetail(null, 1, 5790000.0, "Trắng Tuyết", "Tiêu chuẩn MagSafe USB-C", o2, p3);
                    orderDetailRepo.save(od2);
                }
            }

            // 7. Khởi tạo Bài viết & Tin tức công nghệ mẫu nếu chưa có
            if (postRepo.count() == 0) {
                com.example.demo1.model.Post post1 = new com.example.demo1.model.Post();
                post1.setTitle("Trải nghiệm iPhone 16 Pro Max Titan Sa Mạc: Sự khác biệt từ nút Camera Control");
                post1.setCategory("Đánh giá công nghệ");
                post1.setAuthor("Ban biên tập SiSi Tech");
                post1.setSummary("Khung Titan nhẹ hơn, cụm camera tele 5x nâng cấp toàn diện và nút điều khiển camera cảm ứng lực mở ra cách chụp ảnh quay phim chuyên nghiệp mới.");
                post1.setThumbnail("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800");
                post1.setViews(342);
                post1.setStatus("PUBLISHED");
                post1.setContent("""
                    <p class="lead">iPhone 16 Pro Max năm nay đã đánh dấu một bước chuyển mình lớn của Apple trong trải nghiệm nhiếp ảnh di động với việc bổ sung nút vật lý cảm ứng <strong>Camera Control</strong> hoàn toàn mới.</p>
                    
                    <h3>1. Thiết kế viền Titan Sa Mạc sang trọng</h3>
                    <p>Màu Titan Sa Mạc (Desert Titanium) mới mang đến vẻ đẹp vừa tinh tế, vừa huyền bí. Trọng lượng của máy vẫn duy trì sự nhẹ nhàng đáng kinh ngạc nhờ khung sườn hợp kim titan chuẩn hàng không vũ trụ. Viền màn hình cũng được làm mỏng tối đa, mở rộng không gian hiển thị lên 6.9 inch.</p>
                    
                    <h3>2. Sức mạnh vượt bậc từ nút Camera Control</h3>
                    <p>Nút Camera Control nằm ở cạnh phải, cho phép người dùng khởi động nhanh máy ảnh chỉ với một cú nhấn nhẹ. Khi trượt ngón tay trên bề mặt, bạn có thể chuyển đổi mượt mà giữa các chế độ chụp, zoom quang học 5x, điều chỉnh khẩu độ và bộ lọc màu Photographic Styles thế hệ mới.</p>
                    
                    <blockquote>"Camera Control không chỉ là một phím cứng, nó tái định nghĩa lại trải nghiệm nhiếp ảnh chuyên nghiệp ngay trong lòng bàn tay người dùng."</blockquote>
                    
                    <h3>3. Hiệu năng chip A18 Pro và Apple Intelligence</h3>
                    <p>Vi xử lý Apple A18 Pro sản xuất trên tiến trình 3nm thế hệ thứ 2 mang lại hiệu năng đồ họa ray-tracing mượt mà hơn 20%, đồng thời tối ưu hóa thời lượng pin lên đến 33 giờ phát video liên tục.</p>
                    
                    <h3>Kết luận</h3>
                    <p>Nếu bạn đang tìm kiếm một siêu phẩm công nghệ toàn diện từ thiết kế, thời lượng pin cho đến camera đỉnh cao thì iPhone 16 Pro Max xứng đáng là lựa chọn hàng đầu trong năm 2026.</p>
                """);
                post1 = postRepo.save(post1);

                com.example.demo1.model.PostComment c1 = new com.example.demo1.model.PostComment();
                c1.setPost(post1);
                c1.setAuthorName("Hoàng Nam");
                c1.setAuthorEmail("hoangnam@gmail.com");
                c1.setContent("Bài viết phân tích rất chi tiết! Màu Titan Sa Mạc ở ngoài nhìn rất đẹp và nam tính.");
                c1.setStatus("APPROVED");
                postCommentRepo.save(c1);

                com.example.demo1.model.PostComment c2 = new com.example.demo1.model.PostComment();
                c2.setPost(post1);
                c2.setAuthorName("Thùy Linh");
                c2.setAuthorEmail("thuylinh@gmail.com");
                c2.setContent("Nút Camera Control dùng quen rồi thấy cực kỳ tiện, bấm một cái là chụp ngay khoảnh khắc đẹp.");
                c2.setStatus("APPROVED");
                postCommentRepo.save(c2);

                com.example.demo1.model.Post post2 = new com.example.demo1.model.Post();
                post2.setTitle("So sánh MacBook Air M3 và Dell XPS 13 Plus: Cuộc chiến laptop mỏng nhẹ cao cấp");
                post2.setCategory("So sánh công nghệ");
                post2.setAuthor("Chuyên gia phần cứng");
                post2.setSummary("Cả hai đều sở hữu thiết kế tuyệt mỹ, nhưng con chip Apple M3 tối ưu thời lượng pin 18 tiếng còn Dell XPS ghi điểm nhờ màn hình OLED 3.5K tràn viền.");
                post2.setThumbnail("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800");
                post2.setViews(215);
                post2.setStatus("PUBLISHED");
                post2.setContent("""
                    <p class="lead">Phân khúc laptop siêu mỏng nhẹ dưới 1.3kg luôn là cuộc đua khốc liệt giữa Apple và Dell. Hãy cùng đặt lên bàn cân hai đại diện sáng giá nhất: MacBook Air M3 và Dell XPS 13 Plus.</p>
                    
                    <h3>1. Thiết kế và độ hoàn thiện</h3>
                    <p>MacBook Air M3 duy trì thiết kế nhôm nguyên khối liền mạch, bàn phím Magic Keyboard êm ái và trackpad Force Touch xuất sắc nhất thị trường. Trong khi đó, Dell XPS 13 Plus lại gây ấn tượng mạnh với dải phím chức năng cảm ứng LED chìm và touchpad tàng hình phủ kính Gorilla Glass.</p>
                    
                    <h3>2. Trải nghiệm màn hình</h3>
                    <p>Màn hình Liquid Retina 13.6 inch trên MacBook Air cho màu sắc chuẩn xác, độ sáng 500 nits. Tuy nhiên Dell XPS 13 Plus lại nhỉnh hơn về độ tương phản nhờ tấm nền OLED 3.5K đen sâu tuyệt đối, cực kỳ đã mắt khi thưởng thức phim ảnh.</p>
                    
                    <h3>3. Hiệu năng & Thời lượng pin</h3>
                    <p>Chip Apple M3 với khả năng tản nhiệt thụ động không cần quạt vẫn đảm bảo máy luôn mát mẻ và yên tĩnh tuyệt đối. Thời lượng pin của MacBook Air đạt tới 18 tiếng, vượt trội hơn mức 10-12 tiếng của Dell XPS.</p>
                """);
                post2 = postRepo.save(post2);

                com.example.demo1.model.PostComment c3 = new com.example.demo1.model.PostComment();
                c3.setPost(post2);
                c3.setAuthorName("Quốc Trung");
                c3.setAuthorEmail("trungq@gmail.com");
                c3.setContent("Mình đang dùng MacBook Air M3 làm việc văn phòng, pin dùng 2 ngày mới phải sạc 1 lần, rất ưng ý!");
                c3.setStatus("APPROVED");
                postCommentRepo.save(c3);

                com.example.demo1.model.Post post3 = new com.example.demo1.model.Post();
                post3.setTitle("Top 3 tai nghe chống ồn chủ động (ANC) đáng sở hữu nhất nửa cuối năm 2026");
                post3.setCategory("Tư vấn mua sắm");
                post3.setAuthor("Reviewer Âm thanh");
                post3.setSummary("Điểm danh những chiếc tai nghe khử ồn xuất sắc từ Sony WH-1000XM5 đến Apple AirPods Pro 2, đem lại không gian tĩnh lặng đỉnh cao.");
                post3.setThumbnail("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800");
                post3.setViews(189);
                post3.setStatus("PUBLISHED");
                post3.setContent("""
                    <p class="lead">Công nghệ chống ồn chủ động (ANC) ngày càng trở thành tiêu chuẩn không thể thiếu đối với người làm việc văn phòng, sáng tạo nội dung hoặc thường xuyên di chuyển bằng máy bay.</p>
                    
                    <h3>1. Sony WH-1000XM5: Vua chống ồn Over-ear</h3>
                    <p>Sở hữu bộ xử lý kép Integrated Processor V1 và QN1 cùng 8 micro thu âm, WH-1000XM5 triệt tiêu tiếng ồn máy bay và xe cộ gần như hoàn hảo. Màng loa carbon 30mm đem lại dải âm trầm sâu lắng và chi tiết.</p>
                    
                    <h3>2. Apple AirPods Pro 2 (USB-C): Tiện ích tối đa cho hệ sinh thái Apple</h3>
                    <p>Nhỏ gọn, vừa vặn trong túi quần nhưng sở hữu khả năng chống ồn gấp 2 lần so với đời đầu. Tính năng Chế độ thích ứng (Adaptive Audio) tự động điều chỉnh mức khử ồn theo môi trường xung quanh.</p>
                    
                    <h3>3. Marshall Major IV: Phong cách Rock cổ điển</h3>
                    <p>Thời lượng pin kỷ lục lên đến 80 giờ liên tục, thiết kế giả da đậm chất Anh Quốc với chất âm rock mộc mạc cuốn hút.</p>
                """);
                post3 = postRepo.save(post3);

                com.example.demo1.model.Post post4 = new com.example.demo1.model.Post();
                post4.setTitle("Hướng dẫn tối ưu hóa pin cho Apple Watch và Galaxy Watch giúp dùng thoải mái 3 ngày");
                post4.setCategory("Thủ thuật công nghệ");
                post4.setAuthor("Mai Thị Trang");
                post4.setSummary("Bật mí các mẹo tinh chỉnh màn hình luôn sáng AOD, làm mới ứng dụng nền và tối ưu cảm biến GPS để kéo dài thời lượng pin vượt bậc.");
                post4.setThumbnail("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800");
                post4.setViews(420);
                post4.setStatus("PUBLISHED");
                post4.setContent("""
                    <p class="lead">Đồng hồ thông minh ngày nay có vô số tính năng hiện đại, nhưng thời lượng pin luôn là nỗi bận tâm của nhiều người. Dưới đây là những mẹo hữu ích giúp bạn kéo dài thời lượng pin đáng kể.</p>
                    
                    <h3>1. Tắt tính năng Always On Display khi không cần thiết</h3>
                    <p>Màn hình luôn sáng tiêu tốn từ 20-30% pin mỗi ngày. Bạn có thể bật chế độ Raise to Wake (nâng cổ tay để bật màn hình) thay vì để màn hình sáng liên tục.</p>
                    
                    <h3>2. Quản lý làm mới ứng dụng nền (Background App Refresh)</h3>
                    <p>Chỉ giữ lại các ứng dụng thiết yếu như Nhịp tim, Tin nhắn, Lịch và tắt quyền chạy ngầm của các ứng dụng ít sử dụng.</p>
                    
                    <h3>3. Tận dụng Chế độ Tiết kiệm Pin (Low Power Mode)</h3>
                    <p>Cả watchOS và WearOS đều trang bị chế độ tiết kiệm pin thông minh: vẫn giữ lại khả năng theo dõi số bước và xem giờ, nhưng hạn chế các kết nối mạng ngốn pin.</p>
                """);
                post4 = postRepo.save(post4);
            }

            // 7. Khởi tạo Thương hiệu (Brands) nếu chưa có
            if (brandRepo.count() == 0) {
                brandRepo.save(new Brand("Apple", "iPhone, iPad, MacBook, Phụ kiện", "STRATEGIC", "Tập đoàn công nghệ hàng đầu thế giới với hệ sinh thái sản phẩm cao cấp.", "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"));
                brandRepo.save(new Brand("Samsung", "Galaxy Phone, Tablet, Màn hình", "STRATEGIC", "Thương hiệu điện tử hàng đầu Hàn Quốc với màn hình Dynamic AMOLED đỉnh cao.", "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg"));
                brandRepo.save(new Brand("Dell", "Laptop XPS, Màn hình UltraSharp, PC đồng bộ", "ACTIVE", "Tập đoàn sản xuất máy tính và màn hình hàng đầu thế giới từ Hoa Kỳ.", "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg"));
                brandRepo.save(new Brand("Xiaomi", "Smartphone, Thiết bị Smart Home", "ACTIVE", "Hệ sinh thái nhà thông minh và smartphone cấu hình cao giá tốt.", "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg"));
                brandRepo.save(new Brand("Sony", "Tai nghe chụp tai, Loa, Máy ảnh", "ACTIVE", "Đỉnh cao âm thanh chống ồn Hi-Res và máy ảnh mirrorless chuyên nghiệp.", "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg"));
                brandRepo.save(new Brand("Asus", "Laptop ROG, Vivobook, Linh kiện", "ACTIVE", "Dẫn đầu phân khúc laptop gaming ROG và laptop đồ họa Zenbook mỏng nhẹ.", "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg"));
                brandRepo.save(new Brand("Marshall", "Loa Bluetooth, Âm thanh Hi-Fi", "ACTIVE", "Huyền thoại âm thanh phong cách cổ điển Rock 'n' Roll đến từ Vương Quốc Anh.", "https://upload.wikimedia.org/wikipedia/commons/b/b2/Marshall_logo.svg"));
                brandRepo.save(new Brand("Logitech", "Chuột, Bàn phím cơ, Tai nghe", "ACTIVE", "Thiết bị ngoại vi công thái học và gaming gear số 1 thế giới.", "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg"));
            }

            // 8. Tự động đồng bộ Brand, Lượt bán (Hot), % Giảm giá (Sale), Ngày tạo (New) cho các sản phẩm
            List<Brand> allBrands = brandRepo.findAll();
            for (Product p : productRepo.findAll()) {
                boolean changed = false;
                if (p.getCreatedAt() == null) {
                    p.setCreatedAt(LocalDateTime.now().minusDays((p.getId() % 8) + 1));
                    changed = true;
                }
                if (p.getSoldQuantity() == null || p.getSoldQuantity() == 0) {
                    int sold = (int) (12 + (p.getId() * 7) % 40);
                    p.setSoldQuantity(sold);
                    changed = true;
                }
                if (p.getDiscountPercent() == null || p.getDiscountPercent() == 0) {
                    int[] discounts = { 10, 15, 12, 20, 8, 25, 18, 5 };
                    int d = discounts[(int)(p.getId() % discounts.length)];
                    p.setDiscountPercent(d);
                    changed = true;
                }

                // Chuẩn hóa và gán Brand chính xác cho từng sản phẩm theo tên
                String pName = p.getName() != null ? p.getName().toLowerCase() : "";
                if (pName.contains("iphone") || pName.contains("macbook") || pName.contains("airpods") || pName.contains("ipad") || pName.contains("apple")) {
                    allBrands.stream().filter(b -> b.getName().equalsIgnoreCase("Apple")).findFirst().ifPresent(b -> {
                        if (p.getBrand() == null || !p.getBrand().getId().equals(b.getId())) {
                            p.setBrand(b);
                        }
                    });
                    changed = true;
                } else if (pName.contains("galaxy") || pName.contains("samsung")) {
                    allBrands.stream().filter(b -> b.getName().equalsIgnoreCase("Samsung")).findFirst().ifPresent(b -> {
                        if (p.getBrand() == null || !p.getBrand().getId().equals(b.getId())) {
                            p.setBrand(b);
                        }
                    });
                    changed = true;
                } else if (pName.contains("dell") || pName.contains("xps")) {
                    allBrands.stream().filter(b -> b.getName().equalsIgnoreCase("Dell")).findFirst().ifPresent(b -> {
                        if (p.getBrand() == null || !p.getBrand().getId().equals(b.getId())) {
                            p.setBrand(b);
                        }
                    });
                    changed = true;
                } else if (pName.contains("wh-") || pName.contains("sony")) {
                    allBrands.stream().filter(b -> b.getName().equalsIgnoreCase("Sony")).findFirst().ifPresent(b -> {
                        if (p.getBrand() == null || !p.getBrand().getId().equals(b.getId())) {
                            p.setBrand(b);
                        }
                    });
                    changed = true;
                } else if (pName.contains("stanmore") || pName.contains("marshall")) {
                    allBrands.stream().filter(b -> b.getName().equalsIgnoreCase("Marshall")).findFirst().ifPresent(b -> {
                        if (p.getBrand() == null || !p.getBrand().getId().equals(b.getId())) {
                            p.setBrand(b);
                        }
                    });
                    changed = true;
                } else if (pName.contains("asus") || pName.contains("rog") || pName.contains("zenbook")) {
                    allBrands.stream().filter(b -> b.getName().equalsIgnoreCase("Asus")).findFirst().ifPresent(b -> {
                        if (p.getBrand() == null || !p.getBrand().getId().equals(b.getId())) {
                            p.setBrand(b);
                        }
                    });
                    changed = true;
                }

                // Gán màu sắc và dung lượng mẫu cho các sản phẩm công nghệ nếu đang trống
                if (p.getColors() == null || p.getColors().trim().isEmpty()) {
                    if (pName.contains("iphone")) {
                        p.setColors("Titan Tự Nhiên, Titan Đen, Titan Xanh, Titan Trắng");
                    } else if (pName.contains("macbook")) {
                        p.setColors("Xám Không Gian, Bạc, Vàng Ánh Sao, Xanh Bóng Đêm");
                    } else if (pName.contains("galaxy") || pName.contains("samsung")) {
                        p.setColors("Titan Xám, Titan Đen, Titan Tím, Titan Vàng");
                    } else if (pName.contains("sony") || pName.contains("marshall") || pName.contains("tai nghe") || pName.contains("loa")) {
                        p.setColors("Đen Huyền Bí, Trắng Bạc, Xanh Rêu");
                    } else {
                        p.setColors("Đen Phantom, Bạc Ánh Kim, Xanh Titan");
                    }
                    changed = true;
                }
                if (p.getStorageOptions() == null || p.getStorageOptions().trim().isEmpty()) {
                    if (pName.contains("macbook") || pName.contains("laptop") || pName.contains("dell") || pName.contains("asus")) {
                        p.setStorageOptions("8GB/256GB, 16GB/512GB, 24GB/512GB, 32GB/1TB");
                    } else if (pName.contains("airpods") || pName.contains("tai nghe") || pName.contains("loa") || pName.contains("chuột")) {
                        p.setStorageOptions("Bản Tiêu Chuẩn Bluetooth 5.3");
                    } else if (pName.contains("watch") || pName.contains("đồng hồ")) {
                        p.setStorageOptions("Size 41mm GPS, Size 45mm GPS + LTE");
                    } else {
                        p.setStorageOptions("128GB, 256GB, 512GB, 1TB");
                    }
                    changed = true;
                }
                if (changed) {
                    productRepo.save(p);
                }
            }
        };
    }
}
