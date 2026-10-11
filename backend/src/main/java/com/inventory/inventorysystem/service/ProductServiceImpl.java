package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.config.InventoryMapper;
import com.inventory.inventorysystem.dto.ProductRequest;
import com.inventory.inventorysystem.dto.ProductResponse;
import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.exception.DuplicateResourceException;
import com.inventory.inventorysystem.exception.ResourceNotFoundException;
import com.inventory.inventorysystem.repository.ProductRepository;
import com.inventory.inventorysystem.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final InventoryMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(String search) {
        List<Product> products = StringUtils.hasText(search)
                ? productRepository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(search, search)
                : productRepository.findAll();
        return products.stream()
                .map(mapper::toProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        return mapper.toProductResponse(findById(id));
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product", "SKU", request.getSku());
        }
        Product product = Product.builder()
                .name(request.getName())
                .sku(request.getSku())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .reorderLevel(request.getReorderLevel())
                .build();
        return mapper.toProductResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findById(id);
        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product", "SKU", request.getSku());
        }
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setReorderLevel(request.getReorderLevel());
        return mapper.toProductResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = findById(id);
        stockMovementRepository.deleteByProductId(id);
        productRepository.delete(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findLowStockProducts()
                .stream()
                .map(mapper::toProductResponse)
                .collect(Collectors.toList());
    }

    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }
}
