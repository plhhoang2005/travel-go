package com.travelgo.external.weather;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
public class OpenMeteoClientImpl implements OpenMeteoClient {

    private static final String BASE_URL = "https://api.open-meteo.com";
    private static final Map<String, double[]> CITY_COORDINATES;

    static {
        Map<String, double[]> map = new HashMap<>();
        map.put("da-lat", new double[]{11.9465, 108.4419});
        map.put("nha-trang", new double[]{12.2388, 109.1967});
        map.put("phu-quoc", new double[]{10.2899, 103.9840});
        map.put("da-nang", new double[]{16.0544, 108.2022});
        map.put("vung-tau", new double[]{10.3460, 107.0843});
        CITY_COORDINATES = Collections.unmodifiableMap(map);
    }

    private final WebClient webClient;

    public OpenMeteoClientImpl() {
        this.webClient = WebClient.builder()
                .baseUrl(BASE_URL)
                .build();
    }

    public OpenMeteoClientImpl(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    public double[] getCoordinates(String cityId) {
        if (cityId == null) {
            return null;
        }
        return CITY_COORDINATES.get(cityId.toLowerCase().trim());
    }

    @Override
    public OpenMeteoResponse fetchForecast(double latitude, double longitude) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/forecast")
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max")
                        .queryParam("timezone", "Asia/Ho_Chi_Minh")
                        .queryParam("forecast_days", 7)
                        .build())
                .retrieve()
                .bodyToMono(OpenMeteoResponse.class)
                .timeout(Duration.ofSeconds(3))
                .block();
    }

    @Override
    public OpenMeteoResponse fetchForecastForCity(String cityId) {
        double[] coords = getCoordinates(cityId);
        if (coords == null) {
            throw new IllegalArgumentException("Unknown city ID: " + cityId);
        }
        return fetchForecast(coords[0], coords[1]);
    }

    @Override
    public Map<String, double[]> getCityCoordinatesMap() {
        return CITY_COORDINATES;
    }
}
