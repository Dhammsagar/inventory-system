package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.config.InventoryMapper;
import com.inventory.inventorysystem.dto.ProductResponse;
import com.inventory.inventorysystem.dto.StockMovementResponse;
import com.inventory.inventorysystem.dto.StockUpdateRequest;
import com.inventory.inventorysystem.entity.MovementType;
import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.entity.StockMovement;
import com.inventory.inventorysystem.exception.InsufficientStockException;
import com.inventory.inventorysystem.exception.ResourceNotFoundException;
import com.inventory.inventorysystem.repository.ProductRepository;
import com.inventory.inventorysystem.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final InventoryMapper mapper;

    @Override
    @Transactional
    public ProductResponse updateStock(Long productId, StockUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        int previousStock = product.getQuantity();
        int newStock;

        switch (request.getType()) {
            case IN -> newStock = previousStock + request.getQuantity();
            case OUT -> {
                if (previousStock < request.getQuantity()) {
                    throw new InsufficientStockException(
                            product.getName(), request.getQuantity(), previousStock);
                }
                newStock = previousStock - request.getQuantity();
            }
            case ADJUSTMENT -> newStock = request.getQuantity();
            default -> throw new IllegalArgumentException("Unknown movement type: " + request.getType());
        }

        product.setQuantity(newStock);
        productRepository.save(product);

        StockMovement movement = StockMovement.builder()
                .product(product)
                .type(request.getType())
                .quantity(request.getQuantity())
                .previousStock(previousStock)
                .newStock(newStock)
                .note(request.getNote())
                .build();
        stockMovementRepository.save(movement);

        return mapper.toProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockMovementResponse> getMovementsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", productId);
        }
        return stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(mapper::toStockMovementResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StockMovementResponse> getAllMovements(Long productId, MovementType type, Pageable pageable) {
        Page<StockMovement> page;
        if (productId != null && type != null) {
            page = stockMovementRepository.findByProductIdAndType(productId, type, pageable);
        } else if (productId != null) {
            page = stockMovementRepository.findByProductId(productId, pageable);
        } else if (type != null) {
            page = stockMovementRepository.findByType(type, pageable);
        } else {
            page = stockMovementRepository.findAll(pageable);
        }
        return page.map(mapper::toStockMovementResponse);
    }
}
