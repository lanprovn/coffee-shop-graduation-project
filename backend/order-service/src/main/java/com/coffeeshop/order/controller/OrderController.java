package com.coffeeshop.order.controller;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.order.dto.*;
import com.coffeeshop.order.entity.Order;
import com.coffeeshop.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Cart endpoints
    @GetMapping("/cart")
    public ResponseEntity<ApiResponse<CartDto>> getCart(@RequestParam Long userId) {
        return ResponseEntity.ok(orderService.getCart(userId));
    }

    @PostMapping("/cart/add")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @RequestParam Long userId,
            @Valid @RequestBody CartItemDto cartItemDto) {
        return ResponseEntity.ok(orderService.addToCart(userId, cartItemDto));
    }

    @DeleteMapping("/cart/remove")
    public ResponseEntity<ApiResponse<CartDto>> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long productId) {
        return ResponseEntity.ok(orderService.removeFromCart(userId, productId));
    }

    @DeleteMapping("/cart/clear")
    public ResponseEntity<ApiResponse<CartDto>> clearCart(@RequestParam Long userId) {
        return ResponseEntity.ok(orderService.clearCart(userId));
    }

    // Order endpoints
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @RequestParam Long userId,
            @Valid @RequestBody OrderDto orderDto) {
        return ResponseEntity.ok(orderService.createOrder(userId, orderDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getUserOrdersPaged(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getUserOrders(userId, pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
