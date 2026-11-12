package com.example.demo1.controller;

import com.example.demo1.model.ProductImage;
import com.example.demo1.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-images")
public class ProductImageController {
    @Autowired
    private ProductImageService productImageService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImage>> getImagesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.getImagesByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<ProductImage> addImage(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) String imageUrl,
            @RequestBody(required = false) Map<String, Object> body) {
        Long pId = productId;
        String url = imageUrl;
        if (body != null) {
            if (pId == null && body.get("productId") != null) {
                pId = Long.valueOf(body.get("productId").toString());
            }
            if (url == null && body.get("imageUrl") != null) {
                url = body.get("imageUrl").toString();
            }
        }
        return ResponseEntity.ok(productImageService.addImage(pId, url));
    }

    @PostMapping("/batch")
    public ResponseEntity<java.util.List<ProductImage>> addBatchImages(
            @RequestParam(required = false) Long productId,
            @RequestBody(required = false) Map<String, Object> body) {
        Long pId = productId;
        java.util.List<String> urls = new java.util.ArrayList<>();
        if (body != null) {
            if (pId == null && body.get("productId") != null) {
                pId = Long.valueOf(body.get("productId").toString());
            }
            if (body.get("imageUrls") instanceof java.util.List) {
                java.util.List<?> list = (java.util.List<?>) body.get("imageUrls");
                for (Object o : list) {
                    if (o != null && !o.toString().trim().isEmpty()) {
                        urls.add(o.toString().trim());
                    }
                }
            }
        }
        java.util.List<ProductImage> savedList = new java.util.ArrayList<>();
        for (String u : urls) {
            savedList.add(productImageService.addImage(pId, u));
        }
        return ResponseEntity.ok(savedList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteImage(@PathVariable Long id) {
        productImageService.deleteImage(id);
        return ResponseEntity.ok("Đã xóa ảnh thành công!");
    }
}
