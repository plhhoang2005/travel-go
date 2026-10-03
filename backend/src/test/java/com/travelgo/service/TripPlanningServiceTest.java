package com.travelgo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelgo.data.DataLoaderService;
import com.travelgo.decision.itinerary.ItineraryBuilder;
import com.travelgo.decision.mcda.DestinationScorer;
import com.travelgo.decision.pareto.TransportOptimizer;
import com.travelgo.decision.sensitivity.BudgetSimulator;
import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse;
import com.travelgo.external.weather.WeatherInfo;
import com.travelgo.external.weather.WeatherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TripPlanningServiceTest {
    private TripPlanningService service;

    @BeforeEach
    void setUp() {
        DataLoaderService loader = new DataLoaderService(new ObjectMapper());
        loader.init();
        DestinationScorer scorer = new DestinationScorer();
        TransportOptimizer optimizer = new TransportOptimizer();
        WeatherService weather = new WeatherService(null) {
            @Override
            public WeatherInfo getWeatherByCoordinates(double latitude, double longitude) {
                return new WeatherInfo(8.0, WeatherService.SOURCE_FALLBACK);
            }

            @Override
            public WeatherInfo getWeatherForCity(String cityId) {
                return new WeatherInfo(8.0, WeatherService.SOURCE_FALLBACK);
            }
        };
        service = new TripPlanningService(scorer, optimizer, new ItineraryBuilder(),
                new BudgetSimulator(scorer, optimizer, loader), loader, weather,
                new RuleBasedExplainerService());
    }

    private PlanTripResponse plan(int people, int days, long perPersonBudget) {
        PlanTripRequest request = new PlanTripRequest("Ho Chi Minh", days, people, 0,
                List.of("mountain"), "balanced");
        request.setBudgetPerPersonVnd(perPersonBudget);
        return service.planTrip(request);
    }

    @Test
    void threeDayTwoPersonPlanUsesGroupBudgetAndConsistentUnits() {
        PlanTripResponse response = plan(2, 3, 4_000_000L);
        assertEquals(8_000_000L, response.getBudgetContext().getTotalBudgetVnd());
        assertEquals("PER_PERSON", response.getBudgetContext().getInputBasis());
        assertEquals(2, response.getBudgetContext().getNumPeople());
        var breakdown = response.getBudgetBreakdown();
        long spent = breakdown.getTransport() + breakdown.getAccommodation()
                + breakdown.getFood() + breakdown.getAttractions();
        assertEquals(8_000_000L, spent + breakdown.getRemainingSafetyMargin());
        assertEquals(2_100_000L, breakdown.getFood());
        assertEquals(response.getTopDestinations().get(0).getEstimatedCostVnd() * 2,
                response.getTopDestinations().get(0).getEstimatedGroupCostVnd());
        assertEquals(response.getTransportOptions().get(0).getPriceTotalVnd() * 2,
                response.getTransportOptions().get(0).getGroupPriceTotalVnd());
    }

    @Test
    void changingPeopleChangesCostsAndRooms() {
        var one = plan(1, 3, 4_000_000L).getBudgetBreakdown();
        var two = plan(2, 3, 4_000_000L).getBudgetBreakdown();
        var four = plan(4, 3, 4_000_000L).getBudgetBreakdown();
        assertEquals(one.getAccommodation(), two.getAccommodation());
        assertEquals(two.getAccommodation() * 2, four.getAccommodation());
        assertEquals(one.getFood() * 2, two.getFood());
        assertEquals(two.getFood() * 2, four.getFood());
    }

    @Test
    void overBudgetPlanRetainsNegativeMargin() {
        var response = plan(2, 5, 1L);
        assertTrue(response.getBudgetBreakdown().getRemainingSafetyMargin() < 0);
    }
}
