package com.example.demo1.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderDate = LocalDateTime.now();

    private Double totalPrice;

    // Trạng thái đơn hàng: PENDING (Chờ xử lý), CONFIRMED (Đã xác nhận), SHIPPING (Đang giao), COMPLETED (Hoàn tất), CANCELLED (Đã hủy)
    private String status = "PENDING";

    // Phương thức thanh toán: COD, VIETQR, VNPAY
    private String paymentMethod = "COD";

    // Trạng thái thanh toán: UNPAID (Chưa thanh toán), PAID (Đã thanh toán)
    private String paymentStatus = "UNPAID";

    // Thông tin người nhận hàng
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "reviews"})
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("order")
    @ToString.Exclude
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.orderDate == null) {
            this.orderDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
        if (this.paymentMethod == null) {
            this.paymentMethod = "COD";
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "UNPAID";
        }
    }
}
