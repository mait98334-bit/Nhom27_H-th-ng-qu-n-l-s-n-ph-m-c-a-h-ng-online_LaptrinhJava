package com.example.demo1.service;

import com.example.demo1.model.Product;
import com.example.demo1.model.ProductImage;
import com.example.demo1.repository.ProductImageRepository;
import com.example.demo1.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageService {
    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<ProductImage> getImagesByProduct(Long productId) {
        return productImageRepository.findByProductId(productId);
    }

    public ProductImage addImage(Long productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + productId));
        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setProduct(product);
        return productImageRepository.save(image);
    }

    public void deleteImage(Long id) {
        productImageRepository.deleteById(id);
    }
}
