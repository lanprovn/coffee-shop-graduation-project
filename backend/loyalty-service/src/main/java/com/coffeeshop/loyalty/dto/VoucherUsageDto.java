package com.coffeeshop.loyalty.dto;

import lombok.Data;

@Data
public class VoucherUsageDto {
    private Long id;
    private Long voucherId;
    private String voucherCode;
    private Long userId;
    private Long orderId;
    private String usedAt;
}
