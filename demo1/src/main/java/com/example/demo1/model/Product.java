package com.example.demo1.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;
    private Double price;
    private Integer quantity;

    @Column(name = "discount_percent")
    private Integer discountPercent = 0;

    @Column(name = "sold_quantity")
    private Integer soldQuantity = 0;

    // Danh sách màu sắc phân tách bằng dấu phẩy (VD: Titan Tự Nhiên, Titan Đen, Titan Xanh)
    @Column(name = "colors", length = 500)
    private String colors;

    // Danh sách dung lượng / phiên bản phân tách bằng dấu phẩy (VD: 128GB, 256GB, 512GB)
    @Column(name = "storage_options", length = 500)
    private String storageOptions;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    @com.fasterxml.jackson.annotation.JsonProperty("isHot")
    @Transient
    public boolean isHot() {
        return soldQuantity != null && soldQuantity >= 10;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("isNew")
    @Transient
    public boolean isNew() {
        return createdAt != null && createdAt.isAfter(java.time.LocalDateTime.now().minusDays(10));
    }

    @com.fasterxml.jackson.annotation.JsonProperty("discountedPrice")
    @Transient
    public Double getDiscountedPrice() {
        if (price == null) return 0.0;
        if (discountPercent == null || discountPercent <= 0) return price;
        return (double) Math.round(price * (1.0 - (discountPercent / 100.0)));
    }

    // Liên kết quan hệ N - 1 với Category
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties("products")
    private Category category;

    // Liên kết quan hệ N - 1 với Brand (Tùy chọn)
    @ManyToOne
    @JoinColumn(name = "brand_id")
    @JsonIgnoreProperties("products")
    private Brand brand;

    // Quan hệ 1 - N với ProductImage
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("product")
    @ToString.Exclude
    private List<ProductImage> images = new ArrayList<>();

    // Quan hệ 1 - N với Review
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("product")
    @ToString.Exclude
    private List<Review> reviews = new ArrayList<>();
}
