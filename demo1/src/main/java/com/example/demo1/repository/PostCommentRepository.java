package com.example.demo1.repository;

import com.example.demo1.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    List<PostComment> findByPostIdOrderByCreatedAtDesc(Long postId);

    List<PostComment> findAllByOrderByCreatedAtDesc();
}
