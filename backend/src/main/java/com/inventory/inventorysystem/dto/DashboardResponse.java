package com.inventory.inventorysystem.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalProducts;
    private long totalStockUnits;
    private BigDecimal totalInventoryValue;
    private long lowStockCount;
    private List<StockMovementResponse> recentMovements;
}
