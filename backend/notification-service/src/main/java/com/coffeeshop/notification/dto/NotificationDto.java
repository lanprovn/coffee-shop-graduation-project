package com.coffeeshop.notification.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type; // EMAIL, SMS, PUSH
    private boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
