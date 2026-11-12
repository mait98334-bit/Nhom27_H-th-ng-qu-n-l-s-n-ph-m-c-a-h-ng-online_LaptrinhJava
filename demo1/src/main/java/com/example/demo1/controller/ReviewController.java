package com.example.demo1.controller;

import com.example.demo1.model.Review;
import com.example.demo1.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String comment,
            @RequestBody(required = false) Map<String, Object> body) {

        Long pId = productId;
        Long uId = userId;
        Integer rate = rating;
        String cmt = comment;

        if (body != null) {
            if (pId == null && body.get("productId") != null) {
                pId = Long.valueOf(body.get("productId").toString());
            }
            if (uId == null && body.get("userId") != null) {
                uId = Long.valueOf(body.get("userId").toString());
            }
            if (rate == null && body.get("rating") != null) {
                rate = Integer.valueOf(body.get("rating").toString());
            }
            if (cmt == null && body.get("comment") != null) {
                cmt = body.get("comment").toString();
            }
        }

        return ResponseEntity.ok(reviewService.addReview(pId, uId, rate, cmt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Đã xóa đánh giá thành công!");
    }
}
