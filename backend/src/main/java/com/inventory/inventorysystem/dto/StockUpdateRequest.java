package com.inventory.inventorysystem.dto;

import com.inventory.inventorysystem.entity.MovementType;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockUpdateRequest {

    @NotNull
    private MovementType type;

    @NotNull
    @Min(0)
    private Integer quantity;

    @Size(max = 500)
    private String note;
}
