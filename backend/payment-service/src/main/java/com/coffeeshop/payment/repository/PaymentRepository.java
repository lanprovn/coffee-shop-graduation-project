package com.coffeeshop.payment.repository;

import com.coffeeshop.payment.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentId(String paymentId);

    List<Payment> findByOrderId(Long orderId);

    List<Payment> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Payment> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Payment> findByStatus(Payment.PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.createdAt < :beforeDate")
    List<Payment> findPendingPaymentsBefore(@Param("status") Payment.PaymentStatus status,
            @Param("beforeDate") java.time.LocalDateTime beforeDate);
}
