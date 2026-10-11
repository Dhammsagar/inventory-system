package com.inventory.inventorysystem.dto;

import com.inventory.inventorysystem.entity.MovementType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovementResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private MovementType type;
    private Integer quantity;
    private Integer previousStock;
    private Integer newStock;
    private String note;
    private LocalDateTime createdAt;
}
