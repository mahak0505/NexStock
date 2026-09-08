package com.inventory.nextStock.Services;

import com.inventory.nextStock.Entity.StockTransaction;
import com.inventory.nextStock.Repository.StockTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockTransactionService {

    private final StockTransactionRepository stockTransactionRepository;

    public StockTransactionService(
            StockTransactionRepository stockTransactionRepository) {

        this.stockTransactionRepository = stockTransactionRepository;
    }

    public StockTransaction addStockTransaction(
            StockTransaction stockTransaction) {

        return stockTransactionRepository.save(stockTransaction);
    }

    public List<StockTransaction> getAllStockTransactions() {
        return stockTransactionRepository.findAll();
    }

    public StockTransaction updateStockTransaction(
            Integer id,
            StockTransaction newTransaction) {

        StockTransaction transaction =
                stockTransactionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Stock transaction not found"));

        transaction.setProduct(newTransaction.getProduct());
        transaction.setUser(newTransaction.getUser());
        transaction.setTransaction_type(
                newTransaction.getTransaction_type());
        transaction.setQuantity(newTransaction.getQuantity());
        transaction.setRemarks(newTransaction.getRemarks());

        return stockTransactionRepository.save(transaction);
    }
}