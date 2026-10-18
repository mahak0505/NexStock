package com.inventory.nextStock.Repository;

import com.inventory.nextStock.Entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SaleItemRepository
        extends JpaRepository<SaleItem, Integer> {
    @Query("""
         SELECT SUM(si.quantity*si.price)
                  from SaleItem si """)
    BigDecimal calculateTotalRevenue();

    @Query("""
          SELECT  si.product.product_id,
                  si.product.product_name,
                  SUM(si.quantity)
          FROM SaleItem si
          group by si.product.product_id
                    ,si.product.product_name
          order by SUM(si.quantity) desc""")
    List<Object[]> findBestSellingProducts();


    @Query("""
    SELECT FUNCTION('DATE', si.sale.sale_date),
           SUM(si.quantity)
    FROM SaleItem si
    GROUP BY FUNCTION('DATE', si.sale.sale_date)
    ORDER BY FUNCTION('DATE', si.sale.sale_date)
""")
    List<Object[]> findDailySales();
    @Query("""
    SELECT FUNCTION('DATE', si.sale.sale_date),
           SUM(si.quantity)
    FROM SaleItem si
    WHERE si.product.product_id = :productId
    GROUP BY FUNCTION('DATE', si.sale.sale_date)
    ORDER BY FUNCTION('DATE', si.sale.sale_date)
""")
    List<Object[]> findDailySalesByProduct(
            @Param("productId") Integer productId
    );




}