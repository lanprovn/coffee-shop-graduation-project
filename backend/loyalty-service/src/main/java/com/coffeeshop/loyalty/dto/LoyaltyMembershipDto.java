package com.coffeeshop.loyalty.dto;

import com.coffeeshop.loyalty.entity.LoyaltyMembership;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoyaltyMembershipDto {
    private Long id;
    private Long userId;
    private LoyaltyMembership.MembershipTier tier;
    private Integer pointsBalance;
    private Integer totalPointsEarned;
    private Integer totalPointsRedeemed;
    private BigDecimal totalSpent;
    private Integer visitCount;
    private boolean isActive;
    private String createdAt;
    private String updatedAt;
    private String lastVisitAt;
}
