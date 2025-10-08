package com.coffeeshop.loyalty.repository;

import com.coffeeshop.loyalty.entity.VoucherUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, Long> {
    List<VoucherUsage> findByUserId(Long userId);

    List<VoucherUsage> findByVoucherId(Long voucherId);

    boolean existsByUserIdAndVoucherId(Long userId, Long voucherId);

    boolean existsByOrderIdAndVoucherId(Long orderId, Long voucherId);
}
