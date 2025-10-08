package com.coffeeshop.loyalty.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RedeemPointsRequestDto {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Points to redeem is required")
    private Integer points;

    private String description;
}
