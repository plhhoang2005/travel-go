package com.travelgo.external;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WeatherFallbackRepository {
    private final Map<String, FallbackWeather> fallbackByDestination;

    public WeatherFallbackRepository(ObjectMapper objectMapper) {
        try {
            List<FallbackWeather> loaded = objectMapper.readValue(
                    new ClassPathResource("data/weather-fallback.json").getInputStream(),
                    new TypeReference<>() {}
            );
            Map<String, FallbackWeather> indexed = new HashMap<>();
            for (FallbackWeather weather : loaded) {
                if (indexed.put(weather.destinationId(), weather) != null) {
                    throw new IllegalStateException("Duplicate fallback weather: " + weather.destinationId());
                }
            }
            this.fallbackByDestination = Map.copyOf(indexed);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot load data/weather-fallback.json", e);
        }
    }

    public WeatherSummary get(String destinationId, int days) {
        FallbackWeather weather = fallbackByDestination.get(destinationId);
        if (weather == null) {
            throw new IllegalStateException("No fallback weather for: " + destinationId);
        }
        LocalDate from = LocalDate.now();
        return new WeatherSummary(
                destinationId,
                from,
                from.plusDays(days - 1L),
                weather.temperatureMinC(),
                weather.temperatureMaxC(),
                weather.precipitationProbabilityMax(),
                weather.precipitationSumMm(),
                weather.windSpeedMaxKmh(),
                -1,
                WeatherScorer.score(
                        weather.temperatureMinC(), weather.temperatureMaxC(),
                        weather.precipitationProbabilityMax(), weather.precipitationSumMm(),
                        weather.windSpeedMaxKmh()),
                WeatherSource.FALLBACK
        );
    }

    public record FallbackWeather(
            @JsonProperty("destination_id") String destinationId,
            @JsonProperty("temperature_min_c") double temperatureMinC,
            @JsonProperty("temperature_max_c") double temperatureMaxC,
            @JsonProperty("precipitation_probability_max") double precipitationProbabilityMax,
            @JsonProperty("precipitation_sum_mm") double precipitationSumMm,
            @JsonProperty("wind_speed_max_kmh") double windSpeedMaxKmh
    ) {}
}
