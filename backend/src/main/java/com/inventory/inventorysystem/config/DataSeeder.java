package com.inventory.inventorysystem.config;

import com.inventory.inventorysystem.entity.Product;
import com.inventory.inventorysystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        List<Product> products = List.of(
                Product.builder().name("Wireless Mouse").sku("WM-001").category("Electronics").price(new BigDecimal("29.99")).quantity(150).reorderLevel(20).build(),
                Product.builder().name("Mechanical Keyboard").sku("MK-002").category("Electronics").price(new BigDecimal("89.99")).quantity(75).reorderLevel(15).build(),
                Product.builder().name("USB-C Hub").sku("UH-003").category("Electronics").price(new BigDecimal("45.50")).quantity(200).reorderLevel(30).build(),
                Product.builder().name("Monitor Stand").sku("MS-004").category("Accessories").price(new BigDecimal("34.99")).quantity(60).reorderLevel(10).build(),
                Product.builder().name("Webcam HD").sku("WC-005").category("Electronics").price(new BigDecimal("59.99")).quantity(5).reorderLevel(10).build(),
                Product.builder().name("Desk Lamp").sku("DL-006").category("Office").price(new BigDecimal("24.99")).quantity(90).reorderLevel(15).build(),
                Product.builder().name("Notebook A5").sku("NB-007").category("Stationery").price(new BigDecimal("4.99")).quantity(500).reorderLevel(50).build(),
                Product.builder().name("Ballpoint Pen Pack").sku("BP-008").category("Stationery").price(new BigDecimal("7.49")).quantity(8).reorderLevel(25).build(),
                Product.builder().name("Wireless Charger").sku("WC-009").category("Electronics").price(new BigDecimal("19.99")).quantity(120).reorderLevel(20).build(),
                Product.builder().name("Laptop Sleeve 15in").sku("LS-010").category("Accessories").price(new BigDecimal("22.00")).quantity(3).reorderLevel(10).build()
        );

        productRepository.saveAll(products);
    }
}
