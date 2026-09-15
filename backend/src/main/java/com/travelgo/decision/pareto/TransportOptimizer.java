package com.travelgo.decision.pareto;

import com.travelgo.dto.PlanTripResponse.TransportOption;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class TransportOptimizer {

    public static final String TRADEOFF_CHEAPEST = "cheapest";
    public static final String TRADEOFF_FASTEST = "fastest";
    public static final String TRADEOFF_BALANCED = "balanced";
    public static final String TRADEOFF_SUBOPTIMAL = "suboptimal";

    public static final String REASON_CHEAPEST = "Giá rẻ nhất, tiết kiệm tối đa ngân sách di chuyển.";
    public static final String REASON_FASTEST = "Nhanh nhất, tiết kiệm thời gian di chuyển.";
    public static final String REASON_BALANCED = "Cân bằng hoàn hảo giữa giá tiền, thời gian và sự thoải mái.";
    public static final String REASON_SUBOPTIMAL = "Bị áp đảo bởi phương tiện khác về chi phí, thời gian hoặc độ tiện nghi.";

    /**
     * Optimizes transport options using Multi-Objective Pareto Dominance Analysis.
     * Objectives:
     * 1. Price (VND) - Minimize
     * 2. Duration (Hours) - Minimize
     * 3. Comfort (1-10 Scale) - Maximize
     */
    public List<TransportOption> optimize(List<TransportOption> options) {
        if (options == null || options.isEmpty()) {
            return options;
        }

        // 1. Determine Pareto Dominance
        for (int i = 0; i < options.size(); i++) {
            TransportOption current = options.get(i);
            boolean isDominated = false;

            for (int j = 0; j < options.size(); j++) {
                if (i == j) continue;
                TransportOption other = options.get(j);

                if (dominates(other, current)) {
                    isDominated = true;
                    break;
                }
            }

            current.setParetoOptimal(!isDominated);
        }

        // 2. Classify Tradeoff Types for Pareto Optimal Options
        List<TransportOption> paretoOptions = options.stream()
                .filter(TransportOption::isParetoOptimal)
                .toList();

        TransportOption cheapest = paretoOptions.stream()
                .min(Comparator.comparingLong(TransportOption::getPriceTotalVnd))
                .orElse(null);

        TransportOption fastest = paretoOptions.stream()
                .min(Comparator.comparingDouble(TransportOption::getDurationHours))
                .orElse(null);

        for (TransportOption option : options) {
            if (!option.isParetoOptimal()) {
                option.setTradeoffType(TRADEOFF_SUBOPTIMAL);
                option.setRecommendationReason(REASON_SUBOPTIMAL);
            } else if (option == cheapest) {
                option.setTradeoffType(TRADEOFF_CHEAPEST);
                option.setRecommendationReason(REASON_CHEAPEST);
            } else if (option == fastest) {
                option.setTradeoffType(TRADEOFF_FASTEST);
                option.setRecommendationReason(REASON_FASTEST);
            } else {
                option.setTradeoffType(TRADEOFF_BALANCED);
                option.setRecommendationReason(REASON_BALANCED);
            }
        }

        return options;
    }

    /**
     * Checks if Option A Pareto-dominates Option B.
     * A dominates B if A is <= Price, <= Duration, >= Comfort, with at least one strictly better.
     */
    public boolean dominates(TransportOption a, TransportOption b) {
        boolean noWorsePrice = a.getPriceTotalVnd() <= b.getPriceTotalVnd();
        boolean noWorseDuration = a.getDurationHours() <= b.getDurationHours();
        boolean noWorseComfort = a.getComfortScore() >= b.getComfortScore();

        boolean strictlyBetterPrice = a.getPriceTotalVnd() < b.getPriceTotalVnd();
        boolean strictlyBetterDuration = a.getDurationHours() < b.getDurationHours();
        boolean strictlyBetterComfort = a.getComfortScore() > b.getComfortScore();

        return (noWorsePrice && noWorseDuration && noWorseComfort) &&
               (strictlyBetterPrice || strictlyBetterDuration || strictlyBetterComfort);
    }
}
