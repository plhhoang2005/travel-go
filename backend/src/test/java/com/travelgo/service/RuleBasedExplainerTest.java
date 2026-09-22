package com.travelgo.service;

import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse;
import com.travelgo.dto.PlanTripResponse.BudgetBreakdown;
import com.travelgo.dto.PlanTripResponse.DestinationCard;
import com.travelgo.dto.PlanTripResponse.TransportOption;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class RuleBasedExplainerTest {

    private RuleBasedExplainerService explainerService;

    @BeforeEach
    public void setUp() {
        explainerService = new RuleBasedExplainerService();
    }

    @Test
    public void testGenerateExplanationBalanced() {
        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 3, 1, 4_000_000L, List.of("mountain", "food"), "balanced");

        PlanTripResponse resp = new PlanTripResponse();
        resp.setWinnerId("da-lat");

        DestinationCard winner = new DestinationCard();
        winner.setId("da-lat");
        winner.setName("Đà Lạt");
        winner.setTotalScore(8.65);
        winner.setEstimatedCostVnd(3_200_000L);
        winner.setAvgTempMax(24.0);
        winner.setAvgPrecipitation(0.5);
        winner.setWeatherSource("LIVE: Open-Meteo API");
        Map<String, Double> norm = new HashMap<>();
        norm.put("preference_match", 9.0);
        norm.put("budget_fit", 8.5);
        winner.setNormalizedScores(norm);

        DestinationCard runnerUp = new DestinationCard();
        runnerUp.setId("nha-trang");
        runnerUp.setName("Nha Trang");
        runnerUp.setTotalScore(8.10);

        resp.setTopDestinations(List.of(winner, runnerUp));

        TransportOption opt1 = new TransportOption();
        opt1.setMode("xe_khach");
        opt1.setDisplayName("Xe khách giường nằm Limousine");
        opt1.setPriceTotalVnd(500_000L);
        opt1.setDurationHours(7.0);

        TransportOption opt2 = new TransportOption();
        opt2.setMode("may_bay");
        opt2.setDisplayName("Máy bay");
        opt2.setPriceTotalVnd(1_800_000L);
        opt2.setDurationHours(1.0);

        resp.setTransportOptions(List.of(opt1, opt2));

        BudgetBreakdown budget = new BudgetBreakdown();
        budget.setTransport(500_000L);
        budget.setAccommodation(1_200_000L);
        budget.setFood(900_000L);
        budget.setAttractions(400_000L);
        budget.setRemainingSafetyMargin(1_000_000L);
        resp.setBudgetBreakdown(budget);

        String explanation = explainerService.generateExplanation(req, resp);

        assertNotNull(explanation);
        assertTrue(explanation.contains("Đà Lạt"));
        assertTrue(explanation.contains("8.7") || explanation.contains("8.6"));
        assertTrue(explanation.contains("MCDA"));
        assertTrue(explanation.contains("Pareto"));
        assertTrue(explanation.contains("Xe khách"));
        assertTrue(explanation.contains("Open-Meteo"));
        assertTrue(explanation.contains("An toàn Tài chính") || explanation.contains("dự phòng"));
    }

    @Test
    public void testGenerateExplanationCheapest() {
        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 2, 1, 2_500_000L, List.of("beach"), "cheapest");

        PlanTripResponse resp = new PlanTripResponse();
        resp.setWinnerId("vung-tau");

        DestinationCard winner = new DestinationCard();
        winner.setId("vung-tau");
        winner.setName("Vũng Tàu");
        winner.setTotalScore(8.9);
        winner.setEstimatedCostVnd(1_800_000L);
        winner.setAvgTempMax(31.0);
        winner.setAvgPrecipitation(1.0);

        resp.setTopDestinations(List.of(winner));

        String explanation = explainerService.generateExplanation(req, resp);
        assertNotNull(explanation);
        assertTrue(explanation.contains("Vũng Tàu"));
        assertTrue(explanation.contains("Chi phí phù hợp") || explanation.contains("tiết kiệm"));
    }
}
