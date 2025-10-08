package com.coffeeshop.payment.dto;

import com.coffeeshop.payment.entity.Payment;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentResponseDto {
    private Long id;
    private String paymentId;
    private Long orderId;
    private Long userId;
    private Payment.PaymentMethod method;
    private Payment.PaymentStatus status;
    private BigDecimal amount;
    private String currency;
    private String transactionId;
    private String gatewayResponse;
    private String gatewayReference;
    private String failureReason;
    private String paymentDetails;
    private String createdAt;
    private String updatedAt;
    private String completedAt;
}
