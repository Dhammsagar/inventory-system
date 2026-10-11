package com.inventory.inventorysystem.controller;

import com.inventory.inventorysystem.dto.StockMovementResponse;
import com.inventory.inventorysystem.entity.MovementType;
import com.inventory.inventorysystem.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MovementController {

    private final StockService stockService;

    @GetMapping("/movements")
    public ResponseEntity<Page<StockMovementResponse>> getAllMovements(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) MovementType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(stockService.getAllMovements(productId, type, pageable));
    }

    @GetMapping("/products/{id}/movements")
    public ResponseEntity<List<StockMovementResponse>> getMovementsByProduct(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getMovementsByProductId(id));
    }
}
