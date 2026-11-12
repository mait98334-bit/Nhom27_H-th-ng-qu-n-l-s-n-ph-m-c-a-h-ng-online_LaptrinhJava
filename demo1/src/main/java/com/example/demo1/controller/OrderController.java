package com.example.demo1.controller;

import com.example.demo1.dto.CreateOrderRequest;
import com.example.demo1.model.Order;
import com.example.demo1.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<List<Order>> getOrdersByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(orderService.getOrdersByPhone(phone));
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CreateOrderRequest request) {
        try {
            Order order = orderService.createOrder(request);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu tham số status!"));
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @PutMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String paymentStatus = body.get("paymentStatus");
        if (paymentStatus == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu tham số paymentStatus!"));
        }
        return ResponseEntity.ok(orderService.updatePaymentStatus(id, paymentStatus));
    }

    @GetMapping("/{id}/vietqr")
    public ResponseEntity<Map<String, Object>> getVietQr(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.generateVietQrInfo(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Đã xóa đơn hàng thành công!");
    }
}
