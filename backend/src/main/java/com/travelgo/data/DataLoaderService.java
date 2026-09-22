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
        RouteTransport match = transportRoutes.stream()
                .filter(rt -> rt.getRouteKey().equalsIgnoreCase(origin + "-" + destinationId) ||
                              rt.getRouteKey().equalsIgnoreCase("Ho Chi Minh-" + destinationId))
                .findFirst()
                .orElse(null);

        if (match != null && match.getOptions() != null && !match.getOptions().isEmpty()) {
            return match;
        }

        // Dynamically compute transport based on OSM coordinates
        return generateDynamicRouteTransport(origin, destinationId);
    }

    private RouteTransport generateDynamicRouteTransport(String origin, String destinationId) {
        Destination dest = getDestinationById(destinationId);
        if (dest == null) return null;

        double originLat = 10.8231;
        double originLon = 106.6297; // Default: Ho Chi Minh
        if (origin != null) {
            String lower = origin.toLowerCase();
            if (lower.contains("hà nội") || lower.contains("ha noi")) {
                originLat = 21.0285;
                originLon = 105.8542;
            } else if (lower.contains("đà nẵng") || lower.contains("da nang")) {
                originLat = 16.0544;
                originLon = 108.2022;
            } else if (lower.contains("cần thơ") || lower.contains("can tho")) {
                originLat = 10.0452;
                originLon = 105.7469;
            }
        }

        double destLat = 11.9465;
        double destLon = 108.4419;
        if (dest.getCoordinates() != null) {
            Double lat = dest.getCoordinates().get("lat");
            Double lon = dest.getCoordinates().get("lon");
            if (lon == null) lon = dest.getCoordinates().get("lng");
            if (lat != null) destLat = lat;
            if (lon != null) destLon = lon;
        }

        double distanceKm = calculateHaversineDistanceKm(originLat, originLon, destLat, destLon);

        RouteTransport rt = new RouteTransport();
        rt.setRouteKey(origin + "-" + destinationId);
        List<RouteTransport.Option> options = new ArrayList<>();

        boolean isIsland = destinationId.contains("phu-quoc") || destinationId.contains("con-dao") || destinationId.contains("cat-ba");

        if (distanceKm > 250 || isIsland) {
            RouteTransport.Option plane = new RouteTransport.Option();
            plane.setMode("may_bay");
            plane.setDisplayName("Máy bay khứ hồi (Vietnam Airlines / Vietjet Air)");
            plane.setDurationHours(isIsland ? 1.0 : Math.max(1.0, Math.round((distanceKm / 600.0 + 0.8) * 10.0) / 10.0));
            long planePrice = isIsland ? 1_900_000L : Math.min(2_500_000L, 1_200_000L + (long)(distanceKm * 750));
            plane.setPriceTotalVnd(planePrice);
            plane.setComfortScore(9);
            plane.setParetoOptimal(true);
            plane.setTradeoffType("fastest");
            plane.setRecommendationReason("Tiết kiệm thời gian tối đa, phù hợp chuyến đi ngắn");
            options.add(plane);
        }

        if (!isIsland && distanceKm >= 150) {
            RouteTransport.Option train = new RouteTransport.Option();
            train.setMode("tau_lua");
            train.setDisplayName("Tàu hỏa (Ghế mềm điều hòa Đường Sắt Việt Nam)");
            train.setDurationHours(Math.round((distanceKm / 50.0 + 1.0) * 10.0) / 10.0);
            long trainPrice = Math.min(1_400_000L, 350_000L + (long)(distanceKm * 550));
            train.setPriceTotalVnd(trainPrice);
            train.setComfortScore(8);
            train.setParetoOptimal(true);
            train.setTradeoffType("balanced");
            train.setRecommendationReason("Trải nghiệm cảnh quan dọc đường, chi phí hợp lý");
            options.add(train);
        }

        RouteTransport.Option bus = new RouteTransport.Option();
        bus.setMode("xe_khach");
        bus.setDisplayName(isIsland ? "Tàu cao tốc / Phà biển kết hợp xe khách" : "Xe khách giường nằm Limousine cao cấp");
        bus.setDurationHours(Math.round((distanceKm / 45.0 + 1.2) * 10.0) / 10.0);
        long busPrice = Math.min(950_000L, 200_000L + (long)(distanceKm * 400));
        bus.setPriceTotalVnd(busPrice);
        bus.setComfortScore(7);
        bus.setParetoOptimal(true);
        bus.setTradeoffType("cheapest");
        bus.setRecommendationReason("Chi phí tiết kiệm nhất, tối ưu cho ngân sách trẻ");
        options.add(bus);

        rt.setOptions(options);
        return rt;
    }

    private double calculateHaversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDist = Math.toRadians(lat2 - lat1);
        double lonDist = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDist / 2) * Math.sin(latDist / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDist / 2) * Math.sin(lonDist / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.max(50.0, R * c);
    }

    public List<DestinationPois.PoiItem> getPoisForDestination(String destinationId) {
        List<DestinationPois.PoiItem> pois = poiList.stream()
                .filter(p -> p.getDestinationId().equalsIgnoreCase(destinationId))
                .findFirst()
                .map(DestinationPois::getPois)
                .orElse(null);

        if (pois != null && !pois.isEmpty()) {
            return pois;
        }

        // Generate dynamic POIs tailored to destination
        Destination dest = getDestinationById(destinationId);
        String name = dest != null ? dest.getName() : destinationId;
        List<DestinationPois.PoiItem> dynamicPois = new ArrayList<>();

        dynamicPois.add(createPoi("Khu trung tâm & Biểu tượng văn hóa " + name, "cultural", 50000, 2.0, "morning"));
        dynamicPois.add(createPoi("Thắng cảnh thiên nhiên nổi tiếng " + name, "nature", 120000, 3.0, "afternoon"));
        dynamicPois.add(createPoi("Chợ đêm ẩm thực & Trải nghiệm đặc sản", "food", 150000, 2.0, "evening"));
        dynamicPois.add(createPoi("Điểm check-in toàn cảnh & Đón hoàng hôn", "sightseeing", 80000, 2.5, "afternoon"));

        return dynamicPois;
    }

    private DestinationPois.PoiItem createPoi(String name, String type, long cost, double duration, String timeOfDay) {
        DestinationPois.PoiItem item = new DestinationPois.PoiItem();
        item.setName(name);
        item.setType(type);
        item.setCostVnd(cost);
        item.setDurationHours(duration);
        item.setTimeOfDay(timeOfDay);
        return item;
    }

    public List<DestinationHotels.HotelCategory> getHotelsForDestination(String destinationId) {
        List<DestinationHotels.HotelCategory> hotels = hotelList.stream()
                .filter(h -> h.getDestinationId().equalsIgnoreCase(destinationId))
                .findFirst()
                .map(DestinationHotels::getCategories)
                .orElse(null);

        if (hotels != null && !hotels.isEmpty()) {
            return hotels;
        }

        Destination dest = getDestinationById(destinationId);
        long baseCost = (dest != null) ? dest.getAvgDailyCostVnd() : 600_000L;

        List<DestinationHotels.HotelCategory> dynamicHotels = new ArrayList<>();
        dynamicHotels.add(createHotelCategory("budget", "Homestay / Nhà nghỉ tiện nghi", Math.max(250_000L, (long)(baseCost * 0.5))));
        dynamicHotels.add(createHotelCategory("midscale", "Khách sạn 3 sao trung tâm", Math.max(450_000L, (long)(baseCost * 0.9))));
        dynamicHotels.add(createHotelCategory("upscale", "Khách sạn 4 sao / Resort nghỉ dưỡng", Math.max(900_000L, (long)(baseCost * 1.8))));
        return dynamicHotels;
    }

    private DestinationHotels.HotelCategory createHotelCategory(String tier, String name, long nightlyCost) {
        DestinationHotels.HotelCategory cat = new DestinationHotels.HotelCategory();
        cat.setTier(tier);
        cat.setName(name);
        cat.setAvgNightlyVnd(nightlyCost);
        return cat;
    }
}
