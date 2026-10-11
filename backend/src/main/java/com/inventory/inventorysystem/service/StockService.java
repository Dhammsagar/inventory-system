package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.dto.ProductResponse;
import com.inventory.inventorysystem.dto.StockMovementResponse;
import com.inventory.inventorysystem.dto.StockUpdateRequest;
import com.inventory.inventorysystem.entity.MovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StockService {

    ProductResponse updateStock(Long productId, StockUpdateRequest request);

    List<StockMovementResponse> getMovementsByProductId(Long productId);

    Page<StockMovementResponse> getAllMovements(Long productId, MovementType type, Pageable pageable);
}
