package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Entity.PurchaseOrder;
import com.inventory.nextStock.Entity.User;
import com.inventory.nextStock.Services.PurchaseOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @PostMapping
    public PurchaseOrder addPurchaseOrder(
            @RequestBody PurchaseOrder purchaseOrder) {

        return purchaseOrderService.addPurchaseOrder(purchaseOrder);
    }

    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @PutMapping("/{id}/receive")
    public PurchaseOrder receivePurchaseOrder(
            @PathVariable Integer id,
            @RequestBody User user) {

        return purchaseOrderService.receivePurchaseOrder(id, user);
    }
    @PutMapping("/{id}")
    public PurchaseOrder updatePurchaseOrder(
            @PathVariable Integer id,
            @RequestBody PurchaseOrder purchaseOrder) {

        return purchaseOrderService.updatePurchaseOrder(id, purchaseOrder);
    }
}