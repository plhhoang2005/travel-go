package com.travelgo.service;

import com.travelgo.data.DataLoaderService;
import com.travelgo.decision.budget.BudgetCalculator;
import com.travelgo.decision.itinerary.ItineraryBuilder;
import com.travelgo.decision.mcda.DestinationScorer;
import com.travelgo.decision.pareto.TransportOptimizer;
import com.travelgo.decision.sensitivity.BudgetSimulator;
import com.travelgo.dto.BudgetSensitivityResult;
import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse;
import com.travelgo.dto.PlanTripResponse.*;
import com.travelgo.external.weather.WeatherInfo;
import com.travelgo.external.weather.WeatherService;
import com.travelgo.model.Destination;
import com.travelgo.model.DestinationHotels.HotelCategory;
import com.travelgo.model.DestinationPois.PoiItem;
import com.travelgo.model.RouteTransport;
import com.travelgo.model.RouteTransport.Option;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TripPlanningService {
    private static final long DEFAULT_FOOD_DAILY_VND = 350_000L;

    private final DestinationScorer destinationScorer;
    private final TransportOptimizer transportOptimizer;
    private final ItineraryBuilder itineraryBuilder;
    private final BudgetSimulator budgetSimulator;
    private final DataLoaderService dataLoaderService;
    private final WeatherService weatherService;
    private final RuleBasedExplainerService ruleBasedExplainerService;

    public TripPlanningService(DestinationScorer destinationScorer,
                               TransportOptimizer transportOptimizer,
                               ItineraryBuilder itineraryBuilder,
                               BudgetSimulator budgetSimulator,
                               DataLoaderService dataLoaderService,
                               WeatherService weatherService,
                               RuleBasedExplainerService ruleBasedExplainerService) {
        this.destinationScorer = destinationScorer;
        this.transportOptimizer = transportOptimizer;
        this.itineraryBuilder = itineraryBuilder;
        this.budgetSimulator = budgetSimulator;
        this.dataLoaderService = dataLoaderService;
        this.weatherService = weatherService;
        this.ruleBasedExplainerService = ruleBasedExplainerService;
    }

    public PlanTripResponse planTrip(PlanTripRequest req) {
        PlanTripResponse resp = new PlanTripResponse();
        long totalBudget = BudgetCalculator.totalBudget(req);
        BudgetContext context = new BudgetContext();
        context.setInputBasis(req.getBudgetPerPersonVnd() > 0 ? "PER_PERSON" : "TOTAL_LEGACY");
        if (req.getBudgetPerPersonVnd() > 0) {
            context.setBudgetPerPersonVnd(req.getBudgetPerPersonVnd());
        }
        context.setTotalBudgetVnd(totalBudget);
        context.setNumPeople(req.getNumPeople());
        resp.setBudgetContext(context);

        // 1. Process Destinations with MCDA Engine
        List<Destination> rawDestinations = dataLoaderService.getDestinations();
        List<DestinationCard> destinationCards = new ArrayList<>();
        boolean allLiveWeather = true;

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
            
            // Real-time Open-Meteo Weather Service
            WeatherInfo weatherInfo = null;
            if (dest.getCoordinates() != null && dest.getCoordinates().containsKey("lat")) {
                Double lat = dest.getCoordinates().get("lat");
                Double lon = dest.getCoordinates().get("lon");
                if (lon == null) lon = dest.getCoordinates().get("lng");
                if (lat != null && lon != null) {
                    weatherInfo = weatherService.getWeatherByCoordinates(lat, lon);
                }
            }
            if (weatherInfo == null) {
                weatherInfo = weatherService.getWeatherForCity(dest.getId());
            }
            if (weatherInfo == null || !WeatherService.SOURCE_LIVE.equals(weatherInfo.getSource())) {
                allLiveWeather = false;
            }

            long estimatedGroupCost = BudgetCalculator.groupCost(estCost, req.getNumPeople());
            PlanTripRequest scoringRequest = new PlanTripRequest(req.getOrigin(), req.getNumDays(),
                    req.getNumPeople(), totalBudget, req.getPreferences(), req.getPriority());
            DestinationCard card = destinationScorer.scoreDestination(dest, scoringRequest, weatherInfo,
                    travelTime, estimatedGroupCost);
            card.setEstimatedCostVnd(estCost);
            card.setEstimatedGroupCostVnd(estimatedGroupCost);
            destinationCards.add(card);
        }

        // Sort by totalScore descending
        destinationCards.sort((a, b) -> Double.compare(b.getTotalScore(), a.getTotalScore()));
        resp.setTopDestinations(destinationCards);

        DestinationCard winner = destinationCards.isEmpty() ? null : destinationCards.get(0);
        String winnerId = winner != null ? winner.getId() : "da-lat";
        resp.setWinnerId(winnerId);

        // 2. Process Transport Options with Pareto Optimizer
        RouteTransport winnerRoute = dataLoaderService.getRouteTransport(req.getOrigin(), winnerId);
        List<TransportOption> transports = convertTransportOptions(winnerRoute, req.getNumPeople());
        transports = transportOptimizer.optimize(transports);
        resp.setTransportOptions(transports);

        // 3. Build Itinerary with Greedy Constraint Scheduler
        List<PoiItem> pois = dataLoaderService.getPoisForDestination(winnerId);
        long attractionsBudget = 500_000L;
        List<ItineraryDay> days = itineraryBuilder.buildItinerary(winnerId, req.getNumDays(), attractionsBudget, pois);
        for (ItineraryDay day : days) {
            for (Activity activity : day.getActivities()) {
                activity.setGroupCostVnd(BudgetCalculator.groupCost(activity.getCostVnd(), req.getNumPeople()));
            }
        }
        resp.setItineraryDays(days);

        // 4. Calculate Budget Breakdown
        TransportOption bestTransport = transports.stream()
                .filter(t -> t.isParetoOptimal() && ("balanced".equalsIgnoreCase(t.getTradeoffType()) || "cheapest".equalsIgnoreCase(t.getTradeoffType())))
                .findFirst()
                .orElse(!transports.isEmpty() ? transports.get(0) : null);

        long transportCost = bestTransport != null ? bestTransport.getPriceTotalVnd() : 500_000L;

        List<HotelCategory> hotelCats = dataLoaderService.getHotelsForDestination(winnerId);
        long hotelCostPerNight = hotelCats.isEmpty() ? 500_000L : hotelCats.get(0).getAvgNightlyVnd();
        long foodDaily = DEFAULT_FOOD_DAILY_VND;
        if (dataLoaderService.getPricingData() != null
                && dataLoaderService.getPricingData().getFoodDailyEstimate() != null) {
            foodDaily = dataLoaderService.getPricingData().getFoodDailyEstimate()
                    .getOrDefault("standard", DEFAULT_FOOD_DAILY_VND);
        }
        long attractionsPerPerson = BudgetCalculator.attractionsPerPerson(days, pois);
        BudgetBreakdown breakdown = BudgetCalculator.breakdown(totalBudget, req.getNumDays(),
                req.getNumPeople(), transportCost, hotelCostPerNight, foodDaily, attractionsPerPerson);
        resp.setBudgetBreakdown(breakdown);

        // 5. Decision Intelligence AI Explanation (Model 5: Non-Blocking Rule-Based Facts Generator)
        try {
            resp.setAiExplanation(ruleBasedExplainerService.generateExplanation(req, resp));
        } catch (Exception e) {
            resp.setAiExplanation(String.format(
                    "Điểm đến %s được hệ thống đề xuất là lựa chọn tối ưu nhất (điểm MCDA: %.2f/10) nhờ chỉ số Phù hợp Sở thích và Chi phí hợp lý. Phương tiện %s được khuyến nghị dựa trên phân tích Pareto Dominance.",
                    winner != null ? winner.getName() : winnerId,
                    winner != null ? winner.getTotalScore() : 9.0,
                    bestTransport != null ? bestTransport.getDisplayName() : "Vận chuyển công cộng"
            ));
        }

        // Data sources & assumptions
        Map<String, String> sources = new LinkedHashMap<>();
        sources.put("weather", allLiveWeather ? WeatherService.SOURCE_LIVE : WeatherService.SOURCE_FALLBACK);
        sources.put("prices", "TravelGO Reference Dataset (09/2026)");
        resp.setDataSources(sources);
        resp.setAssumptions(Collections.singletonList("Giá vé xe/tàu và khách sạn có thể dao động 10-15% tùy thời điểm đặt thực tế."));

        return resp;
    }

    public BudgetSensitivityResult simulateSensitivity(PlanTripRequest req) {
        return budgetSimulator.simulateSensitivity(req);
    }

    public List<Destination> getAllDestinations() {
        return dataLoaderService.getDestinations();
    }

    private List<TransportOption> convertTransportOptions(RouteTransport rt, int numPeople) {
        List<TransportOption> result = new ArrayList<>();
        if (rt == null || rt.getOptions() == null) return result;

        for (Option opt : rt.getOptions()) {
            TransportOption dto = new TransportOption();
            dto.setMode(opt.getMode());
            dto.setDisplayName(opt.getDisplayName());
            dto.setPriceTotalVnd(opt.getPriceTotalVnd());
            dto.setGroupPriceTotalVnd(BudgetCalculator.groupCost(opt.getPriceTotalVnd(), numPeople));
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
