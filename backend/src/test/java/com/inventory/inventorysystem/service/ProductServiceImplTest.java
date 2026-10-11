package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.config.InventoryMapper;
import com.inventory.inventorysystem.dto.ProductRequest;
import com.inventory.inventorysystem.dto.ProductResponse;
import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.exception.DuplicateResourceException;
import com.inventory.inventorysystem.repository.ProductRepository;
import com.inventory.inventorysystem.repository.StockMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private StockMovementRepository stockMovementRepository;

    @Spy
    private InventoryMapper mapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private ProductRequest request;
    private Product product;

    @BeforeEach
    void setUp() {
        request = ProductRequest.builder()
                .name("Test Product")
                .sku("TP-001")
                .category("Testing")
                .price(new BigDecimal("19.99"))
                .quantity(100)
                .reorderLevel(10)
                .build();

        product = Product.builder()
                .id(1L)
                .name("Test Product")
                .sku("TP-001")
                .category("Testing")
                .price(new BigDecimal("19.99"))
                .quantity(100)
                .reorderLevel(10)
                .build();
    }

    @Test
    void createProduct_success() {
        when(productRepository.existsBySku("TP-001")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.createProduct(request);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Test Product");
        assertThat(response.getSku()).isEqualTo("TP-001");
        assertThat(response.getQuantity()).isEqualTo(100);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void createProduct_duplicateSku_throwsException() {
        when(productRepository.existsBySku("TP-001")).thenReturn(true);

        assertThatThrownBy(() -> productService.createProduct(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("TP-001");

        verify(productRepository, never()).save(any());
    }

    @Test
    void getProductById_success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponse response = productService.getProductById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getSku()).isEqualTo("TP-001");
    }

    @Test
    void updateProduct_duplicateSku_throwsException() {
        Product existing = Product.builder()
                .id(1L)
                .name("Old")
                .sku("OLD-001")
                .category("Testing")
                .price(new BigDecimal("10.00"))
                .quantity(50)
                .reorderLevel(5)
                .build();

        ProductRequest updateRequest = ProductRequest.builder()
                .name("Updated")
                .sku("TP-001")
                .category("Testing")
                .price(new BigDecimal("29.99"))
                .quantity(50)
                .reorderLevel(5)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.existsBySku("TP-001")).thenReturn(true);

        assertThatThrownBy(() -> productService.updateProduct(1L, updateRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("TP-001");
    }
}
