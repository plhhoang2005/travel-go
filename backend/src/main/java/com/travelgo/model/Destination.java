package com.travelgo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public class Destination {
    private String id;
    private String name;
    private String region;
    private Map<String, Double> coordinates;
    private List<String> tags;

    @JsonProperty("uniqueness_score")
    private double uniquenessScore;

    @JsonProperty("avg_daily_cost_vnd")
    private long avgDailyCostVnd;

    public Destination() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Map<String, Double> getCoordinates() { return coordinates; }
    public void setCoordinates(Map<String, Double> coordinates) { this.coordinates = coordinates; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public double getUniquenessScore() { return uniquenessScore; }
    public void setUniquenessScore(double uniquenessScore) { this.uniquenessScore = uniquenessScore; }

    public long getAvgDailyCostVnd() { return avgDailyCostVnd; }
    public void setAvgDailyCostVnd(long avgDailyCostVnd) { this.avgDailyCostVnd = avgDailyCostVnd; }
}
