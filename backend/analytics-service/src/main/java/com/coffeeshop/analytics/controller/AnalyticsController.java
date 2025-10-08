package com.coffeeshop.analytics.controller;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/sales")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesReport(@RequestParam String period) {
        return ResponseEntity.ok(analyticsService.getSalesReport(period));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomerAnalytics() {
        return ResponseEntity.ok(analyticsService.getCustomerAnalytics());
    }
}
