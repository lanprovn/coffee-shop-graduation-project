package com.coffeeshop.loyalty.repository;

import com.coffeeshop.loyalty.entity.LoyaltyMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoyaltyMembershipRepository extends JpaRepository<LoyaltyMembership, Long> {
    Optional<LoyaltyMembership> findByUserId(Long userId);

    List<LoyaltyMembership> findByTier(LoyaltyMembership.MembershipTier tier);

    List<LoyaltyMembership> findByIsActiveTrue();
}
