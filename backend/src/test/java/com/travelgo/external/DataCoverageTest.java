package com.travelgo.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class DataCoverageTest {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void everyDestinationHasHotelPoiAndFallbackWeather() throws IOException {
        Set<String> destinations = values("data/destinations.json", "id");
        assertThat(values("data/hotels.json", "destination_id")).containsExactlyInAnyOrderElementsOf(destinations);
        assertThat(values("data/pois.json", "destination_id")).containsExactlyInAnyOrderElementsOf(destinations);
        assertThat(values("data/weather-fallback.json", "destination_id")).containsExactlyInAnyOrderElementsOf(destinations);
    }

    @Test
    void demoDestinationsHaveTransportFromHoChiMinhCity() throws IOException {
        Set<String> routes = values("data/transport.json", "route_key");
        assertThat(routes).contains(
                "Ho Chi Minh-da-lat",
                "Ho Chi Minh-phu-quoc",
                "Ho Chi Minh-vung-tau"
        );
    }

    private Set<String> values(String resource, String field) throws IOException {
        try (InputStream input = getClass().getClassLoader().getResourceAsStream(resource)) {
            assertThat(input).as("resource %s", resource).isNotNull();
            JsonNode root = objectMapper.readTree(input);
            Set<String> values = new HashSet<>();
            root.forEach(node -> values.add(node.path(field).asText()));
            return values;
        }
    }
}
