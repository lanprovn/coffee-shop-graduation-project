package com.coffeeshop.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CoffeeShopException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus httpStatus;

    public CoffeeShopException(String message, String errorCode, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    public CoffeeShopException(String message, String errorCode) {
        this(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public CoffeeShopException(String message) {
        this(message, "INTERNAL_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}