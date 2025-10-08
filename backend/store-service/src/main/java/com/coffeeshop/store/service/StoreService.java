package com.coffeeshop.store.service;

import com.coffeeshop.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreService {

    public ApiResponse<List<Map<String, Object>>> getAllStores() {
        // Mock store data
        List<Map<String, Object>> stores = List.of(
                Map.of(
                        "id", 1L,
                        "name", "Coffee Shop Downtown",
                        "address", "123 Main Street, Yangon",
                        "phone", "+95-1-234-5678",
                        "latitude", 16.8661,
                        "longitude", 96.1951,
                        "isOpen", true,
                        "deliveryFee", new BigDecimal("2000.00"),
                        "deliveryRadius", 5.0),
                Map.of(
                        "id", 2L,
                        "name", "Coffee Shop Junction City",
                        "address", "Junction City Mall, Yangon",
                        "phone", "+95-1-234-5679",
                        "latitude", 16.8661,
                        "longitude", 96.1951,
                        "isOpen", true,
                        "deliveryFee", new BigDecimal("1500.00"),
                        "deliveryRadius", 3.0));

        return ApiResponse.success(stores);
    }

    public ApiResponse<Map<String, Object>> getStoreById(Long id) {
        Map<String, Object> store = new HashMap<>();
        store.put("id", id);
        store.put("name", "Coffee Shop Downtown");
        store.put("address", "123 Main Street, Yangon");
        store.put("phone", "+95-1-234-5678");
        store.put("latitude", 16.8661);
        store.put("longitude", 96.1951);
        store.put("isOpen", true);
        store.put("deliveryFee", new BigDecimal("2000.00"));
        store.put("deliveryRadius", 5.0);

        return ApiResponse.success(store);
    }

    public ApiResponse<Map<String, Object>> calculateDeliveryFee(Long storeId, String deliveryAddress) {
        Map<String, Object> result = new HashMap<>();
        result.put("storeId", storeId);
        result.put("deliveryAddress", deliveryAddress);
        result.put("deliveryFee", new BigDecimal("2000.00"));
        result.put("estimatedDeliveryTime", "30-45 minutes");
        result.put("isDeliverable", true);

        return ApiResponse.success(result);
    }

    public ApiResponse<List<Map<String, Object>>> getStoreHours(Long storeId) {
        List<Map<String, Object>> hours = List.of(
                Map.of("day", "Monday", "openTime", "06:00", "closeTime", "22:00"),
                Map.of("day", "Tuesday", "openTime", "06:00", "closeTime", "22:00"),
                Map.of("day", "Wednesday", "openTime", "06:00", "closeTime", "22:00"),
                Map.of("day", "Thursday", "openTime", "06:00", "closeTime", "22:00"),
                Map.of("day", "Friday", "openTime", "06:00", "closeTime", "23:00"),
                Map.of("day", "Saturday", "openTime", "07:00", "closeTime", "23:00"),
                Map.of("day", "Sunday", "openTime", "07:00", "closeTime", "21:00"));

        return ApiResponse.success(hours);
    }
}
