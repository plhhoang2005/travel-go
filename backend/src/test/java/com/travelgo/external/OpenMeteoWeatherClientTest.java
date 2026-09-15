package com.travelgo.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelgo.model.Destination;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class OpenMeteoWeatherClientTest {
    private MockWebServer server;
    private OpenMeteoWeatherClient client;
    private Destination destination;

    @BeforeEach
    void setUp() throws IOException {
        server = new MockWebServer();
        server.start();
        WeatherFallbackRepository fallback = new WeatherFallbackRepository(new ObjectMapper());
        client = new OpenMeteoWeatherClient(
                WebClient.builder(), fallback, server.url("/").toString(), 1
        );
        destination = new Destination();
        destination.setId("da-lat");
        destination.setName("Đà Lạt");
        destination.setCoordinates(Map.of("lat", 11.9465, "lon", 108.4419));
    }

    @AfterEach
    void tearDown() throws IOException {
        server.shutdown();
    }

    @Test
    void mapsSuccessfulOpenMeteoResponse() {
        server.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("""
                        {"daily":{
                          "time":["2026-09-15","2026-09-16"],
                          "weather_code":[1,2],
                          "temperature_2m_max":[24.0,25.0],
                          "temperature_2m_min":[15.0,16.0],
                          "precipitation_probability_max":[20.0,30.0],
                          "precipitation_sum":[1.0,2.0],
                          "wind_speed_10m_max":[15.0,18.0]
                        }}
                        """));

        WeatherSummary result = client.fetch(destination, 2).block();

        assertThat(result).isNotNull();
        assertThat(result.source()).isEqualTo(WeatherSource.LIVE);
        assertThat(result.temperatureMinC()).isEqualTo(15.0);
        assertThat(result.temperatureMaxC()).isEqualTo(25.0);
        assertThat(result.precipitationSumMm()).isEqualTo(3.0);
    }

    @Test
    void usesFallbackWhenApiFails() {
        server.enqueue(new MockResponse().setResponseCode(500));

        WeatherSummary result = client.fetch(destination, 3).block();

        assertThat(result).isNotNull();
        assertThat(result.source()).isEqualTo(WeatherSource.FALLBACK);
        assertThat(result.weatherCode()).isEqualTo(-1);
    }
}
