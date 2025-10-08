package com.coffeeshop.loyalty.controller;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.loyalty.dto.*;
import com.coffeeshop.loyalty.service.LoyaltyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    // Membership endpoints
    @PostMapping("/membership")
    public ResponseEntity<ApiResponse<LoyaltyMembershipDto>> createMembership(@RequestParam Long userId) {
        return ResponseEntity.ok(loyaltyService.createMembership(userId));
    }

    @GetMapping("/membership")
    public ResponseEntity<ApiResponse<LoyaltyMembershipDto>> getMembership(@RequestParam Long userId) {
        return ResponseEntity.ok(loyaltyService.getMembership(userId));
    }

    @PostMapping("/points/earn")
    public ResponseEntity<ApiResponse<LoyaltyMembershipDto>> earnPoints(
            @Valid @RequestBody EarnPointsRequestDto request) {
        return ResponseEntity.ok(loyaltyService.earnPoints(request));
    }

    @PostMapping("/points/redeem")
    public ResponseEntity<ApiResponse<LoyaltyMembershipDto>> redeemPoints(
            @Valid @RequestBody RedeemPointsRequestDto request) {
        return ResponseEntity.ok(loyaltyService.redeemPoints(request));
    }

    @GetMapping("/points/history")
    public ResponseEntity<ApiResponse<List<PointsTransactionDto>>> getPointsHistory(@RequestParam Long userId) {
        return ResponseEntity.ok(loyaltyService.getPointsHistory(userId));
    }

    // Voucher endpoints
    @PostMapping("/vouchers")
    public ResponseEntity<ApiResponse<VoucherDto>> createVoucher(@Valid @RequestBody VoucherDto voucherDto) {
        return ResponseEntity.ok(loyaltyService.createVoucher(voucherDto));
    }

    @GetMapping("/vouchers/{code}")
    public ResponseEntity<ApiResponse<VoucherDto>> getVoucherByCode(@PathVariable String code) {
        return ResponseEntity.ok(loyaltyService.getVoucherByCode(code));
    }

    @GetMapping("/vouchers/available")
    public ResponseEntity<ApiResponse<List<VoucherDto>>> getAvailableVouchers() {
        return ResponseEntity.ok(loyaltyService.getAvailableVouchers());
    }

    @PostMapping("/vouchers/{code}/use")
    public ResponseEntity<ApiResponse<VoucherUsageDto>> useVoucher(
            @PathVariable String code,
            @RequestParam Long userId,
            @RequestParam Long orderId) {
        return ResponseEntity.ok(loyaltyService.useVoucher(code, userId, orderId));
    }
}
