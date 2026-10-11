package com.inventory.inventorysystem.repository;

import com.inventory.inventorysystem.entity.MovementType;
import com.inventory.inventorysystem.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    @EntityGraph(attributePaths = {"product"})
    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);

    @EntityGraph(attributePaths = {"product"})
    Page<StockMovement> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"product"})
    Page<StockMovement> findByProductId(Long productId, Pageable pageable);

    @EntityGraph(attributePaths = {"product"})
    Page<StockMovement> findByType(MovementType type, Pageable pageable);

    @EntityGraph(attributePaths = {"product"})
    Page<StockMovement> findByProductIdAndType(Long productId, MovementType type, Pageable pageable);

    @EntityGraph(attributePaths = {"product"})
    List<StockMovement> findTop5ByOrderByCreatedAtDesc();

    void deleteByProductId(Long productId);
}

