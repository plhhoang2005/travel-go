package com.travelgo.dto;

import java.util.List;

public class PlanTripRequest {
    private String origin;
    private int numDays;
    private int numPeople;
    private long budgetVnd;
    private List<String> preferences;
    private String priority; // "cheapest", "fastest", "balanced", "comfortable"

    public PlanTripRequest() {}

    public PlanTripRequest(String origin, int numDays, int numPeople, long budgetVnd, List<String> preferences, String priority) {
        this.origin = origin;
        this.numDays = numDays;
        this.numPeople = numPeople;
        this.budgetVnd = budgetVnd;
        this.preferences = preferences;
        this.priority = priority;
    }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public int getNumDays() { return numDays; }
    public void setNumDays(int numDays) { this.numDays = numDays; }

    public int getNumPeople() { return numPeople; }
    public void setNumPeople(int numPeople) { this.numPeople = numPeople; }

    public long getBudgetVnd() { return budgetVnd; }
    public void setBudgetVnd(long budgetVnd) { this.budgetVnd = budgetVnd; }

    public List<String> getPreferences() { return preferences; }
    public void setPreferences(List<String> preferences) { this.preferences = preferences; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
