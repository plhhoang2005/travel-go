package com.travelgo.data;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelgo.model.*;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;

@Component
public class DataLoaderService {

    private final ObjectMapper objectMapper;

    private List<Destination> destinations = new ArrayList<>();
    private List<RouteTransport> transportRoutes = new ArrayList<>();
    private List<DestinationPois> poiList = new ArrayList<>();
    private List<DestinationHotels> hotelList = new ArrayList<>();
    private PricingData pricingData;

    public DataLoaderService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        loadDestinations();
        loadTransport();
        loadPois();
        loadHotels();
        loadPricing();
    }

    private void loadDestinations() {
        try (InputStream is = new ClassPathResource("data/destinations.json").getInputStream()) {
            destinations = objectMapper.readValue(is, new TypeReference<List<Destination>>() {});
        } catch (Exception e) {
            destinations = Collections.emptyList();
        }
    }

    private void loadTransport() {
        try (InputStream is = new ClassPathResource("data/transport.json").getInputStream()) {
            transportRoutes = objectMapper.readValue(is, new TypeReference<List<RouteTransport>>() {});
        } catch (Exception e) {
            transportRoutes = Collections.emptyList();
        }
    }

    private void loadPois() {
        try (InputStream is = new ClassPathResource("data/pois.json").getInputStream()) {
            poiList = objectMapper.readValue(is, new TypeReference<List<DestinationPois>>() {});
        } catch (Exception e) {
            poiList = Collections.emptyList();
        }
    }

    private void loadHotels() {
        try (InputStream is = new ClassPathResource("data/hotels.json").getInputStream()) {
            hotelList = objectMapper.readValue(is, new TypeReference<List<DestinationHotels>>() {});
        } catch (Exception e) {
            hotelList = Collections.emptyList();
        }
    }

    private void loadPricing() {
        try (InputStream is = new ClassPathResource("data/pricing.json").getInputStream()) {
            pricingData = objectMapper.readValue(is, PricingData.class);
        } catch (Exception e) {
            pricingData = new PricingData();
        }
    }

    public List<Destination> getDestinations() {
        return destinations;
    }

    public List<RouteTransport> getTransportRoutes() {
        return transportRoutes;
    }

    public List<DestinationPois> getPoiList() {
        return poiList;
    }

    public List<DestinationHotels> getHotelList() {
        return hotelList;
    }

    public PricingData getPricingData() {
        return pricingData;
    }

    public Destination getDestinationById(String id) {
        return destinations.stream()
                .filter(d -> d.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
    }

    public RouteTransport getRouteTransport(String origin, String destinationId) {
        return transportRoutes.stream()
                .filter(rt -> rt.getRouteKey().equalsIgnoreCase(origin + "-" + destinationId) ||
                              rt.getRouteKey().equalsIgnoreCase("Ho Chi Minh-" + destinationId))
                .findFirst()
                .orElse(null);
    }

    public List<DestinationPois.PoiItem> getPoisForDestination(String destinationId) {
        return poiList.stream()
                .filter(p -> p.getDestinationId().equalsIgnoreCase(destinationId))
                .findFirst()
                .map(DestinationPois::getPois)
                .orElse(Collections.emptyList());
    }

    public List<DestinationHotels.HotelCategory> getHotelsForDestination(String destinationId) {
        return hotelList.stream()
                .filter(h -> h.getDestinationId().equalsIgnoreCase(destinationId))
                .findFirst()
                .map(DestinationHotels::getCategories)
                .orElse(Collections.emptyList());
    }
}
