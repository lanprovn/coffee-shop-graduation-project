package com.coffeeshop.order.dto;

import lombok.Data;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Boolean isAvailable;
    private Long categoryId;
}
