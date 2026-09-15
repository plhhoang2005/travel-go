package com.travelgo.decision.mcda;

import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse.DestinationCard;
import com.travelgo.external.weather.WeatherInfo;
import com.travelgo.model.Destination;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class DestinationScorer {

    // Explicit MCDA Criteria Weights (Rule 3: No Magic Numbers)
    public static final double WEIGHT_BUDGET = 0.30;
    public static final double WEIGHT_WEATHER = 0.20;
    public static final double WEIGHT_PREFERENCE = 0.25;
    public static final double WEIGHT_TRAVEL_TIME = 0.15;
    public static final double WEIGHT_UNIQUENESS = 0.10;

    // Scale Constants
    public static final double SCALE_MIN = 0.0;
    public static final double SCALE_MAX = 10.0;
    public static final double DEFAULT_NEUTRAL_SCORE = 8.0;

    // Criteria Keys
    public static final String KEY_BUDGET = "budget_fit";
    public static final String KEY_WEATHER = "weather";
    public static final String KEY_PREFERENCE = "preference_match";
    public static final String KEY_TRAVEL_TIME = "travel_time";
    public static final String KEY_UNIQUENESS = "uniqueness";

    /**
     * Scores a destination using Weighted Multi-Criteria Decision Analysis (MCDA).
     */
    public DestinationCard scoreDestination(Destination destination,
                                            PlanTripRequest request,
                                            WeatherInfo weatherInfo,
                                            double travelTimeHours,
                                            long estimatedCostVnd) {
        double weatherScore = (weatherInfo != null) ? weatherInfo.getWeatherScore() : DEFAULT_NEUTRAL_SCORE;
        DestinationCard card = scoreDestination(destination, request, weatherScore, travelTimeHours, estimatedCostVnd);
        if (weatherInfo != null) {
            card.setWeatherSource(weatherInfo.getSource());
        }
        return card;
    }

    /**
     * Scores a destination using Weighted Multi-Criteria Decision Analysis (MCDA).
     */
    public DestinationCard scoreDestination(Destination destination,
                                            PlanTripRequest request,
                                            double weatherScore,
                                            double travelTimeHours,
                                            long estimatedCostVnd) {
        DestinationCard card = new DestinationCard();
        card.setId(destination.getId());
        card.setName(destination.getName());
        card.setEstimatedCostVnd(estimatedCostVnd);

        // 1. Normalize Criteria to 0.0 - 10.0 Scale
        double rawBudget = normalizeBudgetFit(estimatedCostVnd, request.getBudgetVnd());
        double rawWeather = normalizeWeather(weatherScore);
        double rawPref = normalizePreferenceMatch(request.getPreferences(), destination.getTags());
        double rawTime = normalizeTravelTime(travelTimeHours);
        double rawUnique = normalizeUniqueness(destination.getUniquenessScore());

        Map<String, Double> normalizedScores = new LinkedHashMap<>();
        normalizedScores.put(KEY_BUDGET, round(rawBudget));
        normalizedScores.put(KEY_WEATHER, round(rawWeather));
        normalizedScores.put(KEY_PREFERENCE, round(rawPref));
        normalizedScores.put(KEY_TRAVEL_TIME, round(rawTime));
        normalizedScores.put(KEY_UNIQUENESS, round(rawUnique));
        card.setNormalizedScores(normalizedScores);

        // 2. Calculate Weighted Score Contributions
        Map<String, Double> contributions = new LinkedHashMap<>();
        contributions.put(KEY_BUDGET, round(rawBudget * WEIGHT_BUDGET));
        contributions.put(KEY_WEATHER, round(rawWeather * WEIGHT_WEATHER));
        contributions.put(KEY_PREFERENCE, round(rawPref * WEIGHT_PREFERENCE));
        contributions.put(KEY_TRAVEL_TIME, round(rawTime * WEIGHT_TRAVEL_TIME));
        contributions.put(KEY_UNIQUENESS, round(rawUnique * WEIGHT_UNIQUENESS));
        card.setScoreContributions(contributions);

        // 3. Sum Contributions for Total Score
        double total = contributions.values().stream().mapToDouble(Double::doubleValue).sum();
        card.setTotalScore(round(total));

        return card;
    }

    public double normalizeBudgetFit(long estimatedCostVnd, long userBudgetVnd) {
        if (userBudgetVnd <= 0) {
            return 5.0;
        }
        double ratio = (double) estimatedCostVnd / userBudgetVnd;
        double score;
        if (ratio <= 0.8) {
            score = 10.0 - (ratio / 0.8) * 2.0; // 8.0 to 10.0
        } else if (ratio <= 1.0) {
            score = 8.0 - ((ratio - 0.8) / 0.2) * 3.0; // 5.0 to 8.0
        } else {
            score = Math.max(SCALE_MIN, 5.0 - (ratio - 1.0) * 10.0);
        }
        return clamp(score);
    }

    public double normalizeWeather(double weatherScore) {
        return clamp(weatherScore);
    }

    public double normalizePreferenceMatch(List<String> userPreferences, List<String> destinationTags) {
        if (userPreferences == null || userPreferences.isEmpty()) {
            return DEFAULT_NEUTRAL_SCORE;
        }
        if (destinationTags == null || destinationTags.isEmpty()) {
            return SCALE_MIN;
        }
        long matches = userPreferences.stream()
                .filter(pref -> destinationTags.stream()
                        .anyMatch(tag -> tag.equalsIgnoreCase(pref) || tag.toLowerCase().contains(pref.toLowerCase())))
                .count();

        double matchRatio = (double) matches / userPreferences.size();
        return clamp(matchRatio * SCALE_MAX);
    }

    public double normalizeTravelTime(double durationHours) {
        if (durationHours <= 0) {
            return SCALE_MAX;
        }
        double score;
        if (durationHours <= 1.0) {
            score = SCALE_MAX;
        } else if (durationHours <= 8.0) {
            score = 10.0 - ((durationHours - 1.0) / 7.0) * 6.0; // 4.0 to 10.0
        } else {
            score = Math.max(1.0, 4.0 - (durationHours - 8.0) * 0.5);
        }
        return clamp(score);
    }

    public double normalizeUniqueness(double uniquenessScore) {
        return clamp(uniquenessScore);
    }

    private double clamp(double val) {
        return Math.min(SCALE_MAX, Math.max(SCALE_MIN, val));
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
