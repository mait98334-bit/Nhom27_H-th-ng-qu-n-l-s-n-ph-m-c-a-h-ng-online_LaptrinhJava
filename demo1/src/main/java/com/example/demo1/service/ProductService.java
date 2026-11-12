package com.example.demo1.service;

import com.example.demo1.model.Product;
import com.example.demo1.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    // Constructor Injection
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        if (product.getCreatedAt() == null) {
            product.setCreatedAt(java.time.LocalDateTime.now());
        }
        if (product.getSoldQuantity() == null) {
            product.setSoldQuantity(0);
        }
        if (product.getDiscountPercent() == null) {
            product.setDiscountPercent(0);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product newProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(newProduct.getName());
            product.setDescription(newProduct.getDescription());
            product.setPrice(newProduct.getPrice());
            product.setQuantity(newProduct.getQuantity());
            if (newProduct.getDiscountPercent() != null) {
                product.setDiscountPercent(newProduct.getDiscountPercent());
            }
            if (newProduct.getSoldQuantity() != null) {
                product.setSoldQuantity(newProduct.getSoldQuantity());
            }
            if (newProduct.getCategory() != null) {
                product.setCategory(newProduct.getCategory());
            }
            product.setBrand(newProduct.getBrand());
            product.setColors(newProduct.getColors());
            product.setStorageOptions(newProduct.getStorageOptions());
            return productRepository.save(product);
        }).orElse(null);
    }

    // Logic Sản phẩm Hot: lượt bán >= 10, sắp xếp theo số lượng bán giảm dần
    public List<Product> getHotProducts() {
        return productRepository.findAll().stream()
                .filter(Product::isHot)
                .sorted((a, b) -> (b.getSoldQuantity() != null ? b.getSoldQuantity() : 0) - (a.getSoldQuantity() != null ? a.getSoldQuantity() : 0))
                .toList();
    }

    // Logic Sản phẩm Mới: tạo trong vòng 10 ngày gần nhất, sắp xếp mới nhất lên đầu
    public List<Product> getNewProducts() {
        return productRepository.findAll().stream()
                .filter(Product::isNew)
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .toList();
    }

    // Logic Sản phẩm Khuyến mãi (Sale): có % giảm giá > 0, sắp xếp % giảm giảm dần
    public List<Product> getSaleProducts() {
        return productRepository.findAll().stream()
                .filter(p -> p.getDiscountPercent() != null && p.getDiscountPercent() > 0)
                .sorted((a, b) -> (b.getDiscountPercent() != null ? b.getDiscountPercent() : 0) - (a.getDiscountPercent() != null ? a.getDiscountPercent() : 0))
                .toList();
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}