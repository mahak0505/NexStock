package com.inventory.nextStock.Services;

import com.inventory.nextStock.Entity.Inventory;
import com.inventory.nextStock.Repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RestockService {
    private final InventoryRepository inventoryRepository;
    private  final ForecastService forecastService;

    public RestockService(InventoryRepository inventoryRepository, ForecastService forecastService) {
        this.inventoryRepository = inventoryRepository;
        this.forecastService = forecastService;
    }

    public Map<String,Object> getRestockSuggestion(
            Integer productId,int forecastDays,int planningDays
    ){
        if(planningDays<=0){
            throw new IllegalArgumentException("days should be greater than 0");
        }
        Map<String,Object> forecast=forecastService.predictDemand(productId,forecastDays);

        double dailyDemand=((Number)forecast.get("predictedDailyDemand")).doubleValue();

        Inventory inventory=inventoryRepository.findByProductId(productId).
                orElseThrow(()->new RuntimeException("Inventory not found"));

        int currentStock=inventory.getQuantity();

        int expectedDemand=(int)Math.ceil(dailyDemand*planningDays);

        int restockQuantity=Math.max(0, expectedDemand-currentStock);


        return Map.of(
                "productId", productId,
                "currentStock", currentStock,
                "predictedDailyDemand", dailyDemand,
                "planningDays", planningDays,
                "expectedDemand", expectedDemand,
                "recommendedRestock", restockQuantity,
                "restockNeeded", restockQuantity > 0
        );

    }
}
