
package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Services.RestockService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/restock")
public class RestockController {

    private final RestockService restockService;

    public RestockController(RestockService restockService) {
        this.restockService = restockService;
    }

    @GetMapping("/{productId}")
    public Map<String, Object> getRestockSuggestion(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "7") int forecastDays,
            @RequestParam(defaultValue = "7") int planningDays) {

        return restockService.getRestockSuggestion(
                productId, forecastDays, planningDays);
    }
}
