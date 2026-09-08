package com.inventory.nextStock.Services;

import com.inventory.nextStock.Entity.PurchaseOrderItem;
import com.inventory.nextStock.Repository.PurchaseOrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderItemService {

    private final PurchaseOrderItemRepository purchaseOrderItemRepository;

    public PurchaseOrderItemService(
            PurchaseOrderItemRepository purchaseOrderItemRepository) {
        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
    }

    public PurchaseOrderItem addPurchaseOrderItem(
            PurchaseOrderItem purchaseOrderItem) {

        return purchaseOrderItemRepository.save(purchaseOrderItem);
    }

    public List<PurchaseOrderItem> getAllPurchaseOrderItems() {
        return purchaseOrderItemRepository.findAll();
    }

    public PurchaseOrderItem updatePurchaseOrderItem(
            Integer id,
            PurchaseOrderItem newItem) {

        PurchaseOrderItem item =
                purchaseOrderItemRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase order item not found"));

        item.setPurchaseOrder(newItem.getPurchaseOrder());
        item.setProduct(newItem.getProduct());
        item.setQuantity(newItem.getQuantity());
        item.setCost_price(newItem.getCost_price());

        return purchaseOrderItemRepository.save(item);
    }
}