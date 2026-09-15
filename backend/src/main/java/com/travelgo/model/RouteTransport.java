package com.travelgo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RouteTransport {

    @JsonProperty("route_key")
    private String routeKey;

    private List<Option> options;

    public RouteTransport() {}

    public String getRouteKey() { return routeKey; }
    public void setRouteKey(String routeKey) { this.routeKey = routeKey; }

    public List<Option> getOptions() { return options; }
    public void setOptions(List<Option> options) { this.options = options; }

    public static class Option {
        private String mode;

        @JsonProperty("display_name")
        private String displayName;

        @JsonProperty("price_total_vnd")
        private long priceTotalVnd;

        @JsonProperty("duration_hours")
        private double durationHours;

        @JsonProperty("comfort_score")
        private int comfortScore;

        @JsonProperty("is_pareto_optimal")
        private boolean paretoOptimal;

        @JsonProperty("tradeoff_type")
        private String tradeoffType;

        @JsonProperty("recommendation_reason")
        private String recommendationReason;

        public Option() {}

        public String getMode() { return mode; }
        public void setMode(String mode) { this.mode = mode; }

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }

        public long getPriceTotalVnd() { return priceTotalVnd; }
        public void setPriceTotalVnd(long priceTotalVnd) { this.priceTotalVnd = priceTotalVnd; }

        public double getDurationHours() { return durationHours; }
        public void setDurationHours(double durationHours) { this.durationHours = durationHours; }

        public int getComfortScore() { return comfortScore; }
        public void setComfortScore(int comfortScore) { this.comfortScore = comfortScore; }

        public boolean isParetoOptimal() { return paretoOptimal; }
        public void setParetoOptimal(boolean paretoOptimal) { this.paretoOptimal = paretoOptimal; }

        public String getTradeoffType() { return tradeoffType; }
        public void setTradeoffType(String tradeoffType) { this.tradeoffType = tradeoffType; }

        public String getRecommendationReason() { return recommendationReason; }
        public void setRecommendationReason(String recommendationReason) { this.recommendationReason = recommendationReason; }
    }
}
