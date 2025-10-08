package com.coffeeshop.order.client;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.order.dto.ProductDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", fallback = ProductClientFallback.class)
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    @CircuitBreaker(name = "product-service", fallbackMethod = "getProductByIdFallback")
    @Retry(name = "product-service")
    ApiResponse<ProductDto> getProductById(@PathVariable Long id);
}
