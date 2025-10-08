package com.coffeeshop.notification.listener;

import com.coffeeshop.notification.dto.NotificationDto;
import com.coffeeshop.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "order.created.queue")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received order created event: {}", event.getOrderNumber());

        try {
            // Create notification for order confirmation
            NotificationDto notification = new NotificationDto();
            notification.setUserId(event.getUserId());
            notification.setTitle("Order Confirmation");
            notification.setMessage(String.format(
                    "Your order #%s has been confirmed. Total amount: $%.2f",
                    event.getOrderNumber(),
                    event.getTotalAmount()));
            notification.setType("EMAIL");
            notification.setRead(false);

            notificationService.createNotification(notification);

            log.info("Order confirmation notification sent for order: {}", event.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to send order confirmation notification: {}", e.getMessage(), e);
        }
    }

    // Inner class for OrderCreatedEvent (should be in shared module in real
    // implementation)
    public static class OrderCreatedEvent {
        private Long orderId;
        private String orderNumber;
        private Long userId;
        private Double totalAmount;
        private String orderType;
        private String createdAt;

        // Getters and setters
        public Long getOrderId() {
            return orderId;
        }

        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }

        public String getOrderNumber() {
            return orderNumber;
        }

        public void setOrderNumber(String orderNumber) {
            this.orderNumber = orderNumber;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Double getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(Double totalAmount) {
            this.totalAmount = totalAmount;
        }

        public String getOrderType() {
            return orderType;
        }

        public void setOrderType(String orderType) {
            this.orderType = orderType;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }
    }
}
