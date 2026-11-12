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
@Table(name = "brands")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // Dòng sản phẩm / Lĩnh vực chủ lực của hãng (cột CSDL: main_product_line để tránh nhầm với bảng Category)
    @Column(name = "main_product_line")
    private String category;

    // Trạng thái: ACTIVE (Chính hãng), STRATEGIC (Đối tác chiến lược), PAUSED (Tạm dừng)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @OneToMany(mappedBy = "brand")
    @JsonIgnoreProperties("brand")
    @ToString.Exclude
    private List<Product> products = new ArrayList<>();

    public Brand(String name, String category, String status, String description, String logoUrl) {
        this.name = name;
        this.category = category;
        this.status = status;
        this.description = description;
        this.logoUrl = logoUrl;
    }
}
