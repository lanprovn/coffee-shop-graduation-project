package com.coffeeshop.loyalty.service;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.shared.exception.CoffeeShopException;
import com.coffeeshop.loyalty.dto.*;
import com.coffeeshop.loyalty.entity.*;
import com.coffeeshop.loyalty.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LoyaltyService {

    private final LoyaltyMembershipRepository membershipRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherUsageRepository voucherUsageRepository;
    private final PointsTransactionRepository pointsTransactionRepository;

    // Membership methods
    public ApiResponse<LoyaltyMembershipDto> createMembership(Long userId) {
        if (membershipRepository.findByUserId(userId).isPresent()) {
            throw new CoffeeShopException("User already has a loyalty membership", "MEMBERSHIP_EXISTS",
                    HttpStatus.BAD_REQUEST);
        }

        LoyaltyMembership membership = new LoyaltyMembership();
        membership.setUserId(userId);
        membership.setTier(LoyaltyMembership.MembershipTier.BRONZE);
        membership.setPointsBalance(0);
        membership.setTotalPointsEarned(0);
        membership.setTotalPointsRedeemed(0);
        membership.setTotalSpent(BigDecimal.ZERO);
        membership.setVisitCount(0);
        membership.setActive(true);

        LoyaltyMembership savedMembership = membershipRepository.save(membership);
        log.info("Loyalty membership created for user: {}", userId);

        return ApiResponse.success("Membership created successfully", convertToMembershipDto(savedMembership));
    }

    public ApiResponse<LoyaltyMembershipDto> getMembership(Long userId) {
        LoyaltyMembership membership = membershipRepository.findByUserId(userId)
                .orElseThrow(() -> new CoffeeShopException("Membership not found", "MEMBERSHIP_NOT_FOUND",
                        HttpStatus.NOT_FOUND));

        return ApiResponse.success(convertToMembershipDto(membership));
    }

    public ApiResponse<LoyaltyMembershipDto> earnPoints(EarnPointsRequestDto request) {
        LoyaltyMembership membership = membershipRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new CoffeeShopException("Membership not found", "MEMBERSHIP_NOT_FOUND",
                        HttpStatus.NOT_FOUND));

        // Calculate points based on tier multiplier
        int pointsToEarn = (int) (request.getAmount().doubleValue() * membership.getTier().getPointsMultiplier() * 100);

        membership.setPointsBalance(membership.getPointsBalance() + pointsToEarn);
        membership.setTotalPointsEarned(membership.getTotalPointsEarned() + pointsToEarn);
        membership.setTotalSpent(membership.getTotalSpent().add(request.getAmount()));
        membership.setVisitCount(membership.getVisitCount() + 1);
        membership.setLastVisitAt(LocalDateTime.now());

        // Check for tier upgrade
        LoyaltyMembership.MembershipTier newTier = calculateTier(membership.getTotalPointsEarned());
        if (newTier != membership.getTier()) {
            membership.setTier(newTier);
            log.info("User {} upgraded to {} tier", request.getUserId(), newTier);
        }

        LoyaltyMembership savedMembership = membershipRepository.save(membership);

        // Create points transaction record
        PointsTransaction transaction = new PointsTransaction();
        transaction.setUserId(request.getUserId());
        transaction.setType(PointsTransaction.TransactionType.EARNED);
        transaction.setPoints(pointsToEarn);
        transaction.setOrderId(request.getOrderId());
        transaction.setDescription(
                request.getDescription() != null ? request.getDescription() : "Points earned from purchase");
        transaction.setAmount(request.getAmount());
        pointsTransactionRepository.save(transaction);

        log.info("Points earned: {} for user: {}", pointsToEarn, request.getUserId());
        return ApiResponse.success("Points earned successfully", convertToMembershipDto(savedMembership));
    }

    public ApiResponse<LoyaltyMembershipDto> redeemPoints(RedeemPointsRequestDto request) {
        LoyaltyMembership membership = membershipRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new CoffeeShopException("Membership not found", "MEMBERSHIP_NOT_FOUND",
                        HttpStatus.NOT_FOUND));

        if (membership.getPointsBalance() < request.getPoints()) {
            throw new CoffeeShopException("Insufficient points balance", "INSUFFICIENT_POINTS", HttpStatus.BAD_REQUEST);
        }

        membership.setPointsBalance(membership.getPointsBalance() - request.getPoints());
        membership.setTotalPointsRedeemed(membership.getTotalPointsRedeemed() + request.getPoints());

        LoyaltyMembership savedMembership = membershipRepository.save(membership);

        // Create points transaction record
        PointsTransaction transaction = new PointsTransaction();
        transaction.setUserId(request.getUserId());
        transaction.setType(PointsTransaction.TransactionType.REDEEMED);
        transaction.setPoints(-request.getPoints());
        transaction.setDescription(request.getDescription() != null ? request.getDescription() : "Points redeemed");
        pointsTransactionRepository.save(transaction);

        log.info("Points redeemed: {} for user: {}", request.getPoints(), request.getUserId());
        return ApiResponse.success("Points redeemed successfully", convertToMembershipDto(savedMembership));
    }

    // Voucher methods
    public ApiResponse<VoucherDto> createVoucher(VoucherDto voucherDto) {
        if (voucherRepository.findByCode(voucherDto.getCode()).isPresent()) {
            throw new CoffeeShopException("Voucher code already exists", "VOUCHER_CODE_EXISTS", HttpStatus.BAD_REQUEST);
        }

        Voucher voucher = new Voucher();
        voucher.setCode(voucherDto.getCode());
        voucher.setName(voucherDto.getName());
        voucher.setDescription(voucherDto.getDescription());
        voucher.setType(voucherDto.getType());
        voucher.setDiscountValue(voucherDto.getDiscountValue());
        voucher.setDiscountPercentage(voucherDto.getDiscountPercentage());
        voucher.setMinimumOrderAmount(voucherDto.getMinimumOrderAmount());
        voucher.setMaximumDiscountAmount(voucherDto.getMaximumDiscountAmount());
        voucher.setUsageLimit(voucherDto.getUsageLimit());
        voucher.setUsedCount(0);
        voucher.setActive(true);
        voucher.setValidFrom(voucherDto.getValidFrom() != null ? LocalDateTime.parse(voucherDto.getValidFrom())
                : LocalDateTime.now());
        voucher.setValidUntil(voucherDto.getValidUntil() != null ? LocalDateTime.parse(voucherDto.getValidUntil())
                : LocalDateTime.now().plusMonths(1));

        Voucher savedVoucher = voucherRepository.save(voucher);
        log.info("Voucher created: {}", savedVoucher.getCode());

        return ApiResponse.success("Voucher created successfully", convertToVoucherDto(savedVoucher));
    }

    public ApiResponse<VoucherDto> getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(
                        () -> new CoffeeShopException("Voucher not found", "VOUCHER_NOT_FOUND", HttpStatus.NOT_FOUND));

        return ApiResponse.success(convertToVoucherDto(voucher));
    }

    public ApiResponse<List<VoucherDto>> getAvailableVouchers() {
        List<Voucher> vouchers = voucherRepository.findAvailableVouchers(LocalDateTime.now());
        List<VoucherDto> voucherDtos = vouchers.stream()
                .map(this::convertToVoucherDto)
                .collect(Collectors.toList());

        return ApiResponse.success(voucherDtos);
    }

    public ApiResponse<VoucherUsageDto> useVoucher(String voucherCode, Long userId, Long orderId) {
        Voucher voucher = voucherRepository.findByCode(voucherCode)
                .orElseThrow(
                        () -> new CoffeeShopException("Voucher not found", "VOUCHER_NOT_FOUND", HttpStatus.NOT_FOUND));

        if (!voucher.isActive()) {
            throw new CoffeeShopException("Voucher is not active", "VOUCHER_INACTIVE", HttpStatus.BAD_REQUEST);
        }

        LocalDateTime now = LocalDateTime.now();
        if (voucher.getValidFrom().isAfter(now) || voucher.getValidUntil().isBefore(now)) {
            throw new CoffeeShopException("Voucher is not valid at this time", "VOUCHER_EXPIRED",
                    HttpStatus.BAD_REQUEST);
        }

        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new CoffeeShopException("Voucher usage limit exceeded", "VOUCHER_LIMIT_EXCEEDED",
                    HttpStatus.BAD_REQUEST);
        }

        if (voucherUsageRepository.existsByOrderIdAndVoucherId(orderId, voucher.getId())) {
            throw new CoffeeShopException("Voucher already used for this order", "VOUCHER_ALREADY_USED",
                    HttpStatus.BAD_REQUEST);
        }

        // Create voucher usage record
        VoucherUsage usage = new VoucherUsage();
        usage.setVoucher(voucher);
        usage.setUserId(userId);
        usage.setOrderId(orderId);
        voucherUsageRepository.save(usage);

        // Update voucher usage count
        voucher.setUsedCount(voucher.getUsedCount() + 1);
        voucherRepository.save(voucher);

        log.info("Voucher used: {} by user: {} for order: {}", voucherCode, userId, orderId);
        return ApiResponse.success("Voucher used successfully", convertToVoucherUsageDto(usage));
    }

    public ApiResponse<List<PointsTransactionDto>> getPointsHistory(Long userId) {
        List<PointsTransaction> transactions = pointsTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<PointsTransactionDto> transactionDtos = transactions.stream()
                .map(this::convertToPointsTransactionDto)
                .collect(Collectors.toList());

        return ApiResponse.success(transactionDtos);
    }

    private LoyaltyMembership.MembershipTier calculateTier(int totalPoints) {
        if (totalPoints >= LoyaltyMembership.MembershipTier.PLATINUM.getRequiredPoints()) {
            return LoyaltyMembership.MembershipTier.PLATINUM;
        } else if (totalPoints >= LoyaltyMembership.MembershipTier.GOLD.getRequiredPoints()) {
            return LoyaltyMembership.MembershipTier.GOLD;
        } else if (totalPoints >= LoyaltyMembership.MembershipTier.SILVER.getRequiredPoints()) {
            return LoyaltyMembership.MembershipTier.SILVER;
        } else {
            return LoyaltyMembership.MembershipTier.BRONZE;
        }
    }

    private LoyaltyMembershipDto convertToMembershipDto(LoyaltyMembership membership) {
        LoyaltyMembershipDto dto = new LoyaltyMembershipDto();
        dto.setId(membership.getId());
        dto.setUserId(membership.getUserId());
        dto.setTier(membership.getTier());
        dto.setPointsBalance(membership.getPointsBalance());
        dto.setTotalPointsEarned(membership.getTotalPointsEarned());
        dto.setTotalPointsRedeemed(membership.getTotalPointsRedeemed());
        dto.setTotalSpent(membership.getTotalSpent());
        dto.setVisitCount(membership.getVisitCount());
        dto.setActive(membership.isActive());
        dto.setCreatedAt(membership.getCreatedAt() != null
                ? membership.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null);
        dto.setUpdatedAt(membership.getUpdatedAt() != null
                ? membership.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null);
        dto.setLastVisitAt(membership.getLastVisitAt() != null
                ? membership.getLastVisitAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null);
        return dto;
    }

    private VoucherDto convertToVoucherDto(Voucher voucher) {
        VoucherDto dto = new VoucherDto();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setName(voucher.getName());
        dto.setDescription(voucher.getDescription());
        dto.setType(voucher.getType());
        dto.setDiscountValue(voucher.getDiscountValue());
        dto.setDiscountPercentage(voucher.getDiscountPercentage());
        dto.setMinimumOrderAmount(voucher.getMinimumOrderAmount());
        dto.setMaximumDiscountAmount(voucher.getMaximumDiscountAmount());
        dto.setUsageLimit(voucher.getUsageLimit());
        dto.setUsedCount(voucher.getUsedCount());
        dto.setActive(voucher.isActive());
        dto.setValidFrom(
                voucher.getValidFrom() != null ? voucher.getValidFrom().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null);
        dto.setValidUntil(
                voucher.getValidUntil() != null ? voucher.getValidUntil().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null);
        return dto;
    }

    private VoucherUsageDto convertToVoucherUsageDto(VoucherUsage usage) {
        VoucherUsageDto dto = new VoucherUsageDto();
        dto.setId(usage.getId());
        dto.setVoucherId(usage.getVoucher().getId());
        dto.setVoucherCode(usage.getVoucher().getCode());
        dto.setUserId(usage.getUserId());
        dto.setOrderId(usage.getOrderId());
        dto.setUsedAt(
                usage.getUsedAt() != null ? usage.getUsedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        return dto;
    }

    private PointsTransactionDto convertToPointsTransactionDto(PointsTransaction transaction) {
        PointsTransactionDto dto = new PointsTransactionDto();
        dto.setId(transaction.getId());
        dto.setUserId(transaction.getUserId());
        dto.setType(transaction.getType());
        dto.setPoints(transaction.getPoints());
        dto.setOrderId(transaction.getOrderId());
        dto.setDescription(transaction.getDescription());
        dto.setAmount(transaction.getAmount());
        dto.setCreatedAt(transaction.getCreatedAt() != null
                ? transaction.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null);
        return dto;
    }
}
