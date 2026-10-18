package com.inventory.nextStock.Repository;

import com.inventory.nextStock.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, Integer> {

    @Query("""
        SELECT CASE WHEN COUNT(n)>0 THEN TRUE ELSE FALSE END
        FROM Notification n
        WHERE n.product.product_id=:productId
        AND n.notification_type='LOW_STOCK'
        AND n.is_read=false 
""")
    boolean existsUnreadLowStockNotification(
            @Param("productId") Integer productId
    );
    @Query("""
    SELECT n from Notification n
    WHERE n.product.product_id=:productId
    AND n.notification_type='LOW_STOCK'
    AND n.is_resolved=false 
    ORDER BY n.notification_id DESC
""")
    List<Notification> findActiveLowStockNotifications(
            @Param("productId") Integer productId
    );

}