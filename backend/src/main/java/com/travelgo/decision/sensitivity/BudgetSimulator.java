package com.travelgo.decision.sensitivity;

import com.travelgo.data.DataLoaderService;
import com.travelgo.decision.mcda.DestinationScorer;
import com.travelgo.decision.pareto.TransportOptimizer;
import com.travelgo.dto.BudgetSensitivityResult;
import com.travelgo.dto.BudgetSensitivityResult.BudgetStep;
import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse.BudgetBreakdown;
import com.travelgo.dto.PlanTripResponse.DestinationCard;
import com.travelgo.dto.PlanTripResponse.TransportOption;
import com.travelgo.model.Destination;
import com.travelgo.model.DestinationHotels.HotelCategory;
import com.travelgo.model.RouteTransport;
import com.travelgo.model.RouteTransport.Option;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class BudgetSimulator {

    // Named constants for 3-step simulation (No Magic Numbers rule)
    public static final long BUDGET_3M_VND = 3_000_000L;
    public static final long BUDGET_4M_VND = 4_000_000L;
    public static final long BUDGET_5M_VND = 5_000_000L;

    public static final List<Long> SIMULATION_BUDGETS = List.of(
            BUDGET_3M_VND,
            BUDGET_4M_VND,
            BUDGET_5M_VND
    );

    private final DestinationScorer destinationScorer;
    private final TransportOptimizer transportOptimizer;
    private final DataLoaderService dataLoaderService;

    public BudgetSimulator(DestinationScorer destinationScorer,
                           TransportOptimizer transportOptimizer,
                           DataLoaderService dataLoaderService) {
        this.destinationScorer = destinationScorer;
        this.transportOptimizer = transportOptimizer;
        this.dataLoaderService = dataLoaderService;
    }

    /**
     * Runs 3-step budget sensitivity simulation for 3M, 4M, and 5M VND.
     */
    public BudgetSensitivityResult simulateSensitivity(PlanTripRequest baseRequest) {
        return simulateSensitivity(baseRequest, Collections.emptyMap());
    }

    public BudgetSensitivityResult simulateSensitivity(PlanTripRequest baseRequest,
                                                        Map<String, Double> weatherScores) {
        List<BudgetStep> steps = new ArrayList<>();

        for (long budget : SIMULATION_BUDGETS) {
            PlanTripRequest stepReq = new PlanTripRequest(
                    baseRequest.getOrigin() != null ? baseRequest.getOrigin() : "Ho Chi Minh",
                    baseRequest.getNumDays() > 0 ? baseRequest.getNumDays() : 3,
                    baseRequest.getNumPeople() > 0 ? baseRequest.getNumPeople() : 1,
                    budget,
                    baseRequest.getPreferences(),
                    baseRequest.getPriority()
            );

            BudgetStep step = runSimulationStep(stepReq, budget, weatherScores);
            steps.add(step);
        }

        return new BudgetSensitivityResult(steps);
    }

    private BudgetStep runSimulationStep(PlanTripRequest req, long budgetVnd,
                                         Map<String, Double> weatherScores) {
        BudgetStep step = new BudgetStep();
        step.setBudgetVnd(budgetVnd);
        step.setBudgetLabel(getBudgetLabel(budgetVnd));

        List<Destination> destinations = dataLoaderService.getDestinations();
        if (destinations.isEmpty()) {
            step.setWinningDestinationId("da-lat");
            step.setWinningDestinationName("Đà Lạt");
            step.setFeasibilityStatus("DỮ LIỆU MẶC ĐỊNH");
            return step;
        }

        // 1. Score Destinations for this budget step
        DestinationCard topCard = null;
        Destination topDest = null;

        for (Destination dest : destinations) {
            RouteTransport rt = dataLoaderService.getRouteTransport(req.getOrigin(), dest.getId());
            double travelTime = 6.0;
            long transportCost = 600_000L;

            if (rt != null && rt.getOptions() != null && !rt.getOptions().isEmpty()) {
                Option opt = rt.getOptions().get(0);
                travelTime = opt.getDurationHours();
                transportCost = opt.getPriceTotalVnd();
            }

            long estCost = (dest.getAvgDailyCostVnd() * req.getNumDays()) + transportCost;
            double weatherScore = weatherScores.getOrDefault(dest.getId(), DestinationScorer.DEFAULT_NEUTRAL_SCORE);

            DestinationCard card = destinationScorer.scoreDestination(dest, req, weatherScore, travelTime, estCost);
            if (topCard == null || card.getTotalScore() > topCard.getTotalScore()) {
                topCard = card;
                topDest = dest;
            }
        }

        if (topCard != null && topDest != null) {
            step.setWinningDestinationId(topDest.getId());
            step.setWinningDestinationName(topDest.getName());
            step.setDestinationScore(topCard.getTotalScore());

            // 2. Transport Pareto options for winner
            RouteTransport rt = dataLoaderService.getRouteTransport(req.getOrigin(), topDest.getId());
            List<TransportOption> dtos = convertTransportOptions(rt);
            dtos = transportOptimizer.optimize(dtos);

            TransportOption chosenTransport = dtos.stream()
                    .filter(t -> t.getPriceTotalVnd() <= budgetVnd * 0.35)
                    .findFirst()
                    .orElse(dtos.isEmpty() ? null : dtos.get(0));

            if (chosenTransport != null) {
                step.setRecommendedTransportMode(chosenTransport.getMode());
                step.setRecommendedTransportName(chosenTransport.getDisplayName());
            }

            // 3. Hotel selection
            List<HotelCategory> hotels = dataLoaderService.getHotelsForDestination(topDest.getId());
            HotelCategory chosenHotel = selectHotelCategory(hotels, budgetVnd, req.getNumDays());
            if (chosenHotel != null) {
                step.setRecommendedHotelTier(chosenHotel.getTier());
                step.setRecommendedHotelName(chosenHotel.getName());
            }

            // 4. Budget breakdown calculation
            long transportCost = chosenTransport != null ? chosenTransport.getPriceTotalVnd() : 500_000L;
            long hotelCost = (chosenHotel != null ? chosenHotel.getAvgNightlyVnd() : 400_000L) * req.getNumDays();
            long foodCost = 250_000L * req.getNumDays();
            long attrCost = 300_000L;

            long totalEstCost = transportCost + hotelCost + foodCost + attrCost;
            long safetyMargin = budgetVnd - totalEstCost;

            BudgetBreakdown breakdown = new BudgetBreakdown();
            breakdown.setTransport(transportCost);
            breakdown.setAccommodation(hotelCost);
            breakdown.setFood(foodCost);
            breakdown.setAttractions(attrCost);
            breakdown.setRemainingSafetyMargin(safetyMargin);
            step.setBudgetBreakdown(breakdown);

            step.setEstimatedTotalCostVnd(totalEstCost);
            step.setRemainingSafetyMarginVnd(safetyMargin);
            step.setFeasible(safetyMargin >= 0);

            if (safetyMargin >= 500_000L) {
                step.setFeasibilityStatus("HOÀN TOÀN KHẢ THI");
            } else if (safetyMargin >= 0) {
                step.setFeasibilityStatus("VỪA ĐỦ CHI PHÍ");
            } else {
                step.setFeasibilityStatus("CẦN TỐI ƯU CHI PHÍ");
            }
        }

        return step;
    }

    private HotelCategory selectHotelCategory(List<HotelCategory> categories, long budgetVnd, int numDays) {
        if (categories == null || categories.isEmpty()) return null;
        if (budgetVnd >= 5_000_000L) {
            return categories.stream().filter(c -> "premium".equalsIgnoreCase(c.getTier())).findFirst().orElse(categories.get(0));
        } else if (budgetVnd >= 4_000_000L) {
            return categories.stream().filter(c -> "standard".equalsIgnoreCase(c.getTier())).findFirst().orElse(categories.get(0));
        } else {
            return categories.stream().filter(c -> "budget".equalsIgnoreCase(c.getTier())).findFirst().orElse(categories.get(0));
        }
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

    private String getBudgetLabel(long budgetVnd) {
        if (budgetVnd == BUDGET_3M_VND) return "3,000,000 VNĐ (Tiết kiệm)";
        if (budgetVnd == BUDGET_4M_VND) return "4,000,000 VNĐ (Tiêu chuẩn)";
        if (budgetVnd == BUDGET_5M_VND) return "5,000,000 VNĐ (Thoải mái)";
        return String.format(Locale.US, "%,d VNĐ", budgetVnd);
    }
}
