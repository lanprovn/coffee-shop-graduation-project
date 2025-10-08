package com.coffeeshop.order.service;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.shared.exception.CoffeeShopException;
import com.coffeeshop.order.client.ProductClient;
import com.coffeeshop.order.dto.*;
import com.coffeeshop.order.entity.*;
import com.coffeeshop.order.event.OrderCreatedEvent;
import com.coffeeshop.order.event.OrderEventPublisher;
import com.coffeeshop.order.repository.*;
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
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductClient productClient;
    private final OrderEventPublisher orderEventPublisher;

    // Cart methods
    public ApiResponse<CartDto> getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));

        return ApiResponse.success(convertToCartDto(cart));
    }

    public ApiResponse<CartDto> addToCart(Long userId, CartItemDto cartItemDto) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));

        // Verify product exists
        ApiResponse<ProductDto> productResponse = productClient.getProductById(cartItemDto.getProductId());
        if (!productResponse.isSuccess()) {
            throw new CoffeeShopException("Product not found", "PRODUCT_NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        ProductDto product = productResponse.getData();

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartUserIdAndProductId(userId,
                cartItemDto.getProductId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItemDto.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProductId(cartItemDto.getProductId());
            cartItem.setProductName(product.getName());
            cartItem.setProductPrice(BigDecimal.valueOf(product.getPrice()));
            cartItem.setQuantity(cartItemDto.getQuantity());
            cartItem.setSpecialInstructions(cartItemDto.getSpecialInstructions());
            cartItemRepository.save(cartItem);
        }

        Cart updatedCart = cartRepository.findByUserId(userId).orElse(cart);
        log.info("Item added to cart for user: {}", userId);

        return ApiResponse.success("Item added to cart", convertToCartDto(updatedCart));
    }

    public ApiResponse<CartDto> removeFromCart(Long userId, Long productId) {
        cartItemRepository.findByCartUserIdAndProductId(userId, productId)
                .ifPresent(cartItemRepository::delete);

        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        log.info("Item removed from cart for user: {}", userId);

        return ApiResponse.success("Item removed from cart", cart != null ? convertToCartDto(cart) : null);
    }

    public ApiResponse<CartDto> clearCart(Long userId) {
        cartItemRepository.deleteByCartUserId(userId);
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        log.info("Cart cleared for user: {}", userId);

        return ApiResponse.success("Cart cleared", cart != null ? convertToCartDto(cart) : null);
    }

    // Order methods
    public ApiResponse<OrderDto> createOrder(Long userId, OrderDto orderDto) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CoffeeShopException("Cart is empty", "EMPTY_CART", HttpStatus.BAD_REQUEST));

        List<CartItem> cartItems = cartItemRepository.findByCartUserId(userId);
        if (cartItems.isEmpty()) {
            throw new CoffeeShopException("Cart is empty", "EMPTY_CART", HttpStatus.BAD_REQUEST);
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUserId(userId);
        order.setType(orderDto.getType());
        order.setDeliveryAddress(orderDto.getDeliveryAddress());
        order.setDeliveryPhone(orderDto.getDeliveryPhone());
        order.setNotes(orderDto.getNotes());
        order.setStatus(Order.OrderStatus.PENDING);

        // Calculate totals
        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setSubtotal(subtotal);
        order.setTaxAmount(subtotal.multiply(BigDecimal.valueOf(0.1))); // 10% tax
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setDeliveryFee(orderDto.getDeliveryFee() != null ? orderDto.getDeliveryFee() : BigDecimal.ZERO);

        BigDecimal totalAmount = subtotal.add(order.getTaxAmount()).add(order.getDeliveryFee())
                .subtract(order.getDiscountAmount());
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Convert cart items to order items
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrder);
                    orderItem.setProductId(cartItem.getProductId());
                    orderItem.setProductName(cartItem.getProductName());
                    orderItem.setProductPrice(cartItem.getProductPrice());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setTotalPrice(
                            cartItem.getProductPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
                    orderItem.setSpecialInstructions(cartItem.getSpecialInstructions());
                    return orderItem;
                })
                .collect(Collectors.toList());

        savedOrder.setOrderItems(orderItems);
        orderRepository.save(savedOrder);

        // Clear cart after order creation
        cartItemRepository.deleteByCartUserId(userId);

        // Publish order created event
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(savedOrder.getId());
        event.setOrderNumber(savedOrder.getOrderNumber());
        event.setUserId(userId);
        event.setTotalAmount(savedOrder.getTotalAmount());
        event.setOrderType(savedOrder.getType().toString());
        event.setCreatedAt(savedOrder.getCreatedAt());
        event.setOrderItems(orderItems.stream()
                .map(item -> new OrderCreatedEvent.OrderItemEvent(
                        item.getProductId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getProductPrice()))
                .collect(Collectors.toList()));

        orderEventPublisher.publishOrderCreated(event);

        log.info("Order created: {}", savedOrder.getOrderNumber());
        return ApiResponse.success("Order created successfully", convertToOrderDto(savedOrder));
    }

    public ApiResponse<OrderDto> getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CoffeeShopException("Order not found", "ORDER_NOT_FOUND", HttpStatus.NOT_FOUND));

        return ApiResponse.success(convertToOrderDto(order));
    }

    public ApiResponse<List<OrderDto>> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<OrderDto> orderDtos = orders.stream()
                .map(this::convertToOrderDto)
                .collect(Collectors.toList());

        return ApiResponse.success(orderDtos);
    }

    public ApiResponse<Page<OrderDto>> getUserOrders(Long userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        Page<OrderDto> orderDtos = orders.map(this::convertToOrderDto);

        return ApiResponse.success(orderDtos);
    }

    public ApiResponse<OrderDto> updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CoffeeShopException("Order not found", "ORDER_NOT_FOUND", HttpStatus.NOT_FOUND));

        order.setStatus(status);
        if (status == Order.OrderStatus.DELIVERED) {
            order.setCompletedAt(LocalDateTime.now());
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Order status updated: {} to {}", order.getOrderNumber(), status);

        return ApiResponse.success("Order status updated", convertToOrderDto(savedOrder));
    }

    private Cart createNewCart(Long userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        return cartRepository.save(cart);
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private CartDto convertToCartDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUserId());
        dto.setCartItems(cart.getCartItems().stream()
                .map(this::convertToCartItemDto)
                .collect(Collectors.toList()));
        dto.setCreatedAt(
                cart.getCreatedAt() != null ? cart.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        dto.setUpdatedAt(
                cart.getUpdatedAt() != null ? cart.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        return dto;
    }

    private CartItemDto convertToCartItemDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setProductId(cartItem.getProductId());
        dto.setProductName(cartItem.getProductName());
        dto.setProductPrice(cartItem.getProductPrice());
        dto.setQuantity(cartItem.getQuantity());
        dto.setSpecialInstructions(cartItem.getSpecialInstructions());
        return dto;
    }

    private OrderDto convertToOrderDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUserId());
        dto.setStatus(order.getStatus());
        dto.setType(order.getType());
        dto.setSubtotal(order.getSubtotal());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryPhone(order.getDeliveryPhone());
        dto.setNotes(order.getNotes());
        dto.setOrderItems(order.getOrderItems().stream()
                .map(this::convertToOrderItemDto)
                .collect(Collectors.toList()));
        dto.setCreatedAt(
                order.getCreatedAt() != null ? order.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null);
        dto.setUpdatedAt(
                order.getUpdatedAt() != null ? order.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null);
        dto.setCompletedAt(
                order.getCompletedAt() != null ? order.getCompletedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null);
        return dto;
    }

    private OrderItemDto convertToOrderItemDto(OrderItem orderItem) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setProductId(orderItem.getProductId());
        dto.setProductName(orderItem.getProductName());
        dto.setProductPrice(orderItem.getProductPrice());
        dto.setQuantity(orderItem.getQuantity());
        dto.setTotalPrice(orderItem.getTotalPrice());
        dto.setSpecialInstructions(orderItem.getSpecialInstructions());
        return dto;
    }
}
