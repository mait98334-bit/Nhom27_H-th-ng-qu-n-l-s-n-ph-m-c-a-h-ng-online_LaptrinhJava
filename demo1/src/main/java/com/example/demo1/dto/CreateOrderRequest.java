package com.example.demo1.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Long userId;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private String notes;
    private String paymentMethod; // COD, VIETQR
    private List<OrderItemDto> items;

    @Data
    public static class OrderItemDto {
        private Long productId;
        private Integer quantity;
        private String selectedColor;
        private String selectedStorage;
    }
}
