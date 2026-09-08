package com.inventory.nextStock.Repository;

import com.inventory.nextStock.Entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockTransactionRepository
        extends JpaRepository<StockTransaction, Integer> {
}