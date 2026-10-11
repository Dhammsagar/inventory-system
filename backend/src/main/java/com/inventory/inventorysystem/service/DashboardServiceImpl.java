package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.config.InventoryMapper;
import com.inventory.inventorysystem.dto.DashboardResponse;
import com.inventory.inventorysystem.dto.StockMovementResponse;
import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.repository.ProductRepository;
import com.inventory.inventorysystem.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final InventoryMapper mapper;

    @Override
    public DashboardResponse getDashboard() {
        List<Product> allProducts = productRepository.findAll();

        long totalProducts = allProducts.size();

        long totalStockUnits = allProducts.stream()
                .mapToLong(Product::getQuantity)
                .sum();

        BigDecimal totalInventoryValue = allProducts.stream()
                .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long lowStockCount = allProducts.stream()
                .filter(p -> p.getQuantity() <= p.getReorderLevel())
                .count();

        List<StockMovementResponse> recentMovements = stockMovementRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(mapper::toStockMovementResponse)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalProducts(totalProducts)
                .totalStockUnits(totalStockUnits)
                .totalInventoryValue(totalInventoryValue)
                .lowStockCount(lowStockCount)
                .recentMovements(recentMovements)
                .build();
    }
}
