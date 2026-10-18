package com.inventory.nextStock.Services;

import com.inventory.nextStock.Entity.*;
import com.inventory.nextStock.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private  final NotificationRepository notificationRepository;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository, PurchaseOrderItemRepository purchaseOrderItemRepository, InventoryRepository inventoryRepository, StockTransactionRepository stockTransactionRepository, NotificationRepository notificationRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.notificationRepository = notificationRepository;
    }

    public PurchaseOrder addPurchaseOrder(PurchaseOrder purchaseOrder) {
        return purchaseOrderRepository.save(purchaseOrder);
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder updatePurchaseOrder(
            Integer id,
            PurchaseOrder newPurchaseOrder) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Purchase order not found"));

        purchaseOrder.setSupplier(newPurchaseOrder.getSupplier());
        purchaseOrder.setOrder_date(newPurchaseOrder.getOrder_date());
        purchaseOrder.setExpected_date(newPurchaseOrder.getExpected_date());
        purchaseOrder.setStatus(newPurchaseOrder.getStatus());
        purchaseOrder.setTotal_amount(newPurchaseOrder.getTotal_amount());

        return purchaseOrderRepository.save(purchaseOrder);
    }
    @Transactional
    public PurchaseOrder receivePurchaseOrder(Integer id, User user) {

        // 1. Find purchase order
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Purchase order not found"));

        // 2. Prevent receiving the same order twice
        if (purchaseOrder.getStatus() == PurchaseOrderStatus.RECEIVED) {
            throw new RuntimeException("Purchase order already received");
        }

        // 3. Get all products in this purchase order
        List<PurchaseOrderItem> items =
                purchaseOrderItemRepository
                        .findByPurchaseOrderId(id);

        // 4. Process every product
        for (PurchaseOrderItem item : items) {

            Product product = item.getProduct();
            Inventory inventory = inventoryRepository
                    .findByProductId(product.getProduct_id())
                    .orElseGet(()->{
                        Inventory newInventory= new Inventory();
                        newInventory.setProduct(item.getProduct());
                        newInventory.setQuantity(0);
                        return newInventory;
                            });

            // 5. Increase inventory
            int currentQuantity = inventory.getQuantity() == null
                    ? 0
                    : inventory.getQuantity();

            inventory.setQuantity(
                    currentQuantity + item.getQuantity()
            );

            inventoryRepository.save(inventory);


            if (inventory.getQuantity() > product.getMinimum_stock()) {

                List<Notification> activeNotifications =
                        notificationRepository.findActiveLowStockNotifications(
                                product.getProduct_id()
                        );

                for (Notification notification : activeNotifications) {
                    notification.setIs_resolved(true);
                    notificationRepository.save(notification);
                }
            }

            // 6. Record why stock increased
            StockTransaction transaction = new StockTransaction();

            transaction.setProduct(product);
            transaction.setUser(user);
            transaction.setTransaction_type(TransactionType.PURCHASE);
            transaction.setQuantity(item.getQuantity());
            transaction.setRemarks(
                    "Stock added from purchase order " + id
            );

            stockTransactionRepository.save(transaction);
        }

        // 7. Finally mark order received
        purchaseOrder.setStatus(PurchaseOrderStatus.RECEIVED);

        return purchaseOrderRepository.save(purchaseOrder);
    }
}