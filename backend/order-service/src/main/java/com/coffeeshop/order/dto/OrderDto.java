package com.coffeeshop.order.dto;

import com.coffeeshop.order.entity.Order;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private String orderNumber;

    @NotNull(message = "User ID is required")
    private Long userId;

    private Order.OrderStatus status;
    private Order.OrderType type;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private BigDecimal deliveryFee;

    @NotBlank(message = "Delivery address is required for delivery orders")
    private String deliveryAddress;

    private String deliveryPhone;
    private String notes;
    private List<OrderItemDto> orderItems;
    private String createdAt;
    private String updatedAt;
    private String completedAt;
}
