package com.inventory.inventorysystem.controller;

import com.inventory.inventorysystem.dto.ProductResponse;
import com.inventory.inventorysystem.dto.StockUpdateRequest;
import com.inventory.inventorysystem.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping("/{id}/stock")
    public ResponseEntity<ProductResponse> updateStock(
            @PathVariable Long id,
            @Valid @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(stockService.updateStock(id, request));
    }
}
