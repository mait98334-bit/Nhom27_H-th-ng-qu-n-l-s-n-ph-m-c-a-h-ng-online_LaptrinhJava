package com.example.demo1.controller;

import com.example.demo1.model.Product;
import com.example.demo1.repository.BrandRepository;
import com.example.demo1.repository.CategoryRepository;
import com.example.demo1.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ProductController(ProductService productService,
                             CategoryRepository categoryRepository,
                             BrandRepository brandRepository) {
        this.productService = productService;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/hot")
    public List<Product> getHotProducts() {
        return productService.getHotProducts();
    }

    @GetMapping("/new")
    public List<Product> getNewProducts() {
        return productService.getNewProducts();
    }

    @GetMapping("/sale")
    public List<Product> getSaleProducts() {
        return productService.getSaleProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id).orElse(null);
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            categoryRepository.findById(product.getCategory().getId()).ifPresentOrElse(
                    product::setCategory,
                    () -> categoryRepository.findAll().stream().findFirst().ifPresent(product::setCategory)
            );
        } else {
            categoryRepository.findAll().stream().findFirst().ifPresent(product::setCategory);
        }
        if (product.getBrand() != null && product.getBrand().getId() != null) {
            brandRepository.findById(product.getBrand().getId()).ifPresent(product::setBrand);
        } else {
            product.setBrand(null);
        }
        return productService.saveProduct(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            categoryRepository.findById(product.getCategory().getId()).ifPresentOrElse(
                    product::setCategory,
                    () -> categoryRepository.findAll().stream().findFirst().ifPresent(product::setCategory)
            );
        } else {
            categoryRepository.findAll().stream().findFirst().ifPresent(product::setCategory);
        }
        if (product.getBrand() != null && product.getBrand().getId() != null) {
            brandRepository.findById(product.getBrand().getId()).ifPresent(product::setBrand);
        } else {
            product.setBrand(null);
        }
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        boolean success = productService.deleteProduct(id);
        if (success) {
            return "Product deleted successfully!";
        }
        return "Product not found!";
    }
}