package com.inventory.nextStock.Repository;

import com.inventory.nextStock.Entity.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderItemRepository
        extends JpaRepository<PurchaseOrderItem, Integer> {
    @Query("""
           SELECT p
           FROM PurchaseOrderItem p
           WHERE p.purchaseOrder.purchase_order_id = :purchaseOrderId
           """)
    List<PurchaseOrderItem> findByPurchaseOrderId(
            @Param("purchaseOrderId") Integer purchaseOrderId
    );
}