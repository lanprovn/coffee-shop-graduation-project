package com.coffeeshop.loyalty.dto;

import com.coffeeshop.loyalty.entity.Voucher;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VoucherDto {
    private Long id;

    @NotBlank(message = "Voucher code is required")
    private String code;

    @NotBlank(message = "Voucher name is required")
    private String name;

    private String description;

    @NotNull(message = "Voucher type is required")
    private Voucher.VoucherType type;

    private BigDecimal discountValue;
    private Integer discountPercentage;
    private BigDecimal minimumOrderAmount;
    private BigDecimal maximumDiscountAmount;
    private Integer usageLimit;
    private Integer usedCount;
    private boolean isActive;
    private String validFrom;
    private String validUntil;
}
