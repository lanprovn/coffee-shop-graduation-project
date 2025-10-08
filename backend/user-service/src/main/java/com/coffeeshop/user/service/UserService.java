package com.coffeeshop.user.service;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.shared.exception.CoffeeShopException;
import com.coffeeshop.shared.util.JwtUtil;
import com.coffeeshop.user.dto.LoginRequest;
import com.coffeeshop.user.dto.LoginResponse;
import com.coffeeshop.user.dto.UserDto;
import com.coffeeshop.user.dto.UserRegistrationDto;
import com.coffeeshop.user.entity.User;
import com.coffeeshop.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public ApiResponse<UserDto> register(UserRegistrationDto registrationDto) {
        // Check if username already exists
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new CoffeeShopException("Username already exists", "USERNAME_EXISTS", HttpStatus.BAD_REQUEST);
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new CoffeeShopException("Email already exists", "EMAIL_EXISTS", HttpStatus.BAD_REQUEST);
        }

        // Create new user
        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        user.setGender(registrationDto.getGender());
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());

        return ApiResponse.success("User registered successfully", convertToDto(savedUser));
    }

    public ApiResponse<LoginResponse> login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isEmpty()) {
            throw new CoffeeShopException("Invalid username or password", "INVALID_CREDENTIALS",
                    HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new CoffeeShopException("Invalid username or password", "INVALID_CREDENTIALS",
                    HttpStatus.UNAUTHORIZED);
        }

        if (!user.isActive()) {
            throw new CoffeeShopException("Account is deactivated", "ACCOUNT_DEACTIVATED", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generateToken(user.getUsername());
        UserDto userDto = convertToDto(user);
        LoginResponse loginResponse = new LoginResponse(token, userDto);

        log.info("User logged in successfully: {}", user.getUsername());
        return ApiResponse.success("Login successful", loginResponse);
    }

    public ApiResponse<UserDto> getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            throw new CoffeeShopException("User not found", "USER_NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        return ApiResponse.success(convertToDto(userOptional.get()));
    }

    public ApiResponse<UserDto> getUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            throw new CoffeeShopException("User not found", "USER_NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        return ApiResponse.success(convertToDto(userOptional.get()));
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setDateOfBirth(user.getDateOfBirth());
        userDto.setGender(user.getGender());
        userDto.setRole(user.getRole());
        userDto.setActive(user.isActive());
        userDto.setEmailVerified(user.isEmailVerified());
        userDto.setPhoneVerified(user.isPhoneVerified());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setUpdatedAt(user.getUpdatedAt());
        return userDto;
    }
}
