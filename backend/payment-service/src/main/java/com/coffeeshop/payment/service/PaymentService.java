package com.coffeeshop.payment.service;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.shared.exception.CoffeeShopException;
import com.coffeeshop.payment.dto.*;
import com.coffeeshop.payment.entity.Payment;
import com.coffeeshop.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public ApiResponse<PaymentResponseDto> createPayment(PaymentRequestDto paymentRequest) {
        Payment payment = new Payment();
        payment.setPaymentId(generatePaymentId());
        payment.setOrderId(paymentRequest.getOrderId());
        payment.setUserId(paymentRequest.getUserId());
        payment.setMethod(paymentRequest.getMethod());
        payment.setAmount(paymentRequest.getAmount());
        payment.setCurrency(paymentRequest.getCurrency());
        payment.setPaymentDetails(paymentRequest.getPaymentDetails());
        payment.setStatus(Payment.PaymentStatus.PENDING);

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment created: {} for order: {}", savedPayment.getPaymentId(), savedPayment.getOrderId());

        return ApiResponse.success("Payment created successfully", convertToResponseDto(savedPayment));
    }

    public ApiResponse<PaymentResponseDto> processPayment(String paymentId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(
                        () -> new CoffeeShopException("Payment not found", "PAYMENT_NOT_FOUND", HttpStatus.NOT_FOUND));

        if (payment.getStatus() != Payment.PaymentStatus.PENDING) {
            throw new CoffeeShopException("Payment is not in pending status", "INVALID_PAYMENT_STATUS",
                    HttpStatus.BAD_REQUEST);
        }

        payment.setStatus(Payment.PaymentStatus.PROCESSING);
        paymentRepository.save(payment);

        // Simulate payment processing based on method
        try {
            boolean success = processPaymentByMethod(payment);

            if (success) {
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setCompletedAt(LocalDateTime.now());
                payment.setTransactionId(generateTransactionId());
                payment.setGatewayResponse("Payment successful");
                log.info("Payment completed: {}", paymentId);
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason("Payment processing failed");
                log.error("Payment failed: {}", paymentId);
            }
        } catch (Exception e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            log.error("Payment processing error: {}", e.getMessage());
        }

        Payment savedPayment = paymentRepository.save(payment);
        return ApiResponse.success("Payment processed", convertToResponseDto(savedPayment));
    }

    public ApiResponse<PaymentResponseDto> handlePaymentCallback(PaymentCallbackDto callbackDto) {
        Payment payment = paymentRepository.findByPaymentId(callbackDto.getPaymentId())
                .orElseThrow(
                        () -> new CoffeeShopException("Payment not found", "PAYMENT_NOT_FOUND", HttpStatus.NOT_FOUND));

        payment.setTransactionId(callbackDto.getTransactionId());
        payment.setGatewayReference(callbackDto.getGatewayReference());
        payment.setGatewayResponse(callbackDto.getGatewayResponse());

        if ("COMPLETED".equals(callbackDto.getStatus())) {
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setCompletedAt(LocalDateTime.now());
        } else if ("FAILED".equals(callbackDto.getStatus())) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setFailureReason(callbackDto.getFailureReason());
        }

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment callback processed: {} - Status: {}", payment.getPaymentId(), callbackDto.getStatus());

        return ApiResponse.success("Payment callback processed", convertToResponseDto(savedPayment));
    }

    public ApiResponse<PaymentResponseDto> getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(
                        () -> new CoffeeShopException("Payment not found", "PAYMENT_NOT_FOUND", HttpStatus.NOT_FOUND));

        return ApiResponse.success(convertToResponseDto(payment));
    }

    public ApiResponse<PaymentResponseDto> getPaymentByPaymentId(String paymentId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(
                        () -> new CoffeeShopException("Payment not found", "PAYMENT_NOT_FOUND", HttpStatus.NOT_FOUND));

        return ApiResponse.success(convertToResponseDto(payment));
    }

    public ApiResponse<List<PaymentResponseDto>> getPaymentsByOrderId(Long orderId) {
        List<Payment> payments = paymentRepository.findByOrderId(orderId);
        List<PaymentResponseDto> paymentDtos = payments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());

        return ApiResponse.success(paymentDtos);
    }

    public ApiResponse<List<PaymentResponseDto>> getUserPayments(Long userId) {
        List<Payment> payments = paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<PaymentResponseDto> paymentDtos = payments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());

        return ApiResponse.success(paymentDtos);
    }

    public ApiResponse<Page<PaymentResponseDto>> getUserPayments(Long userId, Pageable pageable) {
        Page<Payment> payments = paymentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        Page<PaymentResponseDto> paymentDtos = payments.map(this::convertToResponseDto);

        return ApiResponse.success(paymentDtos);
    }

    public ApiResponse<PaymentResponseDto> refundPayment(String paymentId, BigDecimal refundAmount) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(
                        () -> new CoffeeShopException("Payment not found", "PAYMENT_NOT_FOUND", HttpStatus.NOT_FOUND));

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new CoffeeShopException("Only completed payments can be refunded", "INVALID_REFUND_STATUS",
                    HttpStatus.BAD_REQUEST);
        }

        if (refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new CoffeeShopException("Refund amount cannot exceed payment amount", "INVALID_REFUND_AMOUNT",
                    HttpStatus.BAD_REQUEST);
        }

        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        payment.setFailureReason("Refunded: " + refundAmount + " " + payment.getCurrency());
        paymentRepository.save(payment);

        log.info("Payment refunded: {} - Amount: {}", paymentId, refundAmount);
        return ApiResponse.success("Payment refunded successfully", convertToResponseDto(payment));
    }

    private boolean processPaymentByMethod(Payment payment) {
        // Simulate different payment method processing
        switch (payment.getMethod()) {
            case CASH:
                // Cash payments are always successful
                return true;
            case KBZ_PAY:
                // Simulate KBZ Pay processing (90% success rate)
                return Math.random() > 0.1;
            case WAVE_MONEY:
                // Simulate Wave Money processing (95% success rate)
                return Math.random() > 0.05;
            case CREDIT_CARD:
                // Simulate credit card processing (85% success rate)
                return Math.random() > 0.15;
            case BANK_TRANSFER:
                // Simulate bank transfer processing (80% success rate)
                return Math.random() > 0.2;
            default:
                return false;
        }
    }

    private String generatePaymentId() {
        return "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }

    private PaymentResponseDto convertToResponseDto(Payment payment) {
        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setId(payment.getId());
        dto.setPaymentId(payment.getPaymentId());
        dto.setOrderId(payment.getOrderId());
        dto.setUserId(payment.getUserId());
        dto.setMethod(payment.getMethod());
        dto.setStatus(payment.getStatus());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setTransactionId(payment.getTransactionId());
        dto.setGatewayResponse(payment.getGatewayResponse());
        dto.setGatewayReference(payment.getGatewayReference());
        dto.setFailureReason(payment.getFailureReason());
        dto.setPaymentDetails(payment.getPaymentDetails());
        dto.setCreatedAt(
                payment.getCreatedAt() != null ? payment.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null);
        dto.setUpdatedAt(
                payment.getUpdatedAt() != null ? payment.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null);
        dto.setCompletedAt(payment.getCompletedAt() != null
                ? payment.getCompletedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null);
        return dto;
    }
}
