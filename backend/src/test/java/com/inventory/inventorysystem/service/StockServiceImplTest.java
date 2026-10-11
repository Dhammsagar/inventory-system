package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.config.InventoryMapper;
import com.inventory.inventorysystem.dto.ProductResponse;
import com.inventory.inventorysystem.dto.StockUpdateRequest;
import com.inventory.inventorysystem.entity.MovementType;
import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.entity.StockMovement;
import com.inventory.inventorysystem.exception.InsufficientStockException;
import com.inventory.inventorysystem.repository.ProductRepository;
import com.inventory.inventorysystem.repository.StockMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
class StockServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private StockMovementRepository stockMovementRepository;

    @Spy
    private InventoryMapper mapper;

    @InjectMocks
    private StockServiceImpl stockService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = Product.builder()
                .id(1L)
                .name("Test Product")
                .sku("TP-001")
                .category("Testing")
                .price(new BigDecimal("19.99"))
                .quantity(50)
                .reorderLevel(10)
                .build();
    }

    @Test
    void stockIn_increasesQuantity() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));
        when(stockMovementRepository.save(any(StockMovement.class))).thenAnswer(i -> i.getArgument(0));

        StockUpdateRequest request = StockUpdateRequest.builder()
                .type(MovementType.IN)
                .quantity(30)
                .note("Restock")
                .build();

        ProductResponse response = stockService.updateStock(1L, request);

        assertThat(response.getQuantity()).isEqualTo(80);

        ArgumentCaptor<StockMovement> captor = ArgumentCaptor.forClass(StockMovement.class);
        verify(stockMovementRepository).save(captor.capture());
        StockMovement saved = captor.getValue();
        assertThat(saved.getPreviousStock()).isEqualTo(50);
        assertThat(saved.getNewStock()).isEqualTo(80);
        assertThat(saved.getType()).isEqualTo(MovementType.IN);
    }

    @Test
    void stockOut_decreasesQuantity() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));
        when(stockMovementRepository.save(any(StockMovement.class))).thenAnswer(i -> i.getArgument(0));

        StockUpdateRequest request = StockUpdateRequest.builder()
                .type(MovementType.OUT)
                .quantity(20)
                .note("Sold")
                .build();

        ProductResponse response = stockService.updateStock(1L, request);

        assertThat(response.getQuantity()).isEqualTo(30);

        ArgumentCaptor<StockMovement> captor = ArgumentCaptor.forClass(StockMovement.class);
        verify(stockMovementRepository).save(captor.capture());
        StockMovement saved = captor.getValue();
        assertThat(saved.getPreviousStock()).isEqualTo(50);
        assertThat(saved.getNewStock()).isEqualTo(30);
        assertThat(saved.getType()).isEqualTo(MovementType.OUT);
    }

    @Test
    void stockOut_insufficientStock_throwsException() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        StockUpdateRequest request = StockUpdateRequest.builder()
                .type(MovementType.OUT)
                .quantity(100)
                .note("Too many")
                .build();

        assertThatThrownBy(() -> stockService.updateStock(1L, request))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Test Product")
                .hasMessageContaining("100")
                .hasMessageContaining("50");

        verify(productRepository, never()).save(any());
        verify(stockMovementRepository, never()).save(any());
    }

    @Test
    void adjustment_setsExactQuantity() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));
        when(stockMovementRepository.save(any(StockMovement.class))).thenAnswer(i -> i.getArgument(0));

        StockUpdateRequest request = StockUpdateRequest.builder()
                .type(MovementType.ADJUSTMENT)
                .quantity(75)
                .note("Inventory count correction")
                .build();

        ProductResponse response = stockService.updateStock(1L, request);

        assertThat(response.getQuantity()).isEqualTo(75);

        ArgumentCaptor<StockMovement> captor = ArgumentCaptor.forClass(StockMovement.class);
        verify(stockMovementRepository).save(captor.capture());
        StockMovement saved = captor.getValue();
        assertThat(saved.getPreviousStock()).isEqualTo(50);
        assertThat(saved.getNewStock()).isEqualTo(75);
        assertThat(saved.getType()).isEqualTo(MovementType.ADJUSTMENT);
    }
}
