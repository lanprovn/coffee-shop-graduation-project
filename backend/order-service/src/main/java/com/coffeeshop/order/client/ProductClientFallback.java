package com.coffeeshop.order.client;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.order.dto.ProductDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ProductClientFallback implements ProductClient {

    @Override
    public ApiResponse<ProductDto> getProductById(Long id) {
        log.warn("ProductClient fallback triggered for product ID: {}", id);

        // Return a default product or error response
        ProductDto fallbackProduct = new ProductDto();
        fallbackProduct.setId(id);
        fallbackProduct.setName("Product temporarily unavailable");
        fallbackProduct.setPrice(0.0);
        fallbackProduct.setIsAvailable(false);

        return ApiResponse.error("Product service is temporarily unavailable", "PRODUCT_SERVICE_DOWN");
    }
}
