package com.coffeeshop.loyalty.repository;

import com.coffeeshop.loyalty.entity.PointsTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointsTransactionRepository extends JpaRepository<PointsTransaction, Long> {
    List<PointsTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<PointsTransaction> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<PointsTransaction> findByUserIdAndType(Long userId, PointsTransaction.TransactionType type);
}
