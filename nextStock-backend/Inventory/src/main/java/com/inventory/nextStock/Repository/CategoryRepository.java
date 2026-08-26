package com.inventory.nextStock.Repository;

import com.inventory.nextStock.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Integer> {
}
