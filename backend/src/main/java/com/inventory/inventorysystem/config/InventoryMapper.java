package com.inventory.inventorysystem.config;

import com.inventory.inventorysystem.dto.ProductResponse;
import com.inventory.inventorysystem.dto.StockMovementResponse;
import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.entity.StockMovement;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .category(product.getCategory())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .reorderLevel(product.getReorderLevel())
                .lowStock(product.getQuantity() <= product.getReorderLevel())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public StockMovementResponse toStockMovementResponse(StockMovement movement) {
        return StockMovementResponse.builder()
                .id(movement.getId())
                .productId(movement.getProduct().getId())
                .productName(movement.getProduct().getName())
                .productSku(movement.getProduct().getSku())
                .type(movement.getType())
                .quantity(movement.getQuantity())
                .previousStock(movement.getPreviousStock())
                .newStock(movement.getNewStock())
                .note(movement.getNote())
                .createdAt(movement.getCreatedAt())
                .build();
    }
}
