package com.travelgo.decision.sensitivity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelgo.data.DataLoaderService;
import com.travelgo.decision.mcda.DestinationScorer;
import com.travelgo.decision.pareto.TransportOptimizer;
import com.travelgo.dto.BudgetSensitivityResult;
import com.travelgo.dto.PlanTripRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class BudgetSimulatorTest {

    private BudgetSimulator simulator;

    @BeforeEach
    public void setUp() {
        DestinationScorer scorer = new DestinationScorer();
        TransportOptimizer optimizer = new TransportOptimizer();
        ObjectMapper objectMapper = new ObjectMapper();
        DataLoaderService loader = new DataLoaderService(objectMapper);
        loader.init();

        simulator = new BudgetSimulator(scorer, optimizer, loader);
    }

    @Test
    public void testThreeStepSimulation() {
        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 3, 1, 4_000_000L, List.of("mountain"), "balanced");
        BudgetSensitivityResult result = simulator.simulateSensitivity(req);

        assertNotNull(result);
        assertNotNull(result.getSteps());
        assertEquals(3, result.getSteps().size());

        assertEquals(BudgetSimulator.BUDGET_3M_VND, result.getSteps().get(0).getBudgetVnd());
        assertEquals(BudgetSimulator.BUDGET_4M_VND, result.getSteps().get(1).getBudgetVnd());
        assertEquals(BudgetSimulator.BUDGET_5M_VND, result.getSteps().get(2).getBudgetVnd());

        for (BudgetSensitivityResult.BudgetStep step : result.getSteps()) {
            assertNotNull(step.getWinningDestinationId());
            assertNotNull(step.getFeasibilityStatus());
            assertNotNull(step.getBudgetBreakdown());
        }
    }
    @Test
    public void perPersonStepsUseGroupBudgetsAndStandardFood() {
        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 3, 2, 0,
                List.of("mountain"), "balanced");
        req.setBudgetPerPersonVnd(4_000_000L);
        BudgetSensitivityResult result = simulator.simulateSensitivity(req);
        assertEquals(List.of(6_000_000L, 8_000_000L, 10_000_000L),
                result.getSteps().stream().map(BudgetSensitivityResult.BudgetStep::getBudgetVnd).toList());
        assertEquals(List.of(3_000_000L, 4_000_000L, 5_000_000L),
                result.getSteps().stream().map(BudgetSensitivityResult.BudgetStep::getBudgetPerPersonVnd).toList());
        for (BudgetSensitivityResult.BudgetStep step : result.getSteps()) {
            assertTrue(step.getBudgetLabel().contains("/người"));
            assertEquals(2_100_000L, step.getBudgetBreakdown().getFood());
            assertEquals(step.getBudgetVnd(),
                    step.getEstimatedTotalCostVnd() + step.getRemainingSafetyMarginVnd());
        }
    }

    @Test
    public void legacyStepsStayGroupBudgets() {
        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 3, 2, 4_000_000L,
                List.of("mountain"), "balanced");
        BudgetSensitivityResult result = simulator.simulateSensitivity(req);
        assertEquals(4_000_000L, result.getSteps().get(1).getBudgetVnd());
        assertNull(result.getSteps().get(1).getBudgetPerPersonVnd());
    }
}
