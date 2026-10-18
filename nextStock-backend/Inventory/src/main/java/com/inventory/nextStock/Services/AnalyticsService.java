package com.inventory.nextStock.Services;


import com.inventory.nextStock.Repository.SaleItemRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
public class AnalyticsService {
    private final SaleItemRepository saleItemRepository;

    public AnalyticsService(SaleItemRepository saleItemRepository) {
        this.saleItemRepository = saleItemRepository;
    }

    public BigDecimal getTotalRevenue(){
        BigDecimal revenue=saleItemRepository.calculateTotalRevenue();
        return revenue!=null?revenue:BigDecimal.ZERO;
    }

    public List<Object[]> getBestSellingProducts(){
        return saleItemRepository.findBestSellingProducts();
    }


    public List<Object[]> getDailySales() {
        return saleItemRepository.findDailySales();
    }
    public List<Object[]> getDailySalesByProduct(Integer productId) {
        return saleItemRepository.findDailySalesByProduct(productId);
    }
}
