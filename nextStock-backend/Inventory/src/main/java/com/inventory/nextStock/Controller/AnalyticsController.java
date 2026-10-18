package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Services.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }
    @GetMapping("/total-revenue")
    public Map<String, BigDecimal> getTotalRevenue(){
        BigDecimal revenue=analyticsService.getTotalRevenue();
        return Map.of("total revenue",revenue);
    }
    @GetMapping("/best-selling-products")
    public List<Object[]> getBestSellingProducts(){
        return analyticsService.getBestSellingProducts();
    }


    @GetMapping("/daily-sales")
    public List<Object[]> getDailySales() {
        return analyticsService.getDailySales();
    }

    @GetMapping("/daily-sales/{productId}")
    public List<Object[]> getDailySalesByProduct(
            @PathVariable Integer productId) {

        return analyticsService.getDailySalesByProduct(productId);
    }
}
