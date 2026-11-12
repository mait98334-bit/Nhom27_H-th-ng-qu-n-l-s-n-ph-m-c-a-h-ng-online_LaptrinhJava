package com.example.demo1.service;

import com.example.demo1.dto.CreateOrderRequest;
import com.example.demo1.model.Order;
import com.example.demo1.model.OrderDetail;
import com.example.demo1.model.Product;
import com.example.demo1.model.User;
import com.example.demo1.repository.OrderDetailRepository;
import com.example.demo1.repository.OrderRepository;
import com.example.demo1.repository.ProductRepository;
import com.example.demo1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<Order> getOrdersByPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) return Collections.emptyList();
        return orderRepository.findByReceiverPhoneOrderByOrderDateDesc(phone.trim());
    }

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
        order.setNotes(request.getNotes());

        String payMethod = request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "COD";
        order.setPaymentMethod(payMethod);
        order.setStatus("PENDING");
        order.setPaymentStatus(payMethod.equals("COD") ? "UNPAID" : "PAID_WAITING");

        // Gắn User nếu có
        if (request.getUserId() != null) {
            userRepository.findById(request.getUserId()).ifPresent(order::setUser);
        }

        double total = 0.0;
        List<OrderDetail> details = new ArrayList<>();

        // Kiểm tra số lượng tồn kho và tạo OrderDetail
        for (CreateOrderRequest.OrderItemDto item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có mã: " + item.getProductId()));

            int qty = (item.getQuantity() != null && item.getQuantity() > 0) ? item.getQuantity() : 1;

            if (product.getQuantity() < qty) {
                throw new RuntimeException("Sản phẩm '" + product.getName() + "' chỉ còn " + product.getQuantity() + " trong kho, không đủ đáp ứng!");
            }

            // Trừ số lượng tồn kho
            product.setQuantity(product.getQuantity() - qty);
            productRepository.save(product);

            double finalPrice = product.getDiscountedPrice() != null ? product.getDiscountedPrice() : product.getPrice();

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setQuantity(qty);
            detail.setPrice(finalPrice);
            detail.setSelectedColor(item.getSelectedColor());
            detail.setSelectedStorage(item.getSelectedStorage());

            details.add(detail);
            total += finalPrice * qty;
        }

        order.setTotalPrice(total);
        order.setOrderDetails(details);

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng #" + orderId));
        order.setStatus(newStatus.toUpperCase());
        if ("COMPLETED".equalsIgnoreCase(newStatus)) {
            order.setPaymentStatus("PAID");
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order updatePaymentStatus(Long orderId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng #" + orderId));
        order.setPaymentStatus(paymentStatus.toUpperCase());
        return orderRepository.save(order);
    }

    public Map<String, Object> generateVietQrInfo(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng #" + orderId));

        String bankId = "MB"; // Ngân hàng Quân Đội MBBank
        String accountNo = "0333888999";
        String accountName = "CONG TY TNHH SISI SHOP";
        long amount = Math.round(order.getTotalPrice() != null ? order.getTotalPrice() : 0);
        String memo = "SISI DH" + order.getId();

        String encodedMemo = URLEncoder.encode(memo, StandardCharsets.UTF_8);
        String encodedAccountName = URLEncoder.encode(accountName, StandardCharsets.UTF_8);

        // URL chuẩn theo chuẩn VietQR QuickLink (tự động render mã QR có logo và số tiền)
        String qrImageUrl = String.format(
                "https://img.vietqr.io/image/%s-%s-compact2.png?amount=%d&addInfo=%s&accountName=%s",
                bankId, accountNo, amount, encodedMemo, encodedAccountName
        );

        Map<String, Object> qrData = new HashMap<>();
        qrData.put("orderId", order.getId());
        qrData.put("totalPrice", order.getTotalPrice());
        qrData.put("bankName", "Ngân hàng TMCP Quân Đội (MB Bank)");
        qrData.put("accountNo", accountNo);
        qrData.put("accountName", accountName);
        qrData.put("transferContent", memo);
        qrData.put("qrImageUrl", qrImageUrl);
        qrData.put("paymentStatus", order.getPaymentStatus());

        return qrData;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
