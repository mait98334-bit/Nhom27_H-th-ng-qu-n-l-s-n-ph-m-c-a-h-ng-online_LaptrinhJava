package com.example.demo1.repository;

import com.example.demo1.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Thêm sẵn hàm tìm kiếm theo tên (tận dụng từ Lab 4.4 của bạn)
    List<Product> findByNameContainingIgnoreCase(String name);
}