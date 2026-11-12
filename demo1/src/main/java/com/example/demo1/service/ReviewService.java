package com.example.demo1.service;

import com.example.demo1.model.Product;
import com.example.demo1.model.Review;
import com.example.demo1.model.User;
import com.example.demo1.repository.ProductRepository;
import com.example.demo1.repository.ReviewRepository;
import com.example.demo1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review addReview(Long productId, Long userId, Integer rating, String comment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + productId));

        User user;
        if (userId != null) {
            user = userRepository.findById(userId)
                    .orElseGet(() -> getOrCreateDefaultUser());
        } else {
            user = getOrCreateDefaultUser();
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(rating != null ? rating : 5);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    private User getOrCreateDefaultUser() {
        return userRepository.findAll().stream().findFirst().orElseGet(() -> {
            User guest = new User();
            guest.setUsername("guest");
            guest.setFullName("Khách hàng vãng lai");
            guest.setEmail("guest@example.com");
            guest.setRole("CUSTOMER");
            return userRepository.save(guest);
        });
    }
}
