package com.example.demo1.repository;

import com.example.demo1.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Có thể viết thêm hàm tìm kiếm danh mục theo tên nếu cần
    Category findByNameIgnoreCase(String name);
}