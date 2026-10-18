
package com.inventory.nextStock.Controller;

import com.inventory.nextStock.Services.ForecastService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @GetMapping("/{productId}")
    public Map<String, Object> getForecast(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "7") int days) {

        return forecastService.predictDemand(productId, days);
    }
}
