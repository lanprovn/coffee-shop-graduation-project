package com.coffeeshop.product.service;

import com.coffeeshop.shared.dto.ApiResponse;
import com.coffeeshop.shared.exception.CoffeeShopException;
import com.coffeeshop.product.dto.CategoryDto;
import com.coffeeshop.product.dto.ProductDto;
import com.coffeeshop.product.entity.Category;
import com.coffeeshop.product.entity.Product;
import com.coffeeshop.product.repository.CategoryRepository;
import com.coffeeshop.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // Product methods
    public ApiResponse<ProductDto> createProduct(ProductDto productDto) {
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new CoffeeShopException("Category not found", "CATEGORY_NOT_FOUND",
                        HttpStatus.NOT_FOUND));

        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImageUrl(productDto.getImageUrl());
        product.setType(productDto.getType());
        product.setSize(productDto.getSize());
        product.setAvailable(productDto.isAvailable());
        product.setFeatured(productDto.isFeatured());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setMinStockLevel(productDto.getMinStockLevel());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);
        log.info("Product created: {}", savedProduct.getName());

        return ApiResponse.success("Product created successfully", convertToDto(savedProduct));
    }

    public ApiResponse<ProductDto> getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(
                        () -> new CoffeeShopException("Product not found", "PRODUCT_NOT_FOUND", HttpStatus.NOT_FOUND));

        return ApiResponse.success(convertToDto(product));
    }

    public ApiResponse<Page<ProductDto>> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsAvailableTrue(pageable);
        Page<ProductDto> productDtos = products.map(this::convertToDto);
        return ApiResponse.success(productDtos);
    }

    public ApiResponse<List<ProductDto>> getProductsByCategory(Long categoryId) {
        List<Product> products = productRepository.findByCategoryIdAndIsAvailableTrue(categoryId);
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ApiResponse.success(productDtos);
    }

    public ApiResponse<List<ProductDto>> getProductsByType(Product.ProductType type) {
        List<Product> products = productRepository.findByTypeAndIsAvailableTrue(type);
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ApiResponse.success(productDtos);
    }

    public ApiResponse<List<ProductDto>> getFeaturedProducts() {
        List<Product> products = productRepository.findByIsFeaturedTrueAndIsAvailableTrue();
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ApiResponse.success(productDtos);
    }

    public ApiResponse<Page<ProductDto>> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.searchProducts(keyword, pageable);
        Page<ProductDto> productDtos = products.map(this::convertToDto);
        return ApiResponse.success(productDtos);
    }

    // Category methods
    public ApiResponse<CategoryDto> createCategory(CategoryDto categoryDto) {
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new CoffeeShopException("Category name already exists", "CATEGORY_EXISTS", HttpStatus.BAD_REQUEST);
        }

        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setImageUrl(categoryDto.getImageUrl());
        category.setActive(true);

        Category savedCategory = categoryRepository.save(category);
        log.info("Category created: {}", savedCategory.getName());

        return ApiResponse.success("Category created successfully", convertToDto(savedCategory));
    }

    public ApiResponse<List<CategoryDto>> getAllCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrue();
        List<CategoryDto> categoryDtos = categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ApiResponse.success(categoryDtos);
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setType(product.getType());
        dto.setSize(product.getSize());
        dto.setAvailable(product.isAvailable());
        dto.setFeatured(product.isFeatured());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setMinStockLevel(product.getMinStockLevel());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        return dto;
    }

    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        dto.setActive(category.isActive());
        return dto;
    }
}
