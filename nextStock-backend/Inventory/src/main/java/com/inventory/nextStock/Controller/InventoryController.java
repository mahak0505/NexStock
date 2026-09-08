package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Entity.Inventory;
import com.inventory.nextStock.Services.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public Inventory addInventory(@RequestBody Inventory inventory) {
        return inventoryService.addInventory(inventory);
    }

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @PutMapping("/{id}")
    public Inventory updateInventory(
            @PathVariable Integer id,
            @RequestBody Inventory inventory) {

        return inventoryService.updateInventory(id, inventory);
    }
}