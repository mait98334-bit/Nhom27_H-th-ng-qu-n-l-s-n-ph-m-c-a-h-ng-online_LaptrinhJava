package com.example.demo1.controller;

import com.example.demo1.model.Post;
import com.example.demo1.model.PostComment;
import com.example.demo1.repository.PostCommentRepository;
import com.example.demo1.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostCommentRepository postCommentRepository;

    // 1. Lấy danh sách bài viết (có hỗ trợ lọc theo category, search, status)
    @GetMapping
    public List<Post> getAllPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        if (search != null && !search.trim().isEmpty()) {
            return postRepository.findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCaseOrderByCreatedAtDesc(search.trim(), search.trim());
        }

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all")) {
            String targetStatus = (status != null && !status.isEmpty()) ? status : "PUBLISHED";
            return postRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category.trim(), targetStatus);
        }

        if (status != null && !status.isEmpty()) {
            return postRepository.findByStatusOrderByCreatedAtDesc(status);
        }

        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // 2. Lấy chi tiết 1 bài viết theo ID (Tự động tăng lượt xem views++)
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();
        // Tăng lượt xem
        post.setViews((post.getViews() == null ? 0 : post.getViews()) + 1);
        postRepository.save(post);

        return ResponseEntity.ok(post);
    }

    // 3. Thêm mới bài viết (Dành cho Admin)
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tiêu đề bài viết không được để trống!"));
        }

        if (post.getAuthor() == null || post.getAuthor().trim().isEmpty()) {
            post.setAuthor("Ban biên tập SiSi Tech");
        }
        if (post.getCategory() == null || post.getCategory().trim().isEmpty()) {
            post.setCategory("Đánh giá công nghệ");
        }
        if (post.getStatus() == null || post.getStatus().trim().isEmpty()) {
            post.setStatus("PUBLISHED");
        }
        if (post.getViews() == null) {
            post.setViews(0);
        }

        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    // 4. Cập nhật bài viết
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();
        post.setTitle(postDetails.getTitle());
        post.setSummary(postDetails.getSummary());
        post.setContent(postDetails.getContent());
        post.setThumbnail(postDetails.getThumbnail());
        post.setAuthor(postDetails.getAuthor());
        post.setCategory(postDetails.getCategory());
        post.setStatus(postDetails.getStatus());

        Post updatedPost = postRepository.save(post);
        return ResponseEntity.ok(updatedPost);
    }

    // 5. Xóa bài viết (Kèm cascade xóa bình luận)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        postRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa bài viết thành công!", "id", id));
    }

    // 6. Lấy danh sách bình luận của 1 bài viết
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getCommentsByPostId(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<PostComment> comments = postCommentRepository.findByPostIdOrderByCreatedAtDesc(id);
        return ResponseEntity.ok(comments);
    }

    // 7. Thêm bình luận vào bài viết
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addCommentToPost(@PathVariable Long id, @RequestBody PostComment comment) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nội dung bình luận không được để trống!"));
        }
        if (comment.getAuthorName() == null || comment.getAuthorName().trim().isEmpty()) {
            comment.setAuthorName("Khách tham quan");
        }

        comment.setPost(optionalPost.get());
        comment.setStatus("APPROVED");

        PostComment savedComment = postCommentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
    }

    // 8. Lấy toàn bộ bình luận của tất cả các bài viết (Dành cho Quản trị Admin)
    @GetMapping("/comments")
    public List<Map<String, Object>> getAllCommentsForAdmin() {
        List<PostComment> list = postCommentRepository.findAllByOrderByCreatedAtDesc();
        return list.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("authorName", c.getAuthorName());
            map.put("authorEmail", c.getAuthorEmail());
            map.put("content", c.getContent());
            map.put("status", c.getStatus());
            map.put("createdAt", c.getCreatedAt());
            if (c.getPost() != null) {
                map.put("postId", c.getPost().getId());
                map.put("postTitle", c.getPost().getTitle());
            }
            return map;
        }).toList();
    }

    // 9. Xóa bình luận bài viết (Dành cho Admin)
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        if (!postCommentRepository.existsById(commentId)) {
            return ResponseEntity.notFound().build();
        }
        postCommentRepository.deleteById(commentId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa bình luận thành công!", "id", commentId));
    }

    // 10. Cập nhật trạng thái duyệt / ẩn bình luận
    @PutMapping("/comments/{commentId}/status")
    public ResponseEntity<?> updateCommentStatus(@PathVariable Long commentId, @RequestBody Map<String, String> payload) {
        Optional<PostComment> optionalComment = postCommentRepository.findById(commentId);
        if (optionalComment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PostComment comment = optionalComment.get();
        String newStatus = payload.get("status");
        if (newStatus != null && !newStatus.isEmpty()) {
            comment.setStatus(newStatus.toUpperCase());
            postCommentRepository.save(comment);
        }
        return ResponseEntity.ok(comment);
    }
}
