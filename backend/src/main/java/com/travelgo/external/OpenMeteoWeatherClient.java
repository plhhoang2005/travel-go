package com.travelgo.external;

import com.travelgo.model.Destination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@Component
public class OpenMeteoWeatherClient {
    private static final Logger log = LoggerFactory.getLogger(OpenMeteoWeatherClient.class);
    private static final String DAILY_FIELDS = String.join(",",
            "weather_code", "temperature_2m_max", "temperature_2m_min",
            "precipitation_probability_max", "precipitation_sum", "wind_speed_10m_max");

    private final WebClient webClient;
    private final Duration timeout;
    private final WeatherFallbackRepository fallbackRepository;

    public OpenMeteoWeatherClient(
            WebClient.Builder webClientBuilder,
            WeatherFallbackRepository fallbackRepository,
            @Value("${weather.open-meteo.base-url}") String baseUrl,
            @Value("${weather.open-meteo.timeout-seconds:3}") long timeoutSeconds
    ) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.fallbackRepository = fallbackRepository;
        this.timeout = Duration.ofSeconds(timeoutSeconds);
    }

    public Mono<WeatherSummary> fetch(Destination destination, int requestedDays) {
        int days = Math.max(1, Math.min(16, requestedDays));
        if (destination.getCoordinates() == null
                || destination.getCoordinates().get("lat") == null
                || destination.getCoordinates().get("lon") == null) {
            return Mono.just(fallbackRepository.get(destination.getId(), days));
        }
        return webClient.get()
                .uri(uri -> uri.path("/v1/forecast")
                        .queryParam("latitude", destination.getCoordinates().get("lat"))
                        .queryParam("longitude", destination.getCoordinates().get("lon"))
                        .queryParam("forecast_days", days)
                        .queryParam("daily", DAILY_FIELDS)
                        .queryParam("timezone", "auto")
                        .build())
                .retrieve()
                .bodyToMono(OpenMeteoResponse.class)
                .map(response -> toSummary(destination.getId(), response, days))
                .timeout(timeout)
                .doOnNext(summary -> log.info("Weather source={} destination={}", summary.source(), destination.getId()))
                .onErrorResume(error -> {
                    log.warn("Open-Meteo unavailable for {}, using fallback: {}",
                            destination.getId(), error.getClass().getSimpleName());
                    return Mono.just(fallbackRepository.get(destination.getId(), days));
                });
    }

    private WeatherSummary toSummary(String destinationId, OpenMeteoResponse response, int days) {
        OpenMeteoResponse.Daily daily = response.daily();
        if (daily == null || daily.time() == null || daily.time().isEmpty()
                || daily.temperatureMin() == null || daily.temperatureMax() == null
                || daily.precipitationProbabilityMax() == null || daily.precipitationSum() == null
                || daily.windSpeedMax() == null) {
            throw new IllegalStateException("Open-Meteo returned incomplete daily data");
        }

        int size = daily.time().size();
        requireSize(daily.temperatureMin(), size);
        requireSize(daily.temperatureMax(), size);
        requireSize(daily.precipitationProbabilityMax(), size);
        requireSize(daily.precipitationSum(), size);
        requireSize(daily.windSpeedMax(), size);

        double minTemperature = daily.temperatureMin().stream().mapToDouble(Double::doubleValue).min().orElseThrow();
        double maxTemperature = daily.temperatureMax().stream().mapToDouble(Double::doubleValue).max().orElseThrow();
        double maxRainProbability = daily.precipitationProbabilityMax().stream().mapToDouble(Double::doubleValue).max().orElseThrow();
        double totalRain = daily.precipitationSum().stream().mapToDouble(Double::doubleValue).sum();
        double maxWind = daily.windSpeedMax().stream().mapToDouble(Double::doubleValue).max().orElseThrow();
        int weatherCode = daily.weatherCode() == null || daily.weatherCode().isEmpty()
                ? -1 : daily.weatherCode().get(0);

        LocalDate from = LocalDate.parse(daily.time().get(0));
        LocalDate to = LocalDate.parse(daily.time().get(size - 1));
        return new WeatherSummary(
                destinationId, from, to, minTemperature, maxTemperature,
                maxRainProbability, totalRain, maxWind, weatherCode,
                WeatherScorer.score(minTemperature, maxTemperature, maxRainProbability, totalRain, maxWind),
                WeatherSource.LIVE
        );
    }

    private void requireSize(List<?> values, int expected) {
        if (values.size() != expected || values.stream().anyMatch(value -> value == null)) {
            throw new IllegalStateException("Open-Meteo returned inconsistent daily arrays");
        }
    }
}
