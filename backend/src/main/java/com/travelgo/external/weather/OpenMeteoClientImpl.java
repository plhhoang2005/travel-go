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
        map.put("ha-noi", new double[]{21.0285, 105.8542});
        map.put("sa-pa", new double[]{22.3364, 103.8438});
        map.put("ha-giang", new double[]{22.8233, 104.9836});
        map.put("ninh-binh", new double[]{20.2506, 105.9745});
        map.put("ha-long", new double[]{20.9505, 107.0734});
        map.put("cao-bang", new double[]{22.6667, 106.2500});
        map.put("cat-ba", new double[]{20.7275, 106.9997});
        map.put("phong-nha", new double[]{17.5898, 106.2829});
        map.put("hue", new double[]{16.4637, 107.5909});
        map.put("hoi-an", new double[]{15.8801, 108.3380});
        map.put("quy-nhon", new double[]{13.7820, 109.2197});
        map.put("phu-yen", new double[]{13.0882, 109.3075});
        map.put("mang-den", new double[]{14.6000, 108.2833});
        map.put("mui-ne", new double[]{10.9333, 108.2833});
        map.put("ho-chi-minh", new double[]{10.8231, 106.6297});
        map.put("can-tho", new double[]{10.0452, 105.7469});
        map.put("an-giang", new double[]{10.5216, 105.1259});
        map.put("con-dao", new double[]{8.6835, 106.6067});
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
