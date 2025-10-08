package com.coffeeshop.order.repository;

import com.coffeeshop.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartUserId(Long userId);

    Optional<CartItem> findByCartUserIdAndProductId(Long userId, Long productId);

    void deleteByCartUserId(Long userId);

    void deleteByCartId(Long cartId);
}
