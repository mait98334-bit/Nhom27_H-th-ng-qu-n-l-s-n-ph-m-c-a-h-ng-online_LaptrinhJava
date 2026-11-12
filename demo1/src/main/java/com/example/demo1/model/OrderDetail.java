package com.example.demo1.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "order_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity; // Số lượng mua
    private Double price; // Đơn giá tại thời điểm mua

    @Column(name = "selected_color")
    private String selectedColor; // Màu sắc khách chọn lúc đặt hàng

    @Column(name = "selected_storage")
    private String selectedStorage; // Dung lượng / phiên bản khách chọn lúc đặt hàng

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnoreProperties("orderDetails")
    @ToString.Exclude
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"images", "reviews", "category"})
    @ToString.Exclude
    private Product product;

    public OrderDetail(Long id, Integer quantity, Double price, Order order, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.order = order;
        this.product = product;
    }
}
