package com.travelgo.decision.itinerary;

import com.travelgo.dto.PlanTripResponse.Activity;
import com.travelgo.dto.PlanTripResponse.ItineraryDay;
import com.travelgo.model.DestinationPois.PoiItem;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ItineraryBuilder {

    public static final int MIN_POIS_PER_DAY = 3;
    public static final int MAX_POIS_PER_DAY = 4;
    public static final double MAX_DAILY_ACTIVE_HOURS = 9.5;

    public static final String TIME_MORNING = "morning";
    public static final String TIME_AFTERNOON = "afternoon";
    public static final String TIME_EVENING = "evening";

    public static final String MORNING_START_TIME = "08:00";
    public static final String AFTERNOON_START_TIME = "14:00";
    public static final String EVENING_START_TIME = "18:30";

    /**
     * Builds a day-by-day itinerary using a Greedy Constraint Satisfaction Algorithm.
     * Bounded by time, budget, and 3-4 POIs per day.
     */
    public List<ItineraryDay> buildItinerary(String destinationId,
                                              int numDays,
                                              long attractionsBudgetVnd,
                                              List<PoiItem> rawPois) {
        List<ItineraryDay> itineraryDays = new ArrayList<>();
        if (numDays <= 0) {
            return itineraryDays;
        }

        List<PoiItem> pool = new ArrayList<>(rawPois != null ? rawPois : Collections.emptyList());
        Set<String> usedPoiNames = new HashSet<>();
        long dailyBudget = attractionsBudgetVnd / Math.max(1, numDays);

        for (int dayNum = 1; dayNum <= numDays; dayNum++) {
            ItineraryDay day = new ItineraryDay();
            day.setDay(dayNum);
            day.setTitle(getDayTitle(destinationId, dayNum));

            List<Activity> activities = new ArrayList<>();
            long currentDayCost = 0;
            double currentDayHours = 0;

            // 1. Pick Morning POI
            PoiItem morningPoi = selectBestPoi(pool, TIME_MORNING, usedPoiNames, dailyBudget - currentDayCost);
            if (morningPoi != null) {
                activities.add(new Activity(MORNING_START_TIME, morningPoi.getName(), morningPoi.getCostVnd(), morningPoi.getDurationHours()));
                usedPoiNames.add(morningPoi.getName());
                currentDayCost += morningPoi.getCostVnd();
                currentDayHours += morningPoi.getDurationHours();
            }

            // 2. Pick Afternoon POIs (1 to 2)
            int afternoonCount = (activities.size() < MIN_POIS_PER_DAY) ? 2 : 1;
            String currentAfternoonTime = AFTERNOON_START_TIME;
            for (int i = 0; i < afternoonCount && activities.size() < MAX_POIS_PER_DAY; i++) {
                PoiItem afternoonPoi = selectBestPoi(pool, TIME_AFTERNOON, usedPoiNames, dailyBudget - currentDayCost);
                if (afternoonPoi != null) {
                    activities.add(new Activity(currentAfternoonTime, afternoonPoi.getName(), afternoonPoi.getCostVnd(), afternoonPoi.getDurationHours()));
                    usedPoiNames.add(afternoonPoi.getName());
                    currentDayCost += afternoonPoi.getCostVnd();
                    currentDayHours += afternoonPoi.getDurationHours();
                    currentAfternoonTime = addHours(currentAfternoonTime, afternoonPoi.getDurationHours() + 0.5);
                }
            }

            // 3. Pick Evening POI
            if (activities.size() < MAX_POIS_PER_DAY) {
                PoiItem eveningPoi = selectBestPoi(pool, TIME_EVENING, usedPoiNames, dailyBudget - currentDayCost);
                if (eveningPoi != null) {
                    activities.add(new Activity(EVENING_START_TIME, eveningPoi.getName(), eveningPoi.getCostVnd(), eveningPoi.getDurationHours()));
                    usedPoiNames.add(eveningPoi.getName());
                    currentDayCost += eveningPoi.getCostVnd();
                    currentDayHours += eveningPoi.getDurationHours();
                }
            }

            // Fallback fill if less than 3 POIs selected
            if (activities.size() < MIN_POIS_PER_DAY) {
                PoiItem fallbackPoi = selectBestPoi(pool, null, usedPoiNames, Long.MAX_VALUE);
                if (fallbackPoi != null) {
                    activities.add(new Activity("16:00", fallbackPoi.getName(), fallbackPoi.getCostVnd(), fallbackPoi.getDurationHours()));
                    usedPoiNames.add(fallbackPoi.getName());
                }
            }

            day.setActivities(activities);
            itineraryDays.add(day);
        }

        return itineraryDays;
    }

    private PoiItem selectBestPoi(List<PoiItem> pool, String timeOfDay, Set<String> used, long budgetRemaining) {
        return pool.stream()
                .filter(poi -> !used.contains(poi.getName()))
                .filter(poi -> timeOfDay == null || timeOfDay.equalsIgnoreCase(poi.getTimeOfDay()))
                .filter(poi -> poi.getCostVnd() <= Math.max(budgetRemaining, 50_000L)) // gentle threshold
                .findFirst()
                .orElseGet(() -> pool.stream()
                        .filter(poi -> !used.contains(poi.getName()))
                        .findFirst()
                        .orElse(null));
    }

    private String getDayTitle(String destinationId, int dayNum) {
        if (dayNum == 1) return "Khám phá trung tâm & Ẩm thực đặc sắc";
        if (dayNum == 2) return "Săn mây, ngắm cảnh & Check-in địa danh nổi tiếng";
        if (dayNum == 3) return "Trải nghiệm văn hóa địa phương & Mua sắm quà lưu niệm";
        return "Tự do trải nghiệm & Thưởng thức đặc sản ngày " + dayNum;
    }

    private String addHours(String timeStr, double hoursToAdd) {
        try {
            String[] parts = timeStr.split(":");
            int hour = Integer.parseInt(parts[0]);
            int minute = Integer.parseInt(parts[1]);

            int totalMinutes = (int) (hour * 60 + minute + hoursToAdd * 60);
            int newHour = (totalMinutes / 60) % 24;
            int newMinute = totalMinutes % 60;

            return String.format(Locale.US, "%02d:%02d", newHour, newMinute);
        } catch (Exception e) {
            return "15:00";
        }
    }
}
