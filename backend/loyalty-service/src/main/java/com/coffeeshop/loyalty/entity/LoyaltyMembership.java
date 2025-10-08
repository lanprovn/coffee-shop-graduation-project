package com.coffeeshop.loyalty.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_memberships")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class LoyaltyMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Enumerated(EnumType.STRING)
    private MembershipTier tier = MembershipTier.BRONZE;

    @Column(name = "points_balance")
    private Integer pointsBalance = 0;

    @Column(name = "total_points_earned")
    private Integer totalPointsEarned = 0;

    @Column(name = "total_points_redeemed")
    private Integer totalPointsRedeemed = 0;

    @Column(name = "total_spent", precision = 10, scale = 2)
    private BigDecimal totalSpent = BigDecimal.ZERO;

    @Column(name = "visit_count")
    private Integer visitCount = 0;

    @Column(name = "is_active")
    private boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_visit_at")
    private LocalDateTime lastVisitAt;

    public enum MembershipTier {
        BRONZE(0, 0.01, "Bronze Member"),
        SILVER(1000, 0.02, "Silver Member"),
        GOLD(5000, 0.03, "Gold Member"),
        PLATINUM(10000, 0.05, "Platinum Member");

        private final int requiredPoints;
        private final double pointsMultiplier;
        private final String description;

        MembershipTier(int requiredPoints, double pointsMultiplier, String description) {
            this.requiredPoints = requiredPoints;
            this.pointsMultiplier = pointsMultiplier;
            this.description = description;
        }

        public int getRequiredPoints() {
            return requiredPoints;
        }

        public double getPointsMultiplier() {
            return pointsMultiplier;
        }

        public String getDescription() {
            return description;
        }
    }
}
