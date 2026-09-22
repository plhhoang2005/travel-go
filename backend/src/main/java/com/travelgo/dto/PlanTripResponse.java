package com.travelgo.dto;

import java.util.List;
import java.util.Map;

public class PlanTripResponse {
    private String winnerId;
    private List<DestinationCard> topDestinations;
    private List<TransportOption> transportOptions;
    private List<ItineraryDay> itineraryDays;
    private BudgetBreakdown budgetBreakdown;
    private String aiExplanation;
    private Map<String, String> dataSources;
    private List<String> assumptions;

    public PlanTripResponse() {}

    public String getWinnerId() { return winnerId; }
    public void setWinnerId(String winnerId) { this.winnerId = winnerId; }

    public List<DestinationCard> getTopDestinations() { return topDestinations; }
    public void setTopDestinations(List<DestinationCard> topDestinations) { this.topDestinations = topDestinations; }

    public List<TransportOption> getTransportOptions() { return transportOptions; }
    public void setTransportOptions(List<TransportOption> transportOptions) { this.transportOptions = transportOptions; }

    public List<ItineraryDay> getItineraryDays() { return itineraryDays; }
    public void setItineraryDays(List<ItineraryDay> itineraryDays) { this.itineraryDays = itineraryDays; }

    public BudgetBreakdown getBudgetBreakdown() { return budgetBreakdown; }
    public void setBudgetBreakdown(BudgetBreakdown budgetBreakdown) { this.budgetBreakdown = budgetBreakdown; }

    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }

    public Map<String, String> getDataSources() { return dataSources; }
    public void setDataSources(Map<String, String> dataSources) { this.dataSources = dataSources; }

    public List<String> getAssumptions() { return assumptions; }
    public void setAssumptions(List<String> assumptions) { this.assumptions = assumptions; }

    // Nested Classes
    public static class DestinationCard {
        private String id;
        private String name;
        private double totalScore;
        private Map<String, Double> normalizedScores;
        private Map<String, Double> scoreContributions;
        private long estimatedCostVnd;
        private String weatherSource;
        private double avgTempMax;
        private double avgPrecipitation;
        private Double latitude;
        private Double longitude;
        private String region;

        public DestinationCard() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public double getTotalScore() { return totalScore; }
        public void setTotalScore(double totalScore) { this.totalScore = totalScore; }

        public Map<String, Double> getNormalizedScores() { return normalizedScores; }
        public void setNormalizedScores(Map<String, Double> normalizedScores) { this.normalizedScores = normalizedScores; }

        public Map<String, Double> getScoreContributions() { return scoreContributions; }
        public void setScoreContributions(Map<String, Double> scoreContributions) { this.scoreContributions = scoreContributions; }

        public long getEstimatedCostVnd() { return estimatedCostVnd; }
        public void setEstimatedCostVnd(long estimatedCostVnd) { this.estimatedCostVnd = estimatedCostVnd; }

        public String getWeatherSource() { return weatherSource; }
        public void setWeatherSource(String weatherSource) { this.weatherSource = weatherSource; }

        public double getAvgTempMax() { return avgTempMax; }
        public void setAvgTempMax(double avgTempMax) { this.avgTempMax = avgTempMax; }

        public double getAvgPrecipitation() { return avgPrecipitation; }
        public void setAvgPrecipitation(double avgPrecipitation) { this.avgPrecipitation = avgPrecipitation; }

        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }

        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }

        public String getRegion() { return region; }
        public void setRegion(String region) { this.region = region; }
    }

    public static class TransportOption {
        private String mode;
        private String displayName;
        private long priceTotalVnd;
        private double durationHours;
        private int comfortScore;
        private boolean isParetoOptimal;
        private String tradeoffType;
        private String recommendationReason;

        public TransportOption() {}

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

        public boolean isParetoOptimal() { return isParetoOptimal; }
        public void setParetoOptimal(boolean paretoOptimal) { isParetoOptimal = paretoOptimal; }

        public String getTradeoffType() { return tradeoffType; }
        public void setTradeoffType(String tradeoffType) { this.tradeoffType = tradeoffType; }

        public String getRecommendationReason() { return recommendationReason; }
        public void setRecommendationReason(String recommendationReason) { this.recommendationReason = recommendationReason; }
    }

    public static class ItineraryDay {
        private int day;
        private String title;
        private List<Activity> activities;

        public ItineraryDay() {}

        public int getDay() { return day; }
        public void setDay(int day) { this.day = day; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public List<Activity> getActivities() { return activities; }
        public void setActivities(List<Activity> activities) { this.activities = activities; }
    }

    public static class Activity {
        private String time;
        private String title;
        private long costVnd;
        private double durationHours;

        public Activity() {}
        public Activity(String time, String title, long costVnd, double durationHours) {
            this.time = time;
            this.title = title;
            this.costVnd = costVnd;
            this.durationHours = durationHours;
        }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public long getCostVnd() { return costVnd; }
        public void setCostVnd(long costVnd) { this.costVnd = costVnd; }

        public double getDurationHours() { return durationHours; }
        public void setDurationHours(double durationHours) { this.durationHours = durationHours; }
    }

    public static class BudgetBreakdown {
        private long transport;
        private long accommodation;
        private long food;
        private long attractions;
        private long remainingSafetyMargin;

        public BudgetBreakdown() {}

        public long getTransport() { return transport; }
        public void setTransport(long transport) { this.transport = transport; }

        public long getAccommodation() { return accommodation; }
        public void setAccommodation(long accommodation) { this.accommodation = accommodation; }

        public long getFood() { return food; }
        public void setFood(long food) { this.food = food; }

        public long getAttractions() { return attractions; }
        public void setAttractions(long attractions) { this.attractions = attractions; }

        public long getRemainingSafetyMargin() { return remainingSafetyMargin; }
        public void setRemainingSafetyMargin(long remainingSafetyMargin) { this.remainingSafetyMargin = remainingSafetyMargin; }
    }
}
