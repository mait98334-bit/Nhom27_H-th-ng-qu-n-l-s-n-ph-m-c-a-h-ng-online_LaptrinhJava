package com.example.demo1.repository;

import com.example.demo1.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    List<Order> findByReceiverPhoneOrderByOrderDateDesc(String receiverPhone);
}
