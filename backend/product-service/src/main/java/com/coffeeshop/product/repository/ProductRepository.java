package com.coffeeshop.product.repository;

import com.coffeeshop.product.entity.Category;
import com.coffeeshop.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryIdAndIsAvailableTrue(Long categoryId);

    List<Product> findByTypeAndIsAvailableTrue(Product.ProductType type);

    List<Product> findByIsFeaturedTrueAndIsAvailableTrue();

    Page<Product> findByIsAvailableTrue(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.minStockLevel")
    List<Product> findLowStockProducts();
}
