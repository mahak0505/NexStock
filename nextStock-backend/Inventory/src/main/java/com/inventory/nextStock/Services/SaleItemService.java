package com.inventory.nextStock.Services;

import com.inventory.nextStock.Entity.*;
import com.inventory.nextStock.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleItemService {

    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final NotificationRepository notificationRepository;

    public SaleItemService(SaleItemRepository saleItemRepository, ProductRepository productRepository, InventoryRepository inventoryRepository, StockTransactionRepository stockTransactionRepository, NotificationRepository notificationRepository) {
        this.saleItemRepository = saleItemRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public SaleItem addSaleItem(SaleItem saleItem) {

        // 1. Get product
        Product product = productRepository
                .findById(saleItem.getProduct().getProduct_id())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. Find inventory
        Inventory inventory =  inventoryRepository
                .findByProductId(product.getProduct_id())
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        // 3. Check stock
        if (inventory.getQuantity() < saleItem.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        // 4. Reduce inventory
        inventory.setQuantity(
                inventory.getQuantity() - saleItem.getQuantity()
        );

        inventoryRepository.save(inventory);
        if (inventory.getQuantity() <= product.getMinimum_stock()) {

            Notification notification = new Notification();

            notification.setProduct(product);
            notification.setNotification_type("LOW_STOCK");
            notification.setMessage(
                    product.getProduct_name() +
                            " stock is low. Remaining quantity: " +
                            inventory.getQuantity()
            );

            notificationRepository.save(notification);
        }

        SaleItem savedSaleItem = saleItemRepository.save(saleItem);

        // MUST be inside addSaleItem()
        StockTransaction transaction = new StockTransaction();

        transaction.setProduct(product);  // product is available here
        transaction.setUser(saleItem.getSale().getUser());
        transaction.setTransaction_type(TransactionType.SALE);
        transaction.setQuantity(saleItem.getQuantity());
        transaction.setRemarks("Stock reduced due to sale");

        stockTransactionRepository.save(transaction);

        return savedSaleItem;
    }

    public List<SaleItem> getAllSaleItems() {
        return saleItemRepository.findAll();
    }

    public SaleItem updateSaleItem(Integer id, SaleItem newSaleItem) {

        SaleItem saleItem = saleItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Sale item not found"));

        saleItem.setSale(newSaleItem.getSale());
        saleItem.setProduct(newSaleItem.getProduct());
        saleItem.setQuantity(newSaleItem.getQuantity());
        saleItem.setPrice(newSaleItem.getPrice());

        return saleItemRepository.save(saleItem);
    }
}