package com.inventory.nextStock.Repository;

import com.inventory.nextStock.Entity.Category;
import com.inventory.nextStock.Entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier,Integer> {

}
