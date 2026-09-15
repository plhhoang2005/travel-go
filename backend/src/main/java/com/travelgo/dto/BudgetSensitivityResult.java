package com.travelgo.dto;

import com.travelgo.dto.PlanTripResponse.BudgetBreakdown;
import java.util.List;

public class BudgetSensitivityResult {

    private List<BudgetStep> steps;

    public BudgetSensitivityResult() {}

    public BudgetSensitivityResult(List<BudgetStep> steps) {
        this.steps = steps;
    }

    public List<BudgetStep> getSteps() { return steps; }
    public void setSteps(List<BudgetStep> steps) { this.steps = steps; }

    public static class BudgetStep {
        private long budgetVnd;
        private String budgetLabel;
        private String winningDestinationId;
        private String winningDestinationName;
        private double destinationScore;
        private String recommendedTransportMode;
        private String recommendedTransportName;
        private String recommendedHotelTier;
        private String recommendedHotelName;
        private long estimatedTotalCostVnd;
        private long remainingSafetyMarginVnd;
        private boolean isFeasible;
        private String feasibilityStatus;
        private BudgetBreakdown budgetBreakdown;

        public BudgetStep() {}

        public long getBudgetVnd() { return budgetVnd; }
        public void setBudgetVnd(long budgetVnd) { this.budgetVnd = budgetVnd; }

        public String getBudgetLabel() { return budgetLabel; }
        public void setBudgetLabel(String budgetLabel) { this.budgetLabel = budgetLabel; }

        public String getWinningDestinationId() { return winningDestinationId; }
        public void setWinningDestinationId(String winningDestinationId) { this.winningDestinationId = winningDestinationId; }

        public String getWinningDestinationName() { return winningDestinationName; }
        public void setWinningDestinationName(String winningDestinationName) { this.winningDestinationName = winningDestinationName; }

        public double getDestinationScore() { return destinationScore; }
        public void setDestinationScore(double destinationScore) { this.destinationScore = destinationScore; }

        public String getRecommendedTransportMode() { return recommendedTransportMode; }
        public void setRecommendedTransportMode(String recommendedTransportMode) { this.recommendedTransportMode = recommendedTransportMode; }

        public String getRecommendedTransportName() { return recommendedTransportName; }
        public void setRecommendedTransportName(String recommendedTransportName) { this.recommendedTransportName = recommendedTransportName; }

        public String getRecommendedHotelTier() { return recommendedHotelTier; }
        public void setRecommendedHotelTier(String recommendedHotelTier) { this.recommendedHotelTier = recommendedHotelTier; }

        public String getRecommendedHotelName() { return recommendedHotelName; }
        public void setRecommendedHotelName(String recommendedHotelName) { this.recommendedHotelName = recommendedHotelName; }

        public long getEstimatedTotalCostVnd() { return estimatedTotalCostVnd; }
        public void setEstimatedTotalCostVnd(long estimatedTotalCostVnd) { this.estimatedTotalCostVnd = estimatedTotalCostVnd; }

        public long getRemainingSafetyMarginVnd() { return remainingSafetyMarginVnd; }
        public void setRemainingSafetyMarginVnd(long remainingSafetyMarginVnd) { this.remainingSafetyMarginVnd = remainingSafetyMarginVnd; }

        public boolean isFeasible() { return isFeasible; }
        public void setFeasible(boolean feasible) { isFeasible = feasible; }

        public String getFeasibilityStatus() { return feasibilityStatus; }
        public void setFeasibilityStatus(String feasibilityStatus) { this.feasibilityStatus = feasibilityStatus; }

        public BudgetBreakdown getBudgetBreakdown() { return budgetBreakdown; }
        public void setBudgetBreakdown(BudgetBreakdown budgetBreakdown) { this.budgetBreakdown = budgetBreakdown; }
    }
}
