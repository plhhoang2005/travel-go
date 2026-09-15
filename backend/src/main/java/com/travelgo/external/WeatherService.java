package com.travelgo.external;

import com.travelgo.data.DataLoaderService;
import com.travelgo.model.Destination;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WeatherService {
    private final DataLoaderService dataLoaderService;
    private final OpenMeteoWeatherClient weatherClient;
    private final Duration liveTtl;
    private final Duration fallbackTtl;
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public WeatherService(
            DataLoaderService dataLoaderService,
            OpenMeteoWeatherClient weatherClient,
            @Value("${weather.cache.live-minutes:15}") long liveMinutes,
            @Value("${weather.cache.fallback-seconds:60}") long fallbackSeconds
    ) {
        this.dataLoaderService = dataLoaderService;
        this.weatherClient = weatherClient;
        this.liveTtl = Duration.ofMinutes(liveMinutes);
        this.fallbackTtl = Duration.ofSeconds(fallbackSeconds);
    }

    public Mono<WeatherSummary> getWeather(String destinationId, int days) {
        int safeDays = Math.max(1, Math.min(16, days));
        String cacheKey = destinationId + ":" + safeDays;
        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && cached.expiresAt().isAfter(Instant.now())) {
            return Mono.just(cached.summary());
        }

        Destination destination = dataLoaderService.getDestinationById(destinationId);
        if (destination == null) {
            throw new IllegalArgumentException("Unknown destination: " + destinationId);
        }
        return weatherClient.fetch(destination, safeDays)
                .doOnNext(summary -> {
                    Duration ttl = summary.source() == WeatherSource.LIVE ? liveTtl : fallbackTtl;
                    cache.put(cacheKey, new CacheEntry(summary, Instant.now().plus(ttl)));
                });
    }

    public Map<String, WeatherSummary> getWeather(Collection<String> destinationIds, int days) {
        return Flux.fromIterable(destinationIds)
                .flatMap(id -> getWeather(id, days), 5)
                .collectMap(WeatherSummary::destinationId)
                .blockOptional(Duration.ofSeconds(8))
                .orElse(Map.of());
    }

    private record CacheEntry(WeatherSummary summary, Instant expiresAt) {}
}
