package com.inventory.nextStock.Repository;

import com.inventory.nextStock.Entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleItemRepository
        extends JpaRepository<SaleItem, Integer> {
}