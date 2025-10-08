package com.coffeeshop.loyalty.repository;

import com.coffeeshop.loyalty.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByCode(String code);

    List<Voucher> findByIsActiveTrue();

    List<Voucher> findByIsActiveTrueAndValidFromBeforeAndValidUntilAfter(LocalDateTime now, LocalDateTime now2);

    @Query("SELECT v FROM Voucher v WHERE v.isActive = true AND v.validFrom <= :now AND v.validUntil >= :now AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit)")
    List<Voucher> findAvailableVouchers(@Param("now") LocalDateTime now);
}
