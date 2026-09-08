package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Entity.Sale;
import com.inventory.nextStock.Services.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public Sale addSale(@RequestBody Sale sale) {
        return saleService.addSale(sale);
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @PutMapping("/{id}")
    public Sale updateSale(
            @PathVariable Integer id,
            @RequestBody Sale sale) {

        return saleService.updateSale(id, sale);
    }
}