package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Entity.PurchaseOrderItem;
import com.inventory.nextStock.Services.PurchaseOrderItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-order-items")
public class PurchaseOrderItemController {

    private final PurchaseOrderItemService purchaseOrderItemService;

    public PurchaseOrderItemController(
            PurchaseOrderItemService purchaseOrderItemService) {

        this.purchaseOrderItemService = purchaseOrderItemService;
    }

    @PostMapping
    public PurchaseOrderItem addPurchaseOrderItem(
            @RequestBody PurchaseOrderItem purchaseOrderItem) {

        return purchaseOrderItemService
                .addPurchaseOrderItem(purchaseOrderItem);
    }

    @GetMapping
    public List<PurchaseOrderItem> getAllPurchaseOrderItems() {
        return purchaseOrderItemService.getAllPurchaseOrderItems();
    }

    @PutMapping("/{id}")
    public PurchaseOrderItem updatePurchaseOrderItem(
            @PathVariable Integer id,
            @RequestBody PurchaseOrderItem purchaseOrderItem) {

        return purchaseOrderItemService
                .updatePurchaseOrderItem(id, purchaseOrderItem);
    }
}