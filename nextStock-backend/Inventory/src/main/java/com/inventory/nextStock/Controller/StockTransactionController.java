package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Entity.StockTransaction;
import com.inventory.nextStock.Services.StockTransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-transactions")
public class StockTransactionController {

    private final StockTransactionService stockTransactionService;

    public StockTransactionController(
            StockTransactionService stockTransactionService) {

        this.stockTransactionService = stockTransactionService;
    }

    @PostMapping
    public StockTransaction addStockTransaction(
            @RequestBody StockTransaction stockTransaction) {

        return stockTransactionService
                .addStockTransaction(stockTransaction);
    }

    @GetMapping
    public List<StockTransaction> getAllStockTransactions() {
        return stockTransactionService.getAllStockTransactions();
    }

    @PutMapping("/{id}")
    public StockTransaction updateStockTransaction(
            @PathVariable Integer id,
            @RequestBody StockTransaction stockTransaction) {

        return stockTransactionService
                .updateStockTransaction(id, stockTransaction);
    }
}