package com.coffeeshop.product.dto;

import com.coffeeshop.product.entity.Product;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "Product type is required")
    private Product.ProductType type;

    private Product.ProductSize size;

    private boolean isAvailable;
    private boolean isFeatured;
    private Integer stockQuantity;
    private Integer minStockLevel;
    private Long categoryId;
    private String categoryName;
}
