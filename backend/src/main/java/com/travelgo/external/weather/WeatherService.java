package com.travelgo.external.weather;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    public static final String SOURCE_LIVE = "LIVE: Open-Meteo API";
    public static final String SOURCE_FALLBACK = "FALLBACK: Open-Meteo Offline (Mock Weather)";
    public static final double DEFAULT_FALLBACK_SCORE = 8.0;

    private final OpenMeteoClient openMeteoClient;

    public WeatherService(OpenMeteoClient openMeteoClient) {
        this.openMeteoClient = openMeteoClient;
    }

    public WeatherInfo getWeatherForCity(String cityId) {
        try {
            OpenMeteoResponse response = openMeteoClient.fetchForecastForCity(cityId);
            if (response != null && response.getDaily() != null) {
                return calculateWeatherInfo(response, SOURCE_LIVE);
            }
        } catch (Exception e) {
            log.warn("Failed to fetch live weather for city [{}]: {}. Falling back to default weather.", cityId, e.getMessage());
        }
        return createFallbackWeatherInfo();
    }

    public WeatherInfo getWeatherByCoordinates(double latitude, double longitude) {
        try {
            OpenMeteoResponse response = openMeteoClient.fetchForecast(latitude, longitude);
            if (response != null && response.getDaily() != null) {
                return calculateWeatherInfo(response, SOURCE_LIVE);
            }
        } catch (Exception e) {
            log.warn("Failed to fetch live weather for coords [{}, {}]: {}. Falling back to default weather.", latitude, longitude, e.getMessage());
        }
        return createFallbackWeatherInfo();
    }

    public WeatherInfo calculateWeatherInfo(OpenMeteoResponse response, String source) {
        OpenMeteoResponse.DailyData daily = response.getDaily();
        if (daily == null) {
            return createFallbackWeatherInfo();
        }

        List<Double> precipList = daily.getPrecipitationSum();
        List<Double> tempMaxList = daily.getTemperature2mMax();

        double avgPrecipitation = (precipList != null && !precipList.isEmpty())
                ? precipList.stream().filter(Objects::nonNull).mapToDouble(Double::doubleValue).average().orElse(0.0)
                : 0.0;

        double avgTempMax = (tempMaxList != null && !tempMaxList.isEmpty())
                ? tempMaxList.stream().filter(Objects::nonNull).mapToDouble(Double::doubleValue).average().orElse(26.0)
                : 26.0;

        double score = calculateWeatherScore(avgPrecipitation, avgTempMax);

        return new WeatherInfo(score, source, Math.round(avgPrecipitation * 100.0) / 100.0, Math.round(avgTempMax * 100.0) / 100.0);
    }

    public double calculateWeatherScore(double avgPrecipitation, double avgTempMax) {
        double precipScore = Math.max(0.0, 10.0 - avgPrecipitation * 2.0);
        double tempScore = Math.max(0.0, 10.0 - Math.abs(avgTempMax - 26.0) * 0.5);
        double rawScore = (precipScore + tempScore) / 2.0;
        return Math.round(rawScore * 100.0) / 100.0;
    }

    public WeatherInfo createFallbackWeatherInfo() {
        return new WeatherInfo(DEFAULT_FALLBACK_SCORE, SOURCE_FALLBACK, 0.0, 26.0);
    }
}
