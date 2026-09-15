package com.travelgo.service;

import com.travelgo.data.DataLoaderService;
import com.travelgo.decision.itinerary.ItineraryBuilder;
import com.travelgo.decision.mcda.DestinationScorer;
import com.travelgo.decision.pareto.TransportOptimizer;
import com.travelgo.decision.sensitivity.BudgetSimulator;
import com.travelgo.dto.BudgetSensitivityResult;
import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse;
import com.travelgo.dto.PlanTripResponse.*;
import com.travelgo.external.WeatherService;
import com.travelgo.external.WeatherSource;
import com.travelgo.external.WeatherSummary;
import com.travelgo.model.Destination;
import com.travelgo.model.DestinationHotels.HotelCategory;
import com.travelgo.model.DestinationPois.PoiItem;
import com.travelgo.model.RouteTransport;
import com.travelgo.model.RouteTransport.Option;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TripPlanningService {

    private final DestinationScorer destinationScorer;
    private final TransportOptimizer transportOptimizer;
    private final ItineraryBuilder itineraryBuilder;
    private final BudgetSimulator budgetSimulator;
    private final DataLoaderService dataLoaderService;
    private final WeatherService weatherService;

    public TripPlanningService(DestinationScorer destinationScorer,
                               TransportOptimizer transportOptimizer,
                               ItineraryBuilder itineraryBuilder,
                               BudgetSimulator budgetSimulator,
                               DataLoaderService dataLoaderService,
                               WeatherService weatherService) {
        this.destinationScorer = destinationScorer;
        this.transportOptimizer = transportOptimizer;
        this.itineraryBuilder = itineraryBuilder;
        this.budgetSimulator = budgetSimulator;
        this.dataLoaderService = dataLoaderService;
        this.weatherService = weatherService;
    }

    public PlanTripResponse planTrip(PlanTripRequest req) {
        PlanTripResponse resp = new PlanTripResponse();

        // 1. Process destinations with live or fallback weather and the MCDA engine.
        List<Destination> rawDestinations = dataLoaderService.getDestinations();
        Map<String, WeatherSummary> weatherByDestination = loadWeather(rawDestinations, req.getNumDays());
        List<DestinationCard> destinationCards = new ArrayList<>();

        for (Destination dest : rawDestinations) {
            RouteTransport rt = dataLoaderService.getRouteTransport(req.getOrigin(), dest.getId());
            double travelTime = 6.0;
            long transportCost = 600_000L;

            if (rt != null && rt.getOptions() != null && !rt.getOptions().isEmpty()) {
                Option opt = rt.getOptions().get(0);
                travelTime = opt.getDurationHours();
                transportCost = opt.getPriceTotalVnd();
            }

            long estCost = (dest.getAvgDailyCostVnd() * req.getNumDays()) + transportCost;
            double weatherScore = weatherScore(weatherByDestination, dest.getId());
            DestinationCard card = destinationScorer.scoreDestination(dest, req, weatherScore, travelTime, estCost);
            destinationCards.add(card);
        }

        destinationCards.sort((a, b) -> Double.compare(b.getTotalScore(), a.getTotalScore()));
        resp.setTopDestinations(destinationCards.stream().limit(3).toList());

        DestinationCard winner = destinationCards.isEmpty() ? null : destinationCards.get(0);
        String winnerId = winner != null ? winner.getId() : "da-lat";
        resp.setWinnerId(winnerId);

        // 2. Process transport options with Pareto optimizer.
        RouteTransport winnerRoute = dataLoaderService.getRouteTransport(req.getOrigin(), winnerId);
        List<TransportOption> transports = transportOptimizer.optimize(convertTransportOptions(winnerRoute));
        resp.setTransportOptions(transports);

        // 3. Build itinerary with greedy constraint scheduler.
        List<PoiItem> pois = dataLoaderService.getPoisForDestination(winnerId);
        long attractionsBudget = 500_000L;
        List<ItineraryDay> days = itineraryBuilder.buildItinerary(winnerId, req.getNumDays(), attractionsBudget, pois);
        resp.setItineraryDays(days);

        // 4. Calculate budget breakdown.
        TransportOption bestTransport = transports.stream()
                .filter(t -> t.isParetoOptimal() && ("balanced".equalsIgnoreCase(t.getTradeoffType())
                        || "cheapest".equalsIgnoreCase(t.getTradeoffType())))
                .findFirst()
                .orElse(!transports.isEmpty() ? transports.get(0) : null);

        long transportCost = bestTransport != null ? bestTransport.getPriceTotalVnd() : 500_000L;
        List<HotelCategory> hotelCats = dataLoaderService.getHotelsForDestination(winnerId);
        long hotelCostPerNight = hotelCats.isEmpty() ? 500_000L : hotelCats.get(0).getAvgNightlyVnd();
        long totalHotelCost = hotelCostPerNight * req.getNumDays();
        long foodCost = 300_000L * req.getNumDays();
        long totalAttractionsCost = days.stream()
                .flatMap(d -> d.getActivities().stream())
                .mapToLong(Activity::getCostVnd)
                .sum();

        long spent = transportCost + totalHotelCost + foodCost + totalAttractionsCost;
        BudgetBreakdown breakdown = new BudgetBreakdown();
        breakdown.setTransport(transportCost);
        breakdown.setAccommodation(totalHotelCost);
        breakdown.setFood(foodCost);
        breakdown.setAttractions(totalAttractionsCost);
        breakdown.setRemainingSafetyMargin(req.getBudgetVnd() - spent);
        resp.setBudgetBreakdown(breakdown);

        // 5. Explanation and transparent data-source indicator.
        resp.setAiExplanation(String.format(
                "Điểm đến %s được hệ thống đề xuất là lựa chọn tối ưu nhất (điểm MCDA: %.2f/10) nhờ chỉ số Phù hợp Sở thích và Chi phí hợp lý. Phương tiện %s được khuyến nghị dựa trên phân tích Pareto Dominance.",
                winner != null ? winner.getName() : winnerId,
                winner != null ? winner.getTotalScore() : 9.0,
                bestTransport != null ? bestTransport.getDisplayName() : "Vận chuyển công cộng"
        ));

        boolean allLive = weatherByDestination.size() == rawDestinations.size()
                && weatherByDestination.values().stream().allMatch(item -> item.source() == WeatherSource.LIVE);
        Map<String, String> sources = new LinkedHashMap<>();
        sources.put("weather", allLive ? "Open-Meteo Live API" : "Weather fallback dataset");
        sources.put("prices", "TravelGO Reference Dataset (09/2026)");
        resp.setDataSources(sources);

        List<String> assumptions = new ArrayList<>();
        assumptions.add("Giá vé xe/tàu và khách sạn có thể dao động 10-15% tùy thời điểm đặt thực tế.");
        if (!allLive) {
            assumptions.add("Một phần dữ liệu thời tiết đang dùng bộ dữ liệu dự phòng do API trực tiếp không khả dụng.");
        }
        resp.setAssumptions(assumptions);
        return resp;
    }

    public BudgetSensitivityResult simulateSensitivity(PlanTripRequest req) {
        List<Destination> destinations = dataLoaderService.getDestinations();
        Map<String, Double> weatherScores = loadWeather(destinations, req.getNumDays()).entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().suitabilityScore()));
        return budgetSimulator.simulateSensitivity(req, weatherScores);
    }

    private Map<String, WeatherSummary> loadWeather(List<Destination> destinations, int days) {
        List<String> destinationIds = destinations.stream().map(Destination::getId).toList();
        return weatherService.getWeather(destinationIds, days);
    }

    private double weatherScore(Map<String, WeatherSummary> weather, String destinationId) {
        WeatherSummary summary = weather.get(destinationId);
        return summary == null ? DestinationScorer.DEFAULT_NEUTRAL_SCORE : summary.suitabilityScore();
    }

    private List<TransportOption> convertTransportOptions(RouteTransport rt) {
        List<TransportOption> result = new ArrayList<>();
        if (rt == null || rt.getOptions() == null) return result;

        for (Option opt : rt.getOptions()) {
            TransportOption dto = new TransportOption();
            dto.setMode(opt.getMode());
            dto.setDisplayName(opt.getDisplayName());
            dto.setPriceTotalVnd(opt.getPriceTotalVnd());
            dto.setDurationHours(opt.getDurationHours());
            dto.setComfortScore(opt.getComfortScore());
            dto.setParetoOptimal(opt.isParetoOptimal());
            dto.setTradeoffType(opt.getTradeoffType());
            dto.setRecommendationReason(opt.getRecommendationReason());
            result.add(dto);
        }
        return result;
    }
}
