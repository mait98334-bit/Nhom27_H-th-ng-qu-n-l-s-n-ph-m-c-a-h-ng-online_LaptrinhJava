package com.example.demo1.controller;

import com.example.demo1.model.Brand;
import com.example.demo1.service.BrandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        return brandService.getBrandById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        Brand saved = brandService.saveBrand(brand);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody Brand brandDetails) {
        return brandService.getBrandById(id).map(brand -> {
            brand.setName(brandDetails.getName());
            brand.setCategory(brandDetails.getCategory());
            brand.setStatus(brandDetails.getStatus());
            brand.setDescription(brandDetails.getDescription());
            brand.setLogoUrl(brandDetails.getLogoUrl());
            return ResponseEntity.ok(brandService.saveBrand(brand));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBrand(@PathVariable Long id) {
        if (brandService.getBrandById(id).isPresent()) {
            brandService.deleteBrand(id);
            return ResponseEntity.ok("Đã xóa thương hiệu ID: " + id);
        }
        return ResponseEntity.notFound().build();
    }
}
