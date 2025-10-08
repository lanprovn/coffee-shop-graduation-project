package com.coffeeshop.store.controller;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreById(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @GetMapping("/{id}/delivery-fee")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateDeliveryFee(
            @PathVariable Long id,
            @RequestParam String deliveryAddress) {
        return ResponseEntity.ok(storeService.calculateDeliveryFee(id, deliveryAddress));
    }

    @GetMapping("/{id}/hours")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStoreHours(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreHours(id));
    }
}
