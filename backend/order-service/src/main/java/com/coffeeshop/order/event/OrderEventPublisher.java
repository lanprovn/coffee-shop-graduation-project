package com.coffeeshop.order.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${spring.rabbitmq.exchange:order.exchange}")
    private String exchange;

    @Value("${spring.rabbitmq.routing-key.order-created:order.created}")
    private String orderCreatedRoutingKey;

    public void publishOrderCreated(OrderCreatedEvent event) {
        try {
            log.info("Publishing order created event for order: {}", event.getOrderNumber());
            rabbitTemplate.convertAndSend(exchange, orderCreatedRoutingKey, event);
            log.info("Order created event published successfully");
        } catch (Exception e) {
            log.error("Failed to publish order created event: {}", e.getMessage(), e);
        }
    }
}
