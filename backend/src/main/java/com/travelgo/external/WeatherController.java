package com.travelgo.external;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/weather")
public class WeatherController {
    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/{destinationId}")
    public WeatherSummary weather(
            @PathVariable String destinationId,
            @RequestParam(defaultValue = "3") int days
    ) {
        if (days < 1 || days > 16) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "days must be between 1 and 16");
        }
        try {
            return weatherService.getWeather(destinationId, days).block(Duration.ofSeconds(5));
        } catch (IllegalArgumentException error) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, error.getMessage(), error);
        }
    }
}
