package com.coffeeshop.loyalty.dto;

import com.coffeeshop.loyalty.entity.PointsTransaction;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PointsTransactionDto {
    private Long id;
    private Long userId;
    private PointsTransaction.TransactionType type;
    private Integer points;
    private Long orderId;
    private String description;
    private BigDecimal amount;
    private String createdAt;
}
