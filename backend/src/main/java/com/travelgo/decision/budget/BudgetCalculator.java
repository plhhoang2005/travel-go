package com.travelgo.decision.budget;

import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse.BudgetBreakdown;
import com.travelgo.dto.PlanTripResponse.ItineraryDay;
import com.travelgo.model.DestinationPois.PoiItem;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class BudgetCalculator {
    private BudgetCalculator() {}

    public static long totalBudget(PlanTripRequest request) {
        if (request == null || request.getNumPeople() <= 0 || request.getNumDays() <= 0) {
            throw new IllegalArgumentException("numPeople and numDays must be positive");
        }
        long perPerson = request.getBudgetPerPersonVnd();
        long legacyTotal = request.getBudgetVnd();
        if (perPerson < 0 || legacyTotal < 0 || (perPerson > 0) == (legacyTotal > 0)) {
            throw new IllegalArgumentException("Provide exactly one positive budgetPerPersonVnd or budgetVnd");
        }
        try {
            return perPerson > 0 ? Math.multiplyExact(perPerson, request.getNumPeople()) : legacyTotal;
        } catch (ArithmeticException e) {
            throw new IllegalArgumentException("budgetPerPersonVnd exceeds supported total", e);
        }
    }

    public static long groupCost(long pricePerPerson, int numPeople) {
        return Math.multiplyExact(pricePerPerson, numPeople);
    }

    public static long attractionsPerPerson(List<ItineraryDay> days, List<PoiItem> pois) {
        Map<String, String> types = pois.stream().collect(Collectors.toMap(
                PoiItem::getName, PoiItem::getType, (first, ignored) -> first));
        return days.stream().flatMap(day -> day.getActivities().stream())
                .filter(activity -> {
                    String type = types.get(activity.getTitle());
                    return !"food".equalsIgnoreCase(type) && !"cafe".equalsIgnoreCase(type);
                })
                .mapToLong(activity -> activity.getCostVnd()).sum();
    }

    public static BudgetBreakdown breakdown(long totalBudget, int numDays, int numPeople,
                                            long transportPerPerson, long roomPerNight,
                                            long foodPerPersonPerDay, long attractionsPerPerson) {
        if (numDays <= 0 || numPeople <= 0) {
            throw new IllegalArgumentException("numDays and numPeople must be positive");
        }
        long transport = groupCost(transportPerPerson, numPeople);
        long rooms = (numPeople + 1L) / 2L;
        long accommodation = Math.multiplyExact(Math.multiplyExact(roomPerNight, rooms), numDays - 1L);
        long food = Math.multiplyExact(Math.multiplyExact(foodPerPersonPerDay, numPeople), numDays);
        long attractions = groupCost(attractionsPerPerson, numPeople);
        long spent = Math.addExact(Math.addExact(transport, accommodation), Math.addExact(food, attractions));

        BudgetBreakdown result = new BudgetBreakdown();
        result.setTransport(transport);
        result.setAccommodation(accommodation);
        result.setFood(food);
        result.setAttractions(attractions);
        result.setRemainingSafetyMargin(Math.subtractExact(totalBudget, spent));
        return result;
    }
}
