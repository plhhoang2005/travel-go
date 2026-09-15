package com.travelgo.external.weather;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class WeatherServiceTest {

    private OpenMeteoClient openMeteoClient;
    private WeatherService weatherService;

    @BeforeEach
    public void setUp() {
        openMeteoClient = Mockito.mock(OpenMeteoClient.class);
        weatherService = new WeatherService(openMeteoClient);
    }

    @Test
    public void testCalculateWeatherScore_OptimalWeather() {
        // avgPrecip = 0.0 -> precipScore = 10.0
        // avgTempMax = 26.0 -> tempScore = 10.0
        // weatherScore = (10 + 10) / 2 = 10.0
        double score = weatherService.calculateWeatherScore(0.0, 26.0);
        assertEquals(10.0, score, 0.001);
    }

    @Test
    public void testCalculateWeatherScore_ModerateWeather() {
        // avgPrecip = 2.5 -> precipScore = max(0, 10 - 5.0) = 5.0
        // avgTempMax = 30.0 -> tempScore = max(0, 10 - 4.0 * 0.5) = 8.0
        // weatherScore = (5.0 + 8.0) / 2 = 6.5
        double score = weatherService.calculateWeatherScore(2.5, 30.0);
        assertEquals(6.5, score, 0.001);
    }

    @Test
    public void testCalculateWeatherScore_SevereWeather() {
        // avgPrecip = 6.0 -> precipScore = max(0, 10 - 12) = 0.0
        // avgTempMax = 38.0 -> tempScore = max(0, 10 - 12 * 0.5) = 4.0
        // weatherScore = (0.0 + 4.0) / 2 = 2.0
        double score = weatherService.calculateWeatherScore(6.0, 38.0);
        assertEquals(2.0, score, 0.001);
    }

    @Test
    public void testGetWeatherForCity_Success_LiveSource() {
        OpenMeteoResponse mockResponse = new OpenMeteoResponse();
        OpenMeteoResponse.DailyData daily = new OpenMeteoResponse.DailyData();
        daily.setPrecipitationSum(List.of(0.0, 1.0, 0.5, 0.0, 0.0, 0.0, 0.0)); // avg = 0.214
        daily.setTemperature2mMax(List.of(25.0, 26.0, 27.0, 26.0, 25.0, 26.0, 27.0)); // avg = 26.0
        mockResponse.setDaily(daily);

        when(openMeteoClient.fetchForecastForCity("da-lat")).thenReturn(mockResponse);

        WeatherInfo info = weatherService.getWeatherForCity("da-lat");

        assertNotNull(info);
        assertEquals(WeatherService.SOURCE_LIVE, info.getSource());
        assertEquals("LIVE: Open-Meteo API", info.getSource());
        assertTrue(info.getWeatherScore() > 0 && info.getWeatherScore() <= 10.0);
    }

    @Test
    public void testGetWeatherForCity_Fallback_OnException() {
        when(openMeteoClient.fetchForecastForCity(anyString()))
                .thenThrow(new RuntimeException("Open-Meteo API Timeout (3s)"));

        WeatherInfo info = weatherService.getWeatherForCity("da-lat");

        assertNotNull(info);
        assertEquals(WeatherService.SOURCE_FALLBACK, info.getSource());
        assertEquals("FALLBACK: Open-Meteo Offline (Mock Weather)", info.getSource());
        assertEquals(8.0, info.getWeatherScore(), 0.001);
    }

    @Test
    public void testGetWeatherForCity_Fallback_OnNullResponse() {
        when(openMeteoClient.fetchForecastForCity(anyString())).thenReturn(null);

        WeatherInfo info = weatherService.getWeatherForCity("da-lat");

        assertNotNull(info);
        assertEquals(WeatherService.SOURCE_FALLBACK, info.getSource());
        assertEquals(8.0, info.getWeatherScore(), 0.001);
    }

    @Test
    public void testGetWeatherByCoordinates_Success() {
        OpenMeteoResponse mockResponse = new OpenMeteoResponse();
        OpenMeteoResponse.DailyData daily = new OpenMeteoResponse.DailyData();
        daily.setPrecipitationSum(List.of(0.0, 0.0, 0.0));
        daily.setTemperature2mMax(List.of(26.0, 26.0, 26.0));
        mockResponse.setDaily(daily);

        when(openMeteoClient.fetchForecast(anyDouble(), anyDouble())).thenReturn(mockResponse);

        WeatherInfo info = weatherService.getWeatherByCoordinates(11.9465, 108.4419);

        assertNotNull(info);
        assertEquals(WeatherService.SOURCE_LIVE, info.getSource());
        assertEquals(10.0, info.getWeatherScore(), 0.001);
    }

    @Test
    public void testCityCoordinatesMapping() {
        OpenMeteoClient client = new OpenMeteoClientImpl();

        double[] dalat = client.getCoordinates("da-lat");
        assertNotNull(dalat);
        assertEquals(11.9465, dalat[0], 0.0001);
        assertEquals(108.4419, dalat[1], 0.0001);

        double[] nhatrang = client.getCoordinates("nha-trang");
        assertNotNull(nhatrang);
        assertEquals(12.2388, nhatrang[0], 0.0001);
        assertEquals(109.1967, nhatrang[1], 0.0001);

        double[] phuquoc = client.getCoordinates("phu-quoc");
        assertNotNull(phuquoc);
        assertEquals(10.2899, phuquoc[0], 0.0001);
        assertEquals(103.9840, phuquoc[1], 0.0001);

        double[] danang = client.getCoordinates("da-nang");
        assertNotNull(danang);
        assertEquals(16.0544, danang[0], 0.0001);
        assertEquals(108.2022, danang[1], 0.0001);

        double[] vungtau = client.getCoordinates("vung-tau");
        assertNotNull(vungtau);
        assertEquals(10.3460, vungtau[0], 0.0001);
        assertEquals(107.0843, vungtau[1], 0.0001);
    }
}
