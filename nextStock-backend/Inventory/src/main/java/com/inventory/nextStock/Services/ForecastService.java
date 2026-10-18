package com.inventory.nextStock.Services;


import com.inventory.nextStock.Repository.SaleItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ForecastService {
    private final SaleItemRepository saleItemRepository;

    public ForecastService(SaleItemRepository saleItemRepository) {
        this.saleItemRepository = saleItemRepository;
    }
    public Map<String,Object> predictDemand(Integer productId, int days){
        if(days<=0){
            throw new IllegalArgumentException("Days must be greater than zero");
        }
        List<Object[]> sales=
                saleItemRepository.findDailySalesByProduct(productId);
        Map<LocalDate,Long> dailySales=new HashMap<>();

        for(Object[] row:sales){
            LocalDate date;

            if(row[0] instanceof java.sql.Date sqlDate){
                date=sqlDate.toLocalDate();
            } else if (row[0] instanceof LocalDate localDate) {

                date=localDate;
            }else{
                date=((java.util.Date) row[0]).
                        toInstant().
                        atZone(ZoneId.systemDefault()).
                        toLocalDate();
            }
            long quantity=((Number)row[1]).longValue();
            dailySales.put(date,quantity);
        }
        LocalDate today=LocalDate.now();
        long total = 0;

        // Include zero-sales days in the average
        for (int i = 0; i < days; i++) {
            LocalDate date = today.minusDays(i + 1);
            total += dailySales.getOrDefault(date, 0L);
        }

        double predictedDailyDemand = (double) total / days;

        return Map.of(
                "productId", productId,
                "daysAnalyzed", days,
                "totalUnitsSold", total,
                "predictedDailyDemand", predictedDailyDemand
        );
    }
}


