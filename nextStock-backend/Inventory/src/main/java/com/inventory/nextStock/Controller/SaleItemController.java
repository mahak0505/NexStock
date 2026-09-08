package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Entity.SaleItem;
import com.inventory.nextStock.Services.SaleItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sale-items")
public class SaleItemController {

    private final SaleItemService saleItemService;

    public SaleItemController(SaleItemService saleItemService) {
        this.saleItemService = saleItemService;
    }

    @PostMapping
    public SaleItem addSaleItem(@RequestBody SaleItem saleItem) {
        return saleItemService.addSaleItem(saleItem);
    }

    @GetMapping
    public List<SaleItem> getAllSaleItems() {
        return saleItemService.getAllSaleItems();
    }

    @PutMapping("/{id}")
    public SaleItem updateSaleItem(
            @PathVariable Integer id,
            @RequestBody SaleItem saleItem) {

        return saleItemService.updateSaleItem(id, saleItem);
    }
}