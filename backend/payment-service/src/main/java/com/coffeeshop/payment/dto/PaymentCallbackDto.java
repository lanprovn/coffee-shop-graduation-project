package com.coffeeshop.payment.dto;

import lombok.Data;

@Data
public class PaymentCallbackDto {
    private String paymentId;
    private String transactionId;
    private String status;
    private String gatewayReference;
    private String gatewayResponse;
    private String failureReason;
}
