package com.travelgo.decision.budget;

import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse.BudgetBreakdown;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BudgetCalculatorTest {
    @Test
    void twoPeopleGetEightMillionGroupBudget() {
        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 3, 2, 0, null, "balanced");
        req.setBudgetPerPersonVnd(4_000_000L);
        assertEquals(8_000_000L, BudgetCalculator.totalBudget(req));
    }

    @Test
    void legacyBudgetRemainsTotalForGroup() {
        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 3, 2, 4_000_000L, null, "balanced");
        assertEquals(4_000_000L, BudgetCalculator.totalBudget(req));
    }

    @Test
    void rejectsAmbiguousInvalidAndOverflowInputs() {
        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 3, 2, 4_000_000L, null, "balanced");
        req.setBudgetPerPersonVnd(4_000_000L);
        assertThrows(IllegalArgumentException.class, () -> BudgetCalculator.totalBudget(req));
        req.setBudgetVnd(0);
        req.setNumPeople(0);
        assertThrows(IllegalArgumentException.class, () -> BudgetCalculator.totalBudget(req));
        req.setNumPeople(2);
        req.setBudgetPerPersonVnd(Long.MAX_VALUE);
        assertThrows(IllegalArgumentException.class, () -> BudgetCalculator.totalBudget(req));
    }

    @Test
    void groupCostsUsePeopleRoomsAndNights() {
        BudgetBreakdown result = BudgetCalculator.breakdown(
                8_000_000L, 3, 2, 500_000L, 650_000L, 350_000L, 250_000L);
        assertEquals(1_000_000L, result.getTransport());
        assertEquals(1_300_000L, result.getAccommodation());
        assertEquals(2_100_000L, result.getFood());
        assertEquals(500_000L, result.getAttractions());
        assertEquals(3_100_000L, result.getRemainingSafetyMargin());
    }

    @Test
    void fourPeopleNeedTwoRoomsAndNegativeMarginStaysNegative() {
        BudgetBreakdown result = BudgetCalculator.breakdown(
                6_000_000L, 5, 4, 500_000L, 650_000L, 350_000L, 250_000L);
        assertEquals(5_200_000L, result.getAccommodation());
        assertEquals(-9_200_000L, result.getRemainingSafetyMargin());
    }
}

