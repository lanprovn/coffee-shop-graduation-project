package com.coffeeshop.payment.controller;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.payment.dto.*;
import com.coffeeshop.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponseDto>> createPayment(
            @Valid @RequestBody PaymentRequestDto paymentRequest) {
        return ResponseEntity.ok(paymentService.createPayment(paymentRequest));
    }

    @PostMapping("/{paymentId}/process")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> processPayment(@PathVariable String paymentId) {
        return ResponseEntity.ok(paymentService.processPayment(paymentId));
    }

    @PostMapping("/callback")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> handlePaymentCallback(
            @Valid @RequestBody PaymentCallbackDto callbackDto) {
        return ResponseEntity.ok(paymentService.handlePaymentCallback(callbackDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/payment-id/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> getPaymentByPaymentId(@PathVariable String paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentByPaymentId(paymentId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<PaymentResponseDto>>> getPaymentsByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentsByOrderId(orderId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PaymentResponseDto>>> getUserPayments(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getUserPayments(userId));
    }

    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<ApiResponse<Page<PaymentResponseDto>>> getUserPaymentsPaged(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(paymentService.getUserPayments(userId, pageable));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> refundPayment(
            @PathVariable String paymentId,
            @RequestParam BigDecimal refundAmount) {
        return ResponseEntity.ok(paymentService.refundPayment(paymentId, refundAmount));
    }
}
