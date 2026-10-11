package com.inventory.inventorysystem.service;

import com.inventory.inventorysystem.dto.ProductRequest;
import com.inventory.inventorysystem.dto.ProductResponse;

import java.util.List;

public interface ProductService {

    List<ProductResponse> getAllProducts(String search);

    ProductResponse getProductById(Long id);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    List<ProductResponse> getLowStockProducts();
}
